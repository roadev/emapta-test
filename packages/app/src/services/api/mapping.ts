import axios from "axios";
import { Mapping } from "../../types/mapping";
import { API_URL } from ".";

const endpoint = `${API_URL}/api/mappings`;

export const fetchMappings = async (): Promise<Mapping[]> => {
    const response = await axios.get<{ data: Mapping[] }>(endpoint);
    return response.data.data;
};

export const getMapping = async (id: string): Promise<Mapping> => {
    const response = await axios.get<Mapping>(`${endpoint}/${id}`);
    return response.data;
};

export const createMapping = async (mappingData: Mapping): Promise<Mapping> => {
    const requestBody = {
        ehr: "Athena",
        mapping: mappingData,
    };

    const response = await axios.post<Mapping>(API_URL, requestBody);
    return response.data;
};

export const updateMapping = async (id: string, mappingData: Mapping): Promise<Mapping> => {
    const requestBody = {
        ehr: "Athena",
        mapping: mappingData,
    };

    const response = await axios.put<Mapping>(`${API_URL}/${id}`, requestBody);
    return response.data;
};



export const deleteMapping = async (id: string): Promise<void> => {
    await axios.delete(`${endpoint}/${id}`);
};
