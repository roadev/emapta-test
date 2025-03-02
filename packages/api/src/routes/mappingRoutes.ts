import { Router } from "express";
import { createMapping, getMapping, updateMapping, deleteMapping, getAllMappings } from "../controllers/mappingController";
import { validateRequestParts } from "../middleware/validateRequestParts";
import { authenticate } from "../middleware/authentication";
import { mappingSchema } from "../utils/validators/mappingValidator";
import { ehrParamSchema } from "../utils/validators/paramsValidator";

const router = Router();

router.use(authenticate);

router.post("/", validateRequestParts({ body: mappingSchema }), createMapping);
router.put("/:ehr", validateRequestParts({ params: ehrParamSchema, body: mappingSchema }), updateMapping);
router.get("/:ehr", validateRequestParts({ params: ehrParamSchema }), getMapping);
router.get("/", getAllMappings);
router.delete("/:ehr", validateRequestParts({ params: ehrParamSchema }), deleteMapping);

export default router;
