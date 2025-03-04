import React, { useEffect, useState } from "react";
import { Table, Button, Container, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fetchPatients, deletePatient } from "../../services/api/patient";
import { Patient } from "../../types/patient";

const PatientsPage: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadPatients = async () => {
            try {
                const data = await fetchPatients();
                setPatients(data);
            } catch (err) {
                setError("Failed to load patients.");
            } finally {
                setLoading(false);
            }
        };
        loadPatients();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this patient?")) return;
        try {
            await deletePatient(id);
            setPatients(prevPatients => prevPatients.filter(patient => patient.id !== id));
        } catch (err) {
            setError("Failed to delete patient.");
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Patients</h2>
                <Button variant="success" onClick={() => navigate("/patients/new")}>
                    Add Patient
                </Button>
            </div>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && (
                <Table striped bordered hover responsive className="text-center">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Date of Birth</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.length > 0 ? (
                            patients.map(patient => (
                                <tr key={patient.id}>
                                    <td>{patient.name}</td>
                                    <td>{patient.gender}</td>
                                    <td>{format(new Date(patient.dob), "yyyy-MM-dd")}</td>
                                    <td>{patient.email}</td>
                                    <td>{patient.phone}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => navigate(`/patients/${patient.id}/edit`)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(patient.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center">No patients found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default PatientsPage;
