import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Mapping } from "../../../types/mapping";
import { createMapping, getMapping, updateMapping } from "../../../services/api/mapping";
import { Container, Form, Button, Card } from "react-bootstrap";

const MappingForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Mapping>();

    useEffect(() => {
        if (id) {
            getMapping(id).then((data) => {
                Object.entries(data).forEach(([key, value]) => {
                    setValue(key as keyof Mapping, value as never);
                });
            });
        }
    }, [id, setValue]);

    const onSubmit = async (data: Mapping) => {
        try {
            if (id) {
                await updateMapping(id, data);
            } else {
                await createMapping(data);
            }
            navigate("/mappings");
        } catch (error) {
            console.error("Error saving mapping", error);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-start mt-5">
            <Card style={{ width: "500px", padding: "20px" }} className="shadow-lg">
                <h2 className="text-center">{id ? "Edit Mapping" : "Add Mapping"}</h2>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Mapping Name</Form.Label>
                        <Form.Control {...register("name", { required: true })} />
                        {errors.name && <span className="text-danger">Mapping Name is required</span>}
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Gender Mapping</Form.Label>
                        <Form.Control {...register("gender", { required: true })} />
                        {errors.gender && <span className="text-danger">Gender Mapping is required</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Date of Birth Mapping</Form.Label>
                        <Form.Control 
                            type="date" // ✅ Ensures a date picker appears
                            {...register("dob", { required: true })} 
                        />
                        {errors.dob && <span className="text-danger">Date of Birth Mapping is required</span>}
                    </Form.Group>


                    <Button variant="primary" type="submit" className="w-100">
                        {id ? "Update" : "Add"} Mapping
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default MappingForm;
