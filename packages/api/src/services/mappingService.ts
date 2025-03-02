import redisClient from "./redisClient";
import { MappingModel } from "../models/mapping";

export async function getMappingForEHR(ehr: string): Promise<{ [inputField: string]: string }> {
  const cacheKey = `mapping:${ehr}`;
  
  try {
    const cachedMapping = await redisClient.get(cacheKey);
    if (cachedMapping) {
      console.log("Returning cached mapping for:", ehr);
      return JSON.parse(cachedMapping);
    }
  } catch (err) {
    console.error("Redis error (get):", err);
  }
  
  const mappingDoc = await MappingModel.findOne({ ehr });
  if (!mappingDoc) {
    throw new Error(`Mapping for EHR ${ehr} not found in database`);
  }
  
  try {
    await redisClient.set(cacheKey, JSON.stringify(mappingDoc.mapping), { EX: 3600 });
  } catch (err) {
    console.error("Redis error (set):", err);
  }
  
  return mappingDoc.mapping;
}

export async function transformPatientData(ehr: string, inputData: any): Promise<any> {
  const ehrMapping = await getMappingForEHR(ehr);
  const transformedData: any = {};
  for (const key in ehrMapping) {
    const targetField = ehrMapping[key];
    transformedData[targetField] = inputData[key];
  }
  return transformedData;
}

const mappings: { [ehr: string]: { [inputField: string]: string } } = {
    Athena: {
      name: 'PATIENT_IDENT_NAME',
      gender: 'GENDER_OF_PATIENT',
      dob: 'DATE_OF_BIRTH_PATIENT',
    },
    Allscripts: {
      name: 'NAME_OF_PAT',
      gender: 'GENDER_PAT',
      dob: 'BIRTHDATE_OF_PAT',
    },
  };

  export function mapPatientData(ehr: string, inputData: any): any {
    const ehrMapping = mappings[ehr];
    if (!ehrMapping) {
      throw new Error(`Mapping for EHR ${ehr} not found`);
    }
  
    const transformedData: any = {};
    for (const key in ehrMapping) {
      const targetField = ehrMapping[key];
      transformedData[targetField] = inputData[key];
    }
    return transformedData;
  }
  
