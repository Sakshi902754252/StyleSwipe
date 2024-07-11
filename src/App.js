import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './pages/Navbar.jsx';
import UploadPage from "./pages/upload.jsx";
import SignInPage from './pages/SignInPage.jsx';
import LandingPage from './pages/Landing.jsx';
import MediaCard from './pages/Swipe.jsx';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/swipe" element={<MediaCard />} />
        <Route path='/signup' element={<SignInPage/>}/>
      </Routes>
    </div>
  );
}

export default App;