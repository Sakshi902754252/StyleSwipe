import React, { useState, useEffect } from "react";
import "./TopCategories.css";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons"; 
import { motion } from "framer-motion";

const categories = [
  { name: "Tops", imageUrl: "../images/top.png" },
  { name: "Dresses", imageUrl: "/images/dresses.png" },
  { name: "T-shirts", imageUrl: "/images/t-shirts.png" },
  { name: "Jackets & Sweatshirts", imageUrl: "/images/hoodie.png" },
  { name: "Jeans & Trousers", imageUrl: "/images/jeans.png" },
  { name: "Shorts & Skirts", imageUrl: "/images/skirts.png" },
  { name: "Co-ords", imageUrl: "../images/cordSet.png" },
  { name: "Jumpsuits", imageUrl: "/images/jumpsuit.png" },
  { name: "Kurtas & Suits", imageUrl: "/images/kurta.png" },
  { name: "Sarees", imageUrl: "/images/saree.png" },
  { name: "Ethnic Bottom", imageUrl: "/images/ethnicBottom.png" },
  { name: "Athleisure", imageUrl: "/images/Athleisure.png" },
];

function TopCategories() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
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
          <h4>Find out the top trends in every category!!</h4>
          <section className="top-categories">
            <div className="category-list">
              {categories.map((category) => (
                <motion.div
                  key={category.name}
                  className="category-item"
                  onClick={() => handleCategoryClick(category.name)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="category-avatar"
                  />
                  <span className="category-name">{category.name}</span>
                </motion.div>
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
