import { z } from "zod";

export const mappingSchema = z.object({
  ehr: z.string().min(1, { message: "ehr is required" }),
  mapping: z.record(z.string(), z.string()),
});
