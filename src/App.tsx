// dependencies
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

// components
import { PoseDetector } from "./components"

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PoseDetector />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
