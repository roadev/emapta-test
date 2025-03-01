import { Router } from 'express';
import { submitPatientData } from '../controllers/patientController';

const router = Router();

router.post('/', submitPatientData);

export default router;
