import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, IconButton, Tooltip } from '@mui/material';
import { db } from '../firebase';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const MediaCard = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      const productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsArray);
      selectRandomProduct(productsArray);
    };

    fetchProducts();
  }, []);

  const selectRandomProduct = (productsArray) => {
    if (productsArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * productsArray.length);
      setCurrentProduct(productsArray[randomIndex]);
      setIsLiked(false);
    }
  };

  const handleLike = async () => {
    if (currentProduct) {
      const productRef = doc(db, "items", currentProduct.id);
      const newLikeCount = (currentProduct.likeCount || 0) + 1;
      await updateDoc(productRef, { likeCount: newLikeCount });
      
      const updatedProducts = products.map(p => 
        p.id === currentProduct.id ? {...p, likeCount: newLikeCount} : p
      );
      setProducts(updatedProducts);
      setIsLiked(true);
      setTimeout(() => selectRandomProduct(updatedProducts), 500);
    }
  };

  const handleDislike = () => {
    selectRandomProduct(products);
  };

  const handleDragStart = (e) => {
    setIsClicking(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleDragMove = (e) => {
    if (dragStart) {
      const deltaX = e.clientX - dragStart.x;
      if (Math.abs(deltaX) > 5) {
        setIsClicking(false);
      }
      setDragPosition({ x: deltaX, y: 0 });
    }
  };

  const handleDragEnd = () => {
    if (Math.abs(dragPosition.x) > 100) {
      if (dragPosition.x > 0) {
        handleLike();
      } else {
        handleDislike();
      }
    }
    setDragStart(null);
    setDragPosition({ x: 0, y: 0 });
  };

  const handleImageClick = () => {
    if (isClicking && currentProduct && currentProduct.productLink) {
      window.open(currentProduct.productLink, '_blank');
    }
  };

  const getIconStyle = (isLike) => {
    const threshold = 100;
    const scale = Math.min(Math.abs(dragPosition.x) / threshold, 1);
    return {
      transform: `scale(${1 + (isLike ? dragPosition.x : -dragPosition.x) * 0.005})`,
      transition: 'transform 0.3s ease',
    };
  };

  return (
    <Box
      sx={{
        marginTop: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        position: 'relative',
      }}
    >
      {currentProduct && (
        <Card 
          ref={cardRef}
          sx={{ 
            width: 400, 
            height: 650,
            transform: `translateX(${dragPosition.x}px) rotate(${dragPosition.x * 0.1}deg)`,
            transition: dragStart ? 'none' : 'transform 0.3s ease',
            cursor: 'grab',
            position: 'relative',
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <Tooltip title="Tap on the picture for an easy purchase">
            <CardMedia
              sx={{ height: 500, margin: 1, cursor: 'pointer' }}
              image={currentProduct.imageUrl}
              title={currentProduct.category}
              onClick={handleImageClick}
            />
          </Tooltip>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography gutterBottom variant="h6" component="div">
                {currentProduct.category}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isLiked ? 
                  <FavoriteIcon sx={{ color: 'red' }} /> :
                  <FavoriteBorderIcon sx={{ color: 'gray' }} />
                }
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {currentProduct.likeCount || 0}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
            <IconButton 
              sx={{  
                backgroundColor: '#4bccff',
                color: 'white',
                '&:hover': { backgroundColor: '#3ba8d4' },
                ...getIconStyle(false)
              }}
              onClick={handleDislike}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
            <IconButton 
              sx={{ 
                backgroundColor: '#ff4b4b',
                color: 'white',
                '&:hover': { backgroundColor: '#d63e3e' },
                ...getIconStyle(true)
              }}
              onClick={handleLike}
            >
              <FavoriteIcon fontSize="large" />
            </IconButton>
          </Box>
          </CardContent>
          
        </Card>         
      )}
    </Box>
  );
};

export default MediaCard;
