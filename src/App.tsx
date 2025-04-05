import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Vans from './pages/Courses/Courses'
import VanDetail from './pages/Courses/CourseDetails'
import Login from './pages/Login'
import AuthRequired from './components/AuthRequired'
import EspaceEtudLayout from './components/EspaceEtudLayout'
import NotFound from './pages/NotFound'
import MesCours from './pages/espaceEtudiant/MesCours'
import Notifications from './pages/espaceEtudiant/Notifications'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="courses" element={<Vans />} />
          <Route path="courses/:id" element={<VanDetail />} />
          <Route path="login" element={<Login />} />

          <Route element={<AuthRequired />}>
            <Route path="espace-etudiant" element={<EspaceEtudLayout />}>
              <Route index element={<MesCours />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
