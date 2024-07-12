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
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      let productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Shuffle products array randomly
      productsArray = shuffleArray(productsArray);

      setProducts(productsArray);
    };

    fetchProducts();
  }, []);

  // Function to shuffle array randomly
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]
      ];
    }

    return array;
  };

  const handleLike = async () => {
    const currentProduct = products[currentProductIndex];
    if (currentProduct) {
      const productRef = doc(db, "items", currentProduct.id);
      const newLikeCount = (currentProduct.likeCount || 0) + 1;
      await updateDoc(productRef, { likeCount: newLikeCount });
      
      const updatedProducts = products.map(p => 
        p.id === currentProduct.id ? {...p, likeCount: newLikeCount} : p
      );
      setProducts(updatedProducts);
      setIsLiked(true);
      setTimeout(() => setCurrentProductIndex((currentProductIndex + 1) % products.length), 500);
    }
  };

  const handleDislike = () => {
    setCurrentProductIndex((currentProductIndex + 1) % products.length);
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
    const currentProduct = products[currentProductIndex];
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

  const renderCard = (product, index, position) => {
    let style = {};
    if (position === 'center') {
      style = {
        zIndex: 3,
        opacity: 1,
        transform: `translateX(${dragPosition.x}px) rotate(${dragPosition.x * 0.1}deg)`,
        transition: dragStart ? 'none' : 'transform 0.3s ease',
      };
    } else if (position === 'left') {
      style = {
        zIndex: 1,
        opacity: 0.5,
        transform: 'translateX(-250px) scale(0.8)',
      };
    } else if (position === 'right') {
      style = {
        zIndex: 1,
        opacity: 0.5,
        transform: 'translateX(250px) scale(0.8)',
      };
    }
    
    return (
      <Card
        key={index}
        ref={cardRef}
        sx={{
          width: 400,
          height: 650,
          position: 'absolute',
          ...style,
          cursor: position === 'center' ? 'grab' : 'default',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          background: 'white',
        }}
        onMouseDown={position === 'center' ? handleDragStart : null}
        onMouseMove={position === 'center' ? handleDragMove : null}
        onMouseUp={position === 'center' ? handleDragEnd : null}
        onMouseLeave={position === 'center' ? handleDragEnd : null}
      >
        <Tooltip
          title={
            <Typography sx={{ fontSize: '1rem', color: 'white' }}>
              Tap on the picture for an easy purchase
            </Typography>
          }
          placement="right"
          arrow
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            position: 'absolute',
            top: '50%',
            right: '-1.5rem',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
        >
          <CardMedia
            sx={{ height: 500, margin: 1, cursor: 'pointer' }}
            image={product.imageUrl}
            title={product.category}
            onClick={position === 'center' ? handleImageClick : null}
          />
        </Tooltip>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginLeft: '0.6rem',
              marginTop: '-0.5rem',
            }}
          >
            <Typography gutterBottom variant="h6" component="div" sx={{ color: '#111827' }}>
              {product.category}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '-0.5rem', marginRight: '1rem' }}>
              {isLiked ? (
                <FavoriteIcon sx={{ color: 'red' }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: 'gray' }} />
              )}
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {product.likeCount || 0}
              </Typography>
            </Box>
          </Box>
          {position === 'center' && (
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
              <IconButton
                sx={{
                  backgroundColor: '#4bccff',
                  color: 'white',
                  '&:hover': { backgroundColor: '#3ba8d4' },
                  ...getIconStyle(false),
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
                  ...getIconStyle(true),
                }}
                onClick={handleLike}
              >
                <FavoriteIcon fontSize="large" />
              </IconButton>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const currentProduct = products[currentProductIndex];
  const leftProduct = products[(currentProductIndex - 1 + products.length) % products.length];
  const rightProduct = products[(currentProductIndex + 1) % products.length];

  return (
    <Box
      sx={{
        marginTop: '5.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {leftProduct && renderCard(leftProduct, currentProductIndex - 1, 'left')}
      {currentProduct && renderCard(currentProduct, currentProductIndex, 'center')}
      {rightProduct && renderCard(rightProduct, currentProductIndex + 1, 'right')}
    </Box>
  );
};

export default MediaCard;
