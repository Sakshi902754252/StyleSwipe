import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

const MediaCard = () => {    

  return (
    <Box
      sx={{
        marginTop: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: '#fff0f5'
      }}
    >
      <Card sx={{ width: 400, height: 650 }}>
        <CardMedia
          sx={{ height: 500, margin: 1 }}
          image="/image_swipe.jpg"
          title="green iguana"
        />
        <CardContent sx={{ padding: 0 }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ marginLeft: 2.5 }}>
            Category
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 2.5 }}>
            Username
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
          >
            ✓
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default MediaCard;