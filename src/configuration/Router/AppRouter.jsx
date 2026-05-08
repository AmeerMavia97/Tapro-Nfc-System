
import Home from '@/screens/Home/Home'
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
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
