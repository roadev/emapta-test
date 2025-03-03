import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  dob: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date({ invalid_type_error: "Invalid date" })),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  emergencyContact: z
    .object({
      name: z.string().min(1, { message: "Emergency contact name required" }),
      phone: z.string().min(1, { message: "Emergency contact phone required" }),
    })
    .optional(),
  primaryCarePhysician: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  medicalHistory: z.string().optional(),
  socialHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  languagePreference: z.string().optional(),
  notes: z.string().optional(),
});

export function validatePatient(data: unknown): boolean {
  const result = patientSchema.safeParse(data);
  return result.success; // true if validation passes, false otherwise
};
