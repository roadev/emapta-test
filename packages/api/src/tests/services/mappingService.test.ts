import { getMappingForEHR, transformPatientData, mapPatientData } from '../../services/mappingService';
import redisClient from '../../services/redisClient';
import { MappingModel } from '../../models/mapping';
import { cacheHitCounter, cacheMissCounter } from '../../metrics';

// Mock the redis client
jest.mock('../../services/redisClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

// Mock the Mongoose model
jest.mock('../../models/mapping', () => ({
  MappingModel: {
    findOne: jest.fn(),
  },
}));

// Mock the Prometheus counters
jest.mock('../../metrics', () => ({
  cacheHitCounter: { inc: jest.fn() },
  cacheMissCounter: { inc: jest.fn() },
}));

describe('mappingService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMappingForEHR', () => {
    it('should return cached mapping if found in Redis and increment cacheHit', async () => {
      (redisClient.get as jest.Mock).mockResolvedValueOnce(JSON.stringify({ name: 'PATIENT_IDENT_NAME' }));

      const mapping = await getMappingForEHR('Athena');

      expect(redisClient.get).toHaveBeenCalledWith('mapping:Athena');
      expect(cacheHitCounter.inc).toHaveBeenCalledTimes(1);
      expect(mapping).toEqual({ name: 'PATIENT_IDENT_NAME' });
      expect(MappingModel.findOne).not.toHaveBeenCalled();
      expect(cacheMissCounter.inc).not.toHaveBeenCalled();
    });

    it('should fetch mapping from DB if not in Redis and increment cacheMiss', async () => {
      (redisClient.get as jest.Mock).mockResolvedValueOnce(null); // No cache
      (MappingModel.findOne as jest.Mock).mockResolvedValueOnce({
        ehr: 'Athena',
        mapping: { name: 'PATIENT_IDENT_NAME' },
      });

      const mapping = await getMappingForEHR('Athena');

      expect(cacheMissCounter.inc).toHaveBeenCalledTimes(1);
      expect(MappingModel.findOne).toHaveBeenCalledWith({ ehr: 'Athena' });
      expect(mapping).toEqual({ name: 'PATIENT_IDENT_NAME' });
      expect(redisClient.set).toHaveBeenCalledWith(
        'mapping:Athena',
        JSON.stringify({ name: 'PATIENT_IDENT_NAME' }),
        { EX: 3600 }
      );
    });

    it('should throw an error if the mapping is not found in DB', async () => {
      (redisClient.get as jest.Mock).mockResolvedValueOnce(null);
      (MappingModel.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(getMappingForEHR('UnknownEHR')).rejects.toThrow('Mapping for EHR UnknownEHR not found in database');
    });

    it('should log Redis get error but still proceed to fetch from DB', async () => {
      // Simulate an error in redis.get
      (redisClient.get as jest.Mock).mockRejectedValueOnce(new Error('Redis GET Error'));
      // DB returns a valid doc
      (MappingModel.findOne as jest.Mock).mockResolvedValueOnce({
        ehr: 'Athena',
        mapping: { name: 'PATIENT_IDENT_NAME' },
      });

      const mapping = await getMappingForEHR('Athena');
      expect(mapping).toEqual({ name: 'PATIENT_IDENT_NAME' });
      // Because redis get failed, we do a DB fetch
      expect(MappingModel.findOne).toHaveBeenCalled();
    });

    it('should log Redis set error if storing fails (but return the DB mapping)', async () => {
      (redisClient.get as jest.Mock).mockResolvedValueOnce(null);
      (MappingModel.findOne as jest.Mock).mockResolvedValueOnce({
        ehr: 'Athena',
        mapping: { name: 'PATIENT_IDENT_NAME' },
      });
      (redisClient.set as jest.Mock).mockRejectedValueOnce(new Error('Redis SET Error'));

      const mapping = await getMappingForEHR('Athena');
      expect(mapping).toEqual({ name: 'PATIENT_IDENT_NAME' });
    });
  });

  describe('transformPatientData', () => {
    it('should transform patient data using the mapping from getMappingForEHR', async () => {
      // Mock getMappingForEHR to return a known mapping
      (redisClient.get as jest.Mock).mockResolvedValueOnce(JSON.stringify({
        name: 'PATIENT_IDENT_NAME',
        gender: 'GENDER_OF_PATIENT',
        dob: 'DATE_OF_BIRTH_PATIENT',
      }));

      const inputData = { name: 'John Doe', gender: 'Male', dob: '1990-01-01' };
      const transformed = await transformPatientData('Athena', inputData);
      expect(transformed).toEqual({
        PATIENT_IDENT_NAME: 'John Doe',
        GENDER_OF_PATIENT: 'Male',
        DATE_OF_BIRTH_PATIENT: '1990-01-01',
      });
    });

    it('should throw if getMappingForEHR throws (e.g., unknown EHR)', async () => {
      (redisClient.get as jest.Mock).mockResolvedValueOnce(null);
      (MappingModel.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(transformPatientData('UnknownEHR', {})).rejects.toThrow('Mapping for EHR UnknownEHR not found in database');
    });
  });

  describe('mapPatientData', () => {
    it('should map Athena data with the local "mappings" object', () => {
      const inputData = { name: 'Alice', gender: 'Female', dob: '1995-07-10' };
      const mapped = mapPatientData('Athena', inputData);
      expect(mapped).toEqual({
        PATIENT_IDENT_NAME: 'Alice',
        GENDER_OF_PATIENT: 'Female',
        DATE_OF_BIRTH_PATIENT: '1995-07-10',
      });
    });

    it('should throw an error if the EHR is not in local "mappings"', () => {
      expect(() => mapPatientData('NonExistent', {})).toThrow('Mapping for EHR NonExistent not found');
    });
  });
});
