import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import { AuthContext } from "./context/AuthContext";
import PatientsPage from "./pages/Patients";
import PatientForm from "./pages/Patients/PatientForm";

const Dashboard: React.FC = () => <h1 className="text-center">Dashboard</h1>;

const AppRoutes: React.FC = () => {
  const auth = useContext(AuthContext);

  return (
      <Routes>
          <Route path="/login" element={auth?.user ? <Navigate to="/" replace /> : <AuthForm />} />
          
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/patients/new" element={<ProtectedRoute><PatientForm /></ProtectedRoute>} />
          <Route path="/patients/:id/edit" element={<ProtectedRoute><PatientForm /></ProtectedRoute>} />
      </Routes>
  );
};

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
};

export default App;

