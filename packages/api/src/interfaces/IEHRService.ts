export interface IEHRService {
    sendPatientData(data: any): Promise<void>;
}
  