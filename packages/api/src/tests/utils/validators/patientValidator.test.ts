import { patientSchema, validatePatient } from '../../../utils/validators/patientValidator';

describe('patientValidator', () => {
  describe('patientSchema', () => {
    it('should parse valid patient data without error', () => {
      const validData = {
        name: 'John Doe',
        gender: 'Male',
        dob: '1990-01-01',
      };
      expect(() => patientSchema.parse(validData)).not.toThrow();
    });

    it('should throw an error for invalid patient data', () => {
      const invalidData = {
        name: '',
        gender: '',
        dob: '',
      };
      expect(() => patientSchema.parse(invalidData)).toThrow();
    });
  });

  describe('validatePatient function', () => {
    it('should return true for valid patient data', () => {
      const validData = {
        name: 'Alice',
        gender: 'Female',
        dob: '1995-05-15',
      };

      const isValid = validatePatient(validData); 
      expect(isValid).toBe(true);
    });

    it('should return false for invalid data', () => {
      const invalidData = {
        name: '',
        gender: '',
        dob: '',
      };
      
      const isValid = validatePatient(invalidData);
      expect(isValid).toBe(false);
    });
  });
});