import { Schema, model, Document } from "mongoose";

export interface IAuditLog extends Document {
  collectionName: string;
  documentId: string;
  operation: "create" | "update" | "delete";
  changedBy: string;
  before?: any;
  after?: any;
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    collectionName: { type: String, required: true },
    documentId: { type: String, required: true },
    operation: { type: String, required: true, enum: ["create", "update", "delete"] },
    changedBy: { type: String, required: true },
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const AuditLogModel = model<IAuditLog>("AuditLog", auditLogSchema);
