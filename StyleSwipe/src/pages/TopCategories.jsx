import React, { useState, useEffect } from "react";
import "./TopCategories.css";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag,  faTimes,  faTags, faGift, faStar, } from "@fortawesome/free-solid-svg-icons"; 

function TopCategories() {
  const [products, setProducts] = useState([]);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "items"), orderBy("likeCount", "desc"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const productsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productsArray);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: '7709483635845058' }), // Replace with actual user ID
        });
        const data = await response.json();
        if (data.recommendations && data.recommendations.length > 0) {
          setRecommendation(data.recommendations[0]);
        }
      } catch (error) {
        console.error('Error fetching recommendation:', error);
      }
    };

    const intervalId = setInterval(fetchRecommendation, 10000); // Fetch every minute

    return () => clearInterval(intervalId);
  }, []);

  const handleCloseRecommendation = () => {
    setRecommendation(null);
  };

  return (
    <div className="page">
      <div className="app">
        <header>
          <div className="ranking">
            <span className="blinking-text">Checkout your ranking!!</span>
            <div className="link">
              <Link to="/leaderboard">Go to leaderboard</Link>
            </div>
          </div>
        </header>
        <div className="back">
          <h4>Top Categories</h4>
          <section className="top-categories">
            <div className="category-list">
              {products.map((category) => (
                <img
                  key={category.id}
                  src={category.imageUrl}
                  alt="Category"
                  className="category-avatar"
                />
              ))}
            </div>
          </section>
          <div className="likes">
            <h4>Most Liked & Coveted Looks!</h4>
          </div>
          <main className="content">
            <div className="posts-container">
              {products.length > 0 ? (
                products.map((post) => <Post key={post.id} post={post} />)
              ) : (
                <p>No posts available</p>
              )}
            </div>
          </main>
        </div>
      </div>
      {recommendation && (
        <div className="recommendation-overlay">
          <div className="recommendation-popup">
            <button className="close-button" onClick={() => handleCloseRecommendation()}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="popup-content">
              <h3>Hey Sakshi,</h3>
              <p>your Instagram style is amazing! We think you'll love this.
              <div className="popup-icon">
                <FontAwesomeIcon icon={faShoppingBag} />
              </div>
              </p>
              <h4>{recommendation.name}</h4>
              <div className="feature-icons">
                <FontAwesomeIcon icon={faTags} />
                <FontAwesomeIcon icon={faGift} />
                <FontAwesomeIcon icon={faStar} />
              </div>
              <a href={recommendation.image_urls[0]} target="_blank" rel="noopener noreferrer" className="view-item-button">
                Explore Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Post({ post }) {
  return (
    <article className="post">
      <div className="user-info">
        <img src={post.imageUrl} alt={post.name} className="user-avatar" />
        <span className="username">{post.name}</span>
        <div className="shop">
          <Link to={post.productLink}>
            <FontAwesomeIcon icon={faShoppingBag} className="shopping-bag"/>
          </Link>
        </div>
      </div>
      <Link to={post.productLink}>
        <img src={post.imageUrl} alt="Post content" className="post-image" />
      </Link>
      <div className="post-details">
        <span className="category">{post.category}</span>
        <div className="likes-section">
          <span className="likes-icon">❤️</span>
          <span className="likes-count">{post.likeCount}</span>
        </div>
      </div>
    </article>
  );
}

export default TopCategories;
