import React, { useEffect, useState } from "react";
import { Table, Button, Container, Spinner, Alert } from "react-bootstrap";
import { fetchPatients, deletePatient } from "../../services/api/patient";
import { Patient } from "../../types/patient";

const PatientsPage: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
            <h2>Patients</h2>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && (
                <Table striped bordered hover responsive>
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
                                    <td>{patient.dob}</td>
                                    <td>{patient.email}</td>
                                    <td>{patient.phone}</td>
                                    <td>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(patient.id)}>
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
