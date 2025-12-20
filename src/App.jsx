import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BirthdaySlideshow from './birthday-slideshow';
import Admin from './Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BirthdaySlideshow />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
