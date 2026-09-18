import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ResponsibleUsePage from './pages/ResponsibleUsePage'
import NotFoundPage from './pages/NotFoundPage'
import ContactPage from './pages/ContactPage'

const AddToPdfPage = lazy(() => import('./pages/AddToPdfPage'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/responsible-use" element={<ResponsibleUsePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/add-to-pdf"
          element={
            <Suspense fallback={null}>
              <AddToPdfPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
