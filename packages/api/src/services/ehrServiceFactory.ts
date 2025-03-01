import { IEHRService } from '../interfaces/IEHRService';
import { AthenaService } from './athenaService';

export function ehrServiceFactory(ehr: string): IEHRService {
  switch (ehr) {
    case 'Athena':
      return new AthenaService();
    // case 'Allscripts':
    //   return new AllscriptsService();
    default:
      throw new Error(`No service implemented for EHR: ${ehr}`);
  }
}
