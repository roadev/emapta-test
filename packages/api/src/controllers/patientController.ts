import { Request, Response, NextFunction } from 'express';
import { z } from "zod";
import { mapPatientData } from '../services/mappingService';
import { ehrServiceFactory } from '../services/ehrServiceFactory';
import { patientQuerySchema } from "../utils/validators/patientQueryValidator";

export async function submitPatientData(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ehr, patientData } = req.body;
    if (!ehr || !patientData) {
      res.status(400).json({ error: 'ehr and patientData are required' });
    }

    const transformedData = mapPatientData(ehr, patientData);

    const ehrService = ehrServiceFactory(ehr);
    await ehrService.sendPatientData(transformedData);

    res.status(200).json({ message: 'Data sent successfully' });
  } catch (error: any) {
    next(error);
  }
};

type PatientQuery = z.infer<typeof patientQuerySchema>;

export const getPatients = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { page, limit } = req.query as unknown as PatientQuery;
    res.status(200).json({ message: `Returning page ${page} with ${limit} records per page.` });
  } catch (error) {
    next(error);
  }
};