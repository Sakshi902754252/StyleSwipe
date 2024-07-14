import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './upload.css';
import {toast} from 'react-hot-toast'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import serverTimestamp
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const UploadPage = () => {
  const [productLink, setProductLink] = useState('');
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [uid, setUid] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data when component mounts
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        setUser(user);
        console.log(user.displayName);
      } else {
        // User is signed out.
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleClick=async(e)=>{
    e.preventDefault();
    try { 
      navigate('/swipe'); 
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Sign in to continue');
      return;
    }

    try {
      // Upload the file to Firebase Storage and get the download URL
      let imageUrl = '';
      if (file) {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }
      
      // Create a new document in the 'items' collection with server timestamp
      const docRef = await addDoc(collection(db, 'items'), {
        productLink,
        gender,
        category,
        likeCount,
        imageUrl,
        uid: user.uid,
        name: user.displayName,
        timestamp: serverTimestamp(), // Add server timestamp
      });
      console.log("Document written with ID: ", docRef.id);
      
      // Clear the form after successful submission
      setProductLink('');
      setGender('');
      setCategory('');
      setFile(null);

      // Redirect to /swipe
      navigate('/swipe');
      
    } catch (error) {
      console.error("Error adding document: ", error);
      // You might want to show an error message to the user here
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="upload-page">
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="upload-section"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h2>Upload Your Picture</h2>
        <div className="upload-area">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            hidden
            required
          />
          <label htmlFor="file-upload" className="upload-label">
            <motion.img 
              width="96" 
              height="96" 
              src="https://img.icons8.com/fluency/96/add-image.png" 
              alt="add-image"
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <span>{file ? file.name : 'Choose a file'}</span>
          </label>
        </div>
        <p>Upload your daily outfit check and get a chance to win exciting rewards as a top performer on the leaderboard!</p>
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit} 
        className="upload-form"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="Add Product link"
          value={productLink}
          onChange={(e) => setProductLink(e.target.value)}
          required
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Category</option>
          <option value="Tops">Tops</option>
          <option value="Dresses">Dresses</option>
          <option value="T-shirts">T-shirts</option>
          <option value="Jackets & Sweatshirts">Jackets & Sweatshirts</option>
          <option value="Jeans & Trousers">Jeans & Trousers</option>
          <option value="Shorts & Skirts">Shorts & Skirts</option>
          <option value="Co-ord Sets">Co-ord Sets</option>
          <option value="Jumpsuits">Jumpsuits</option>
          <option value="Kurtas & Suits">Kurtas & Suits</option>
          <option value="Saree">Saree</option>
          <option value="Athleisure">Athleisure</option>
        </select>
        <motion.button 
          type="submit" 
          className="continue-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue
        </motion.button>
        <div className="or-option">
          <hr className="or-line" />
          <span>Or</span>
          <hr className="or-line" />
        </div>
        <motion.button 
          className="game-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
        >
          Enter Style Swipe!!
        </motion.button>
      </motion.form>
    </motion.main>
  </div>
  );
};

export default UploadPage;
