import { Request, Response, NextFunction, RequestHandler } from 'express';
import { PatientModel } from '../models/patient';
import { mapPatientData } from '../services/mappingService';
import { transformPatientData } from "../services/mappingService";
import { ehrServiceFactory } from '../services/ehrServiceFactory';
import redisClient from "../services/redisClient";

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    email?: string;
  };
}

// Generates a cache key based on pagination parameters
function getPatientListCacheKey(page: number, limit: number): string {
  return `patients:list:page=${page}:limit=${limit}`;
}

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

export const getPatients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit } = req.query as unknown as { page: number; limit: number };

    const cacheKey = getPatientListCacheKey(page, limit);

    // Check if data is cached in Redis
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log("Returning cached patient list.");
        res.status(200).json(JSON.parse(cached));
        return;
      }
    } catch (cacheErr) {
      console.error("Error retrieving patient list from cache:", cacheErr);
    }

    const skip = (page - 1) * limit;

    const patients = await PatientModel.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    
    const totalPatients = await PatientModel.countDocuments();

    const response = {
      message: `Returning page ${page} with ${limit} records per page.`,
      data: patients,
      total: totalPatients,
    };

    try {
      await redisClient.set(cacheKey, JSON.stringify(response), { EX: 3600 });
    } catch (cacheErr) {
      console.error("Error caching patient list:", cacheErr);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createPatient: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const patientData = req.body;
    const newPatient = new PatientModel(patientData);
    await newPatient.save();
    res.status(201).json({ 
      patient: newPatient, 
      message: req.t("patient_created") 
    });
  } catch (error) {
    next(error);
  }
};

export const getPatient: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate if the id is a valid 24-character hexadecimal string.
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).json({ error: req.t("invalid_patient_id") });
      return;
    }

    const patient = await PatientModel.findById(id);
    if (!patient) {
      res.status(404).json({ error: req.t("patient_not_found") });
      return;
    }
    res.status(200).json(patient);
  } catch (error: any) {
    if (error.name === "CastError") {
      res.status(400).json({ error: req.t("invalid_patient_id") });
      return;
    }
    next(error);
  }
};


export const updatePatient: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { id } = req.params;
    const update = req.body;

    // Cast req to AuthenticatedRequest so that user is recognized
    const authReq = req as AuthenticatedRequest;
    const userIdentifier = authReq.user ? (authReq.user.email || authReq.user.id) : "unknown";

    const query = PatientModel.findByIdAndUpdate(id, update, { new: true });
    query.setOptions({ user: userIdentifier });

    const updatedPatient = await query;
    if (!updatedPatient) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    res.status(200).json(updatedPatient);
  } catch (error) {
    next(error);
  }
};



export const deletePatient: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedPatient = await PatientModel.findByIdAndDelete(id);
    if (!deletedPatient) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const listPatients: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const skip = (page - 1) * limit;
    const patients = await PatientModel.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await PatientModel.countDocuments();
    res.status(200).json({ data: patients, total, page, limit });
  } catch (error) {
    next(error);
  }
};

export const transformPatient: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { id } = req.params;
    const { ehr } = req.query as { ehr?: string };
    if (!ehr) {
      res.status(400).json({ error: "EHR query parameter is required" });
      return;
    }
    const patient = await PatientModel.findById(id);
    if (!patient) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    const transformedData = await transformPatientData(ehr, patient.toObject());
    res.status(200).json(transformedData);
  } catch (error) {
    next(error);
  }
};