
import Home from '@/screens/Home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter