export interface Patient {
    id?: string;
    name: string;
    gender: "Male" | "Female" | "Other";
    dob: string;
    address: string;
    phone: string;
    email: string;
    emergencyContact: {
        name: string;
        phone: string;
    };
    primaryCarePhysician: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    allergies: string[];
    currentMedications: string[];
    medicalHistory: string;
    socialHistory: string;
    familyHistory: string;
    languagePreference: "en" | "es";
    notes: string;
}
