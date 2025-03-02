import { Router } from "express";
import { createMapping, getMapping, updateMapping, deleteMapping, getAllMappings } from "../controllers/mappingController";

const router = Router();

router.post("/", createMapping);
router.get("/", getAllMappings);
router.get("/:ehr", getMapping);
router.put("/:ehr", updateMapping);
router.delete("/:ehr", deleteMapping);

export default router;
