import { MappingModel } from "../models/mapping";

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

export async function getMappingForEHR(ehr: string): Promise<{ [inputField: string]: string }> {
  const mappingDoc = await MappingModel.findOne({ ehr });
  if (!mappingDoc) {
    throw new Error(`Mapping for EHR ${ehr} not found in database`);
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
  