import Home from "@/screens/Home/Home"
import AdminDashboard from "@/screens/AdminDashboard/AdminDashboard"
import AdminCodes from "@/screens/AdminDashboard/AdminCodes"
import AdminBatches from "@/screens/AdminDashboard/AdminBatches"
import AdminOwners from "@/screens/AdminDashboard/AdminOwners"
import AdminAnalytics from "@/screens/AdminDashboard/AdminAnalytics"
import AdminLogs from "@/screens/AdminDashboard/AdminLogs"
import AdminSettings from "@/screens/AdminDashboard/AdminSettings"
import OwnerDashboard from "@/screens/OwnerDashboard/OwnerDashboard"
import ChangePassword from "@/screens/auth/ChangePassword"
import Login from "@/screens/auth/Login"
import Register from "@/screens/auth/Register"
import ResetPassword from "@/screens/auth/ResetPassword"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import RoleProtectedRoute from "@/configuration/Router/RoleProtectedRoute"
import PublicOnlyRoute from "@/configuration/Router/PublicOnlyRoute"
import ActivateProduct from "@/screens/ActivePage/ActivateProduct"
import PublicRedirect from "@/screens/ActivePage/PublicRedirect"

const AdminProtected = ({ children }) => (
  <RoleProtectedRoute allowedRole="admin">{children}</RoleProtectedRoute>
)

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

        <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
        <Route path="/admin-dashboard" element={<AdminProtected><AdminDashboard /></AdminProtected>} />
        <Route path="/admin-dashboard/codes" element={<AdminProtected><AdminCodes /></AdminProtected>} />
        <Route path="/admin-dashboard/batches" element={<AdminProtected><AdminBatches /></AdminProtected>} />
        <Route path="/admin-dashboard/business-owners" element={<AdminProtected><AdminOwners /></AdminProtected>} />
        <Route path="/admin-dashboard/analytics" element={<AdminProtected><AdminAnalytics /></AdminProtected>} />
        <Route path="/admin-dashboard/activity-logs" element={<AdminProtected><AdminLogs /></AdminProtected>} />
        <Route path="/admin-dashboard/settings" element={<AdminProtected><AdminSettings /></AdminProtected>} />
        <Route path="/activate/:code" element={<ActivateProduct />} />
        <Route path="/:code" element={<PublicRedirect />} />
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
