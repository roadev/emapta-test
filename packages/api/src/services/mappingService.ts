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
  