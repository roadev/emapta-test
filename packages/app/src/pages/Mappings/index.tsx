import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMappings, deleteMapping } from "../../services/api/mapping";
import { Mapping } from "../../types/mapping";
import { Table, Button, Container, Spinner, Alert } from "react-bootstrap";

const MappingsPage: React.FC = () => {
    const [mappings, setMappings] = useState<Mapping[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadMappings = async () => {
            try {
                const data = await fetchMappings();
                setMappings(data);
            } catch (err) {
                setError("Failed to load mappings.");
            } finally {
                setLoading(false);
            }
        };
        loadMappings();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this mapping?")) return;
        try {
            await deleteMapping(id);
            setMappings(prevMappings => prevMappings.filter(mapping => mapping.id !== id));
        } catch (err) {
            setError("Failed to delete mapping.");
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Mappings</h2>
                <Button variant="success" onClick={() => navigate("/mappings/new")}>
                    Add Mapping
                </Button>
            </div>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && (
                <Table striped bordered hover responsive className="text-center">
                    <thead>
                        <tr>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mappings.length > 0 ? (
                            mappings.map(mapping => (
                                <tr key={mapping.id}>
                                    <td>{mapping.source}</td>
                                    <td>{mapping.destination}</td>
                                    <td>{mapping.type}</td>
                                    <td>
                                        <Button variant="primary" size="sm" className="me-2" onClick={() => navigate(`/mappings/${mapping.id}/edit`)}>
                                            Edit
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(mapping.id)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center">No mappings found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default MappingsPage;
