import { Router } from "express";
import { createPatient, getPatient, updatePatient, deletePatient, listPatients, transformPatient } from "../controllers/patientController";
import { validateRequestParts } from "../middleware/validateRequestParts";
import { patientSchema } from "../utils/validators/patientValidator";
import { patientQuerySchema } from "../utils/validators/patientQueryValidator";
import { authenticate } from "../middleware/authentication";

const router = Router();

router.use(authenticate);

router.post("/", validateRequestParts({ body: patientSchema }), createPatient);
router.get("/:id", getPatient);
router.put("/:id", validateRequestParts({ body: patientSchema }), updatePatient);
router.delete("/:id", deletePatient);
router.get("/", validateRequestParts({ query: patientQuerySchema }), listPatients);

// Transform a patient's data using dynamic mapping integration
// Example: GET /api/patients/:id/transform?ehr=Athena
router.get("/:id/transform", transformPatient);

export default router;
