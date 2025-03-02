import { z } from "zod";

export const ehrParamSchema = z.object({
  ehr: z.string().min(1, { message: "The 'ehr' parameter is required." }),
});
