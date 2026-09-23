import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { ProtectedRouteProps } from "../../types/authContext";

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
