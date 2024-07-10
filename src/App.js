import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './pages/Navbar.jsx';
import UploadPage from "./pages/upload.jsx";
import SignInPage from './pages/SignInPage.jsx';
import LandingPage from './pages/Landing.jsx';
import MediaCard from './pages/Swipe.jsx';

function App() {
  return (
    <Router>
      <div className="App">
      <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/swipe" element={<MediaCard />} />
          <Route path='/signup' element={<SignInPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
