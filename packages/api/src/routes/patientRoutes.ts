import { Router } from 'express';
import { submitPatientData } from '../controllers/patientController';
import { getPatients } from "../controllers/patientController";
import { validateRequestParts } from "../middleware/validateRequestParts";
import { patientQuerySchema } from "../utils/validators/patientQueryValidator";

const router = Router();

router.post('/', submitPatientData);
router.get("/list", validateRequestParts({ query: patientQuerySchema }), getPatients);

export default router;
