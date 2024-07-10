import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './pages/Navbar.jsx';
import UploadPage from "./pages/upload.jsx";
import SignInPage from './pages/SignInPage.jsx';

function App() {
  return (
    <Router>
      <div className="App">
      <Navbar />
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/" element={<UploadPage />} />
          {/* Add other routes as needed */}
          <Route path='/signup' element={<SignInPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
