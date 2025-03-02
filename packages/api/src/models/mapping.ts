import { Schema, model, Document } from "mongoose";

export interface IMapping extends Document {
  ehr: string;
  mapping: { [inputField: string]: string };
  createdAt: Date;
  updatedAt: Date;
}

const mappingSchema = new Schema<IMapping>(
  {
    ehr: { type: String, required: true, unique: true },
    mapping: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const MappingModel = model<IMapping>("Mapping", mappingSchema);
