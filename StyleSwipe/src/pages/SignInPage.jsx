import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import './SignInPage.css';
import {  doc, setDoc, collection, addDoc, getDoc, updateDoc, arrayUnion} from 'firebase/firestore';
import { db, auth } from '../firebase';
import axios from 'axios';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

      // Show success alert
      toast.success('Account created successfully.');

      // Set sign-up mode to false to prompt for sign-in
      setIsSignUp(false);

    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Error creating account.');
    }
  };

  const handleInstagramLogin = async () => {
    setIsLoading(true);
    const accessToken = process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN;


    try {
      // Fetch user data from Instagram
      const userDataResponse = await axios.get(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
      const userData = userDataResponse.data;

      console.log("Instagram user data:", userData);

      const userRef = doc(db, 'users', userData.id);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // Create the document if it does not exist
        await setDoc(userRef, {
          instagramId: userData.id,
          username: userData.username,
          accessToken: accessToken,
          media: [], // Initialize media array
        });
        console.log("Document created with ID: ", userData.id);
      } else {
        // Update the document if it exists
        await updateDoc(userRef, {
          instagramId: userData.id,
          username: userData.username,
          accessToken: accessToken
        });
        console.log("Document updated with ID: ", userData.id);
      }

      // Fetch recent media from Instagram
      const mediaResponse = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url&access_token=${accessToken}`);
      const recentMedia = mediaResponse.data.data;

      console.log("Recent media:", recentMedia);

      // Save media data to Firestore
      const mediaUrls = recentMedia.map(media => media.media_url);
      await updateDoc(userRef, {
        media: arrayUnion(...mediaUrls)
      });

      console.log("Media data saved to Firestore");

      // Navigate to the upload page
      navigate('/upload', { 
        state: { 
          instagramId: userData.id,
          username: userData.username,
          recentMedia 
        } 
      });

    } catch (error) {
      console.error("Error fetching Instagram data:", error);
      alert("An error occurred while fetching your Instagram data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      return; // Prevent submitting if in sign-up mode
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in user:', userCredential.user);

      toast.success('Logged in successfully.');

      navigate('/upload');

    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Incorrect Credentials! Please try again.');
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
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
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
              {isSignUp ? 'Sign Up' : 'Log In'}
            </motion.button>
          </form>
          <motion.button
            className="instagram-login-btn"
            onClick={handleInstagramLogin}
            style={{ marginLeft: '75px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login with Instagram'}
          </motion.button>
          <p>
            {isSignUp
              ? 'Please log in to continue.'
              : "Don't have an account?"}
            <motion.span
              className="toggle-sign"
              onClick={() => setIsSignUp(!isSignUp)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isSignUp ? ' Log In' : ' Sign Up'}
            </motion.span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignInPage;
