import Home from "@/screens/Home/Home"
import AdminDashboard from "@/screens/AdminDashboard/AdminDashboard"
import OwnerDashboard from "@/screens/OwnerDashboard/OwnerDashboard"
import ChangePassword from "@/screens/auth/ChangePassword"
import Login from "@/screens/auth/Login"
import Register from "@/screens/auth/Register"
import ResetPassword from "@/screens/auth/ResetPassword"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import RoleProtectedRoute from "@/configuration/Router/RoleProtectedRoute"
import PublicOnlyRoute from "@/configuration/Router/PublicOnlyRoute"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicOnlyRoute>
              <ResetPassword />
            </PublicOnlyRoute>
          }
        />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route
          path="/admin-dashboard"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/owner-dashboard"
          element={
            <RoleProtectedRoute allowedRole="user">
              <OwnerDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
