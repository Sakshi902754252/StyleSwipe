
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, where, query } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import "./Category.css";

const CategoryPost = ({ post }) => (
  <article className="posts">
    <div className="users-info">
      <img src={post.imageUrl} alt={post.name} className="users-avatar" />
      <span className="name">{post.name}</span>
      <div className="shop-items">
        <Link to={post.productLink}>
          <FontAwesomeIcon icon={faShoppingBag} className="shoppingBag" />
        </Link>
      </div>
    </div>
    <Link to={post.productLink}>
      <img src={post.imageUrl} alt="Post content" className="posts-image" />
    </Link>
    <div className="post-detail">
      <span className="categories">{post.category}</span>
      <div className="like-section">
        <span className="like-icon">❤️</span>
        <span className="like-count">{post.likeCount}</span>
      </div>
    </div>
  </article>
);

const Category = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "items"), where("category", "==", categoryName));
      const querySnapshot = await getDocs(q);
      const productsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort products by likeCount in descending order
      productsArray.sort((a, b) => b.likeCount - a.likeCount);

      setProducts(productsArray);
    };

    fetchProducts();
  }, [categoryName]);

  return (
    <div className="pages">
      <div className="apps">
        <div>
          <div className="rankings">
          <Link to="/top">
          <button className="back-button">&larr;</button>
        </Link>
        <Link to="/top" className="link1">
          <h1>Back To Top Categories</h1>
        </Link>
          </div>
        </div>
        <h4>Category - {categoryName}</h4>
        <div className="back">
          <main className="contents">
            <div className="posts-container">
              {products.length > 0 ? (
                products.map((post) => <CategoryPost key={post.id} post={post} />)
              ) : (
                <p>No posts available</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Category;
