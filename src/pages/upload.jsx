import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './upload.css';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const UploadPage = () => {
  const [productLink, setProductLink] = useState('');
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new document in the 'items' collection
      const docRef = await addDoc(collection(db, 'items'), {
        productLink,
        gender,
        category,
        likeCount

        // You might want to handle file upload separately and store the URL here
        // fileUrl: await uploadFile(file),
      });
      console.log("Document written with ID: ", docRef.id);
      
      // Clear the form after successful submission
      setProductLink('');
      setGender('');
      setCategory('');
      setFile(null);
      
      // You might want to show a success message to the user here
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
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Category</option>
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="dresses">Dresses</option>
          </select>
          <motion.button 
            type="submit" 
            className="continue-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </motion.button>
        </motion.form>
      </motion.main>
    </div>
  );
};

export default UploadPage;