import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form, Button, Container, Card } from "react-bootstrap";

const AuthForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const auth = useContext(AuthContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth) return;
        isLogin ? await auth.loginUser(email, password) : await register(email, password);
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "400px" }} className="p-4">
                <h2 className="text-center">{isLogin ? "Login" : "Register"}</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                        {isLogin ? "Login" : "Register"}
                    </Button>
                </Form>
                <Button variant="link" className="mt-2" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Switch to Register" : "Switch to Login"}
                </Button>
            </Card>
        </Container>
    );
};

export default AuthForm;
