import { Schema, model, Document, CallbackError } from "mongoose";
import { AuditLogModel } from "./auditLog";

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

patientSchema.pre("findOneAndUpdate", async function (next: (err?: CallbackError | null) => void) {
    try {
      const query = this.getQuery();
      const currentDoc = await this.model.findOne(query).lean();
      this.setOptions({ currentDoc });
      next();
    } catch (err) {
      next(err as any);
    }
});
  
  patientSchema.post("findOneAndUpdate", async function (result) {
    try {
      const currentDoc = this.getOptions().currentDoc;
      const updatedDoc = result;
      const changedBy = this.getOptions().user;
      await AuditLogModel.create({
        collectionName: "Patient",
        documentId: updatedDoc?._id,
        operation: "update",
        changedBy,
        before: currentDoc,
        after: updatedDoc,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Audit log error:", err);
    }
  });

export const PatientModel = model<IPatient>("Patient", patientSchema);
