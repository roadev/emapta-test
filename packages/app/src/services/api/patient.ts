import axios from "axios";
import { Patient } from "../../types/patient";
import { API_URL } from ".";

const endpoint = `${API_URL}/api/patients`;

export interface PatientRequest {
    ehr: string;
    patientData: Patient;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchPatients = async (): Promise<Patient[]> => {
    const response = await axios.get<{ data: Patient[] }>(endpoint, getAuthHeaders());
    return response.data.data;
};


export const getPatient = async (id: string) => {
    const response = await axios.get(`${endpoint}/${id}`, getAuthHeaders());
    return response.data;
};

export const createPatient = async (patientData: Patient): Promise<Patient> => {
    const response = await axios.post<Patient>(endpoint, patientData, getAuthHeaders()); // ✅ Send only `patientData`
    return response.data;
};

export const updatePatient = async (id: string, patientData: Patient): Promise<Patient> => {
    const response = await axios.put<Patient>(`${endpoint}/${id}`, patientData, getAuthHeaders()); // ✅ Send only `patientData`
    return response.data;
};

export const deletePatient = async (id: string) => {
    await axios.delete(`${endpoint}/${id}`, getAuthHeaders());
};

export const transformPatientData = async (id: string, ehr: string) => {
    const response = await axios.get(`${endpoint}/${id}/transform?ehr=${ehr}`, getAuthHeaders());
    return response.data;
};
