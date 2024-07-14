import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';
import { toast } from 'react-hot-toast';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log(user.displayName);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
      toast.success('Logged out successfully');
      navigate('/signup');
    } catch (error) {
      console.error('Error logging out: ', error);
      toast.error('Failed to log out');
    }
  };

  const handleDropdown = (isOpen) => {
    setDropdownOpen(isOpen);
  };

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="navbar-container">
        <motion.div 
          className="navbar-logo"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link to="/">
            <img src="/image.png" alt="Logo" className="logo-image" />
          </Link>
        </motion.div>
        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/upload" className="nav-link" onClick={() => setIsOpen(false)}>Upload</Link>
          </motion.div> 
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/top" className="nav-link" onClick={() => setIsOpen(false)}>Top Trends</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/leaderboard" className="nav-link" onClick={() => setIsOpen(false)}>Leaderboard</Link>
          </motion.div> 
          {user ? (
            <motion.div
              className={`nav-link nav-button ${dropdownOpen ? 'dropdown-open' : ''}`}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              {user.displayName}
              <div 
                className="dropdown-menu"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link to={`/rewards/${user.uid}`} className="dropdown-item" onClick={() => setIsOpen(false)}>Rewards</Link>
                <span className="dropdown-item" onClick={handleLogout}>Logout</span>
              </div>
            </motion.div>
          )  : (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/signup" className="nav-link nav-button" onClick={() => setIsOpen(false)}>Signup/Login</Link>
            </motion.div>
          )}
        </div>
        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
