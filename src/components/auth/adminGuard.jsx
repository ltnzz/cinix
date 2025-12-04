import React from "react";
import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "../../utils/auth.js";

const AdminGuard = ({ children }) => {
    return isAdminAuthenticated() ? children : <Navigate to="/admin/login" replace />;
};

export default AdminGuard;