import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'


function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    try {
      localStorage.setItem('theme', 'dark');
    } catch {
      // ignore storage errors in restricted browsers
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
