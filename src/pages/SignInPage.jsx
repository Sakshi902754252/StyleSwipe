import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './SignInPage.css';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!isSignUp) {
      return; // Prevent submitting if not in sign-up mode
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details in Firestore (optional)
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name,
        email,
      });

      console.log("Document written with ID: ", user.uid);

      // Clear sign-up form fields for better UX
      setEmail('');
      setName('');
      setPassword('');

      // Set sign-up mode to false to prompt for sign-in
      setIsSignUp(false);

    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      return; // Prevent submitting if in sign-up mode
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Signed in user:', userCredential.user);
      navigate('/'); // Redirect to home page after successful sign in

    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="signin-page">
      <div className="content-wrapper">
        <div className="image-container">
          <img src="/shopping.jpg" alt="Shopping illustration" />
        </div>
        <motion.div
          className="signin-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>{isSignUp ? 'Create Account' : 'Welcome To StyleSwipe'}</h2>
          <form onSubmit={isSignUp ? handleSignUp : handleSubmit}>
            {isSignUp && (
              <motion.input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                whileFocus={{ scale: 1.05 }}
              />
            )}
            <motion.input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              whileFocus={{ scale: 1.05 }}
            />
            <motion.input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              whileFocus={{ scale: 1.05 }}
            />
            <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </motion.button>
          </form>
          <p>
            {isSignUp
              ? 'Signed up successfully! Please sign in to continue.'
              : "Don't have an account?"}
            <motion.span
              className="toggle-sign"
              onClick={() => setIsSignUp(!isSignUp)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isSignUp ? ' SignIn' : ' Sign Up'}
            </motion.span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignInPage;
