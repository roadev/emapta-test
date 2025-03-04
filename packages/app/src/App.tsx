import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import { AuthContext } from "./context/AuthContext";
import PatientsPage from "./pages/Patients";

const Dashboard: React.FC = () => <h1 className="text-center">Dashboard</h1>;

const AppRoutes: React.FC = () => {
  const auth = useContext(AuthContext);

  return (
      <Routes>
          {/* Redirect users trying to access login when already logged in */}
          <Route path="/login" element={auth?.user ? <Navigate to="/" replace /> : <AuthForm />} />
          
          {/* Protect all private routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />

          {/* Catch-all route to avoid unwanted redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
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

