import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import { Patient } from "../../../types/patient";
import { createPatient, getPatient, updatePatient } from "../../../services/api/patient";
// import { PatientRequest } from "../../../services/api/patient";

const removeEmptyFields = (data: Patient) => {
    const cleanedData: any = { ...data };

    Object.keys(cleanedData).forEach((key) => {
        if (cleanedData[key] === "") {
            delete cleanedData[key];
        }
    });

    if (Array.isArray(cleanedData.allergies) && cleanedData.allergies.length === 0) {
        delete cleanedData.allergies;
    }

    if (Array.isArray(cleanedData.currentMedications) && cleanedData.currentMedications.length === 0) {
        delete cleanedData.currentMedications;
    }

    return cleanedData;
};

const PatientForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Patient>();

    useEffect(() => {
        if (id) {
            getPatient(id).then((data) => {
                Object.keys(data).forEach((key) => {
                    setValue(key as keyof Patient, data[key]);
                });
            });
        }
    }, [id, setValue]);

    const onSubmit = async (data: Patient) => {
        console.log("Raw Form Data:", data);
    
        const formattedData = removeEmptyFields({
            ...data,
            allergies: data.allergies ? data.allergies.split(",").map((a) => a.trim()) : [],
            currentMedications: data.currentMedications ? data.currentMedications.split(",").map((m) => m.trim()) : [],
        });
    
        console.log("Formatted Data Before Submission:", formattedData);
    
        try {
            if (id) {
                await updatePatient(id, formattedData);
            } else {
                await createPatient(formattedData);
            }
            navigate("/patients");
        } catch (error) {
            console.error("Error saving patient", error);
        }
    };
    
    return (
        <Container className="d-flex justify-content-center align-items-start mt-5">
            <Card style={{ width: "600px", padding: "20px" }} className="shadow-lg">
                <h2 className="text-center">{id ? "Edit Patient" : "Add Patient"}</h2>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control {...register("name", { required: true })} />
                        {errors.name && <span className="text-danger">Name is required</span>}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select {...register("gender", { required: true })}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </Form.Select>
                        {errors.gender && <span className="text-danger">Gender is required</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" {...register("dob", { required: true })} />
                        {errors.dob && <span className="text-danger">Date of Birth is required</span>}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control {...register("phone", { required: true })} />
                        {errors.phone && <span className="text-danger">Phone is required</span>}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control {...register("address", { required: true })} />
                        {errors.address && <span className="text-danger">Address is required</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Primary Care Physician</Form.Label>
                        <Form.Control {...register("primaryCarePhysician")} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Insurance Provider</Form.Label>
                        <Form.Control {...register("insuranceProvider")} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Insurance Policy Number</Form.Label>
                        <Form.Control {...register("insurancePolicyNumber")} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Emergency Contact Name</Form.Label>
                        <Form.Control {...register("emergencyContact.name", { required: true })} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Emergency Contact Phone</Form.Label>
                        <Form.Control {...register("emergencyContact.phone", { required: true })} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Allergies</Form.Label>
                        <Form.Control {...register("allergies")} placeholder="Comma-separated list" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Current Medications</Form.Label>
                        <Form.Control {...register("currentMedications")} placeholder="Comma-separated list" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Medical History</Form.Label>
                        <Form.Control as="textarea" {...register("medicalHistory")} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Social History</Form.Label>
                        <Form.Control as="textarea" {...register("socialHistory")} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Family History</Form.Label>
                        <Form.Control as="textarea" {...register("familyHistory")} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Language Preference</Form.Label>
                        <Form.Select {...register("languagePreference", { required: true })}>
                            <option value="">Select Language</option>
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                        </Form.Select>
                        {errors.languagePreference && <span className="text-danger">Language Preference is required</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control as="textarea" {...register("notes")} />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                        {id ? "Update" : "Add"} Patient
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default PatientForm;
