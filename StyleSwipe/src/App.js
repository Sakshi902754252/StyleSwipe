import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './pages/Navbar.jsx';
import UploadPage from "./pages/upload.jsx";
import SignInPage from './pages/SignInPage.jsx';
import LandingPage from './pages/Landing.jsx';
import MediaCard from './pages/Swipe.jsx';
import Topcategories from './pages/TopCategories.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/leaderboard';

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/swipe" element={<MediaCard />} />
        <Route path='/signup' element={<SignInPage/>}/>
        <Route path='/top' element={<Topcategories/>}/>
        <Route path='/leaderboard' element={<Leaderboard/>}/>
      </Routes>
    </div>
  );
}

export default App;