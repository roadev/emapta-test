import { Request, Response, NextFunction } from 'express';
import { mapPatientData } from '../services/mappingService';
import { ehrServiceFactory } from '../services/ehrServiceFactory';

export async function submitPatientData(req: Request, res: Response, next: NextFunction) {
  try {
    const { ehr, patientData } = req.body;
    if (!ehr || !patientData) {
      return res.status(400).json({ error: 'ehr and patientData are required' });
    }

    const transformedData = mapPatientData(ehr, patientData);

    const ehrService = ehrServiceFactory(ehr);
    await ehrService.sendPatientData(transformedData);

    res.status(200).json({ message: 'Data sent successfully' });
  } catch (error: any) {
    next(error);
  }
}
