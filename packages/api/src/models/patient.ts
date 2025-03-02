import { Schema, model, Document } from "mongoose";

export interface IPatient extends Document {
  name: string;
  gender: string;
  dob: Date;
  address?: string;
  phone?: string;
  email?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  primaryCarePhysician?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  allergies?: string[];
  currentMedications?: string[];
  medicalHistory?: string;
  socialHistory?: string;
  familyHistory?: string;
  languagePreference?: string;
  notes?: string;
}

const patientSchema = new Schema<IPatient>(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
    },
    primaryCarePhysician: { type: String },
    insuranceProvider: { type: String },
    insurancePolicyNumber: { type: String },
    allergies: { type: [String] },
    currentMedications: { type: [String] },
    medicalHistory: { type: String },
    socialHistory: { type: String },
    familyHistory: { type: String },
    languagePreference: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export const PatientModel = model<IPatient>("Patient", patientSchema);
