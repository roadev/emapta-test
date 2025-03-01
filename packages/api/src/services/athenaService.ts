// import axios from 'axios';
import { IEHRService } from '../interfaces/IEHRService';

export class AthenaService implements IEHRService {
  async sendPatientData(data: any): Promise<void> {
    console.log('Sending data to Athena:', data);
  }
}
