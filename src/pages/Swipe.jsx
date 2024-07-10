// src/components/MediaCard.js
import * as React from 'react';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const MediaCard = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      const productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsArray);
    };

    fetchProducts();
  }, []);

  const handleLike = async () => {
    const currentProduct = products[currentProductIndex];
    if (currentProduct) {
      const productRef = doc(db, "items", currentProduct.id);
      await updateDoc(productRef, {
        likeCount: currentProduct.likeCount + 1
      });
      const updatedProducts = [...products];
      updatedProducts[currentProductIndex] = { ...currentProduct, likeCount: currentProduct.likeCount + 1 };
      setProducts(updatedProducts);

      // Move to the next product
      const nextIndex = (currentProductIndex + 1) % products.length;
      setCurrentProductIndex(nextIndex);
    }
  };

  const handleDislike = () => {
    const currentProduct = products[currentProductIndex];
      // Move to the next product
      const updatedProducts = [...products];
      updatedProducts[currentProductIndex] = { ...currentProduct, likeCount: currentProduct.likeCount + 1 };
      setProducts(updatedProducts);
      const nextIndex = (currentProductIndex + 1) % products.length;
      setCurrentProductIndex(nextIndex);
    }


  const currentProduct = products[currentProductIndex];

  return (
    <Box
      sx={{
        marginTop: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        overflowY: 'hidden',
        backgroundColor: '#fff0f5'
      }}
    >
      {currentProduct && (
        <Card sx={{ width: 400, height: 650 }}>
          <CardMedia
            sx={{ height: 500, margin: 1 }}
            image={currentProduct.imageUrl}
            title={currentProduct.name}
          />
          <CardContent sx={{ padding: 0 }}>
            <Typography gutterBottom variant="h6" component="div" sx={{ marginLeft: 2.5 }}>
              {currentProduct.category}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 2.5 }}>
              {currentProduct.username}
            </Typography>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, marginBottom: 4 }}>
            <Button
              size="medium"
              sx={{
                backgroundColor: 'red',
                color: 'white',
                flexGrow: 1,
                marginRight: 1,
                '&:hover': {
                  backgroundColor: 'lightcoral',
                },
                fontSize: '1.1rem',
              }}
              onClick={handleDislike}
            >
              ✗
            </Button>
            <Button
              size="medium"
              sx={{
                backgroundColor: 'green',
                color: 'white',
                flexGrow: 1,
                '&:hover': {
                  backgroundColor: 'lightgreen',
                },
                fontSize: '1.1rem',
              }}
              onClick={handleLike}
            >
              ✓
            </Button>
          </CardActions>
        </Card>
      )}
    </Box>
  );
};

export default MediaCard;
