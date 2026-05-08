
import Home from '@/screens/Home/Home'
import AdminDashboard from '@/screens/AdminDashboard/AdminDashboard'
import OwnerDashboard from '@/screens/OwnerDashboard/OwnerDashboard'
import ChangePassword from '@/screens/auth/ChangePassword'
import Login from '@/screens/auth/Login'
import Register from '@/screens/auth/Register'
import ResetPassword from '@/screens/auth/ResetPassword'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
