export interface Patient {
    id: string;
    name: string;
    gender: "male" | "female" | "other";
    dob: string;
    address: string;
    phone: string;
    email: string;
    emergencyContact: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    primaryCarePhysician: string;
    allergies: string[];
    currentMedications: string[];
    medicalHistory: string;
    socialHistory: string;
    familyHistory: string;
}