import {React,useState,useEffect} from "react";
import { Link } from "react-router-dom";
import "./Leaderboard.css";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";


const Leaderboard = () => {
  const topUsers = [
    { id: 2, name: "John", score: 4235 },
    { id: 1, name: "David", score: 4578 },
    { id: 3, name: "Merry", score: 3967 },
  ];

  const otherUsers = [
    { id: 4, name: "Devon Lane", score: 3768, trend: "up" },
    { id: 5, name: "Ronald", score: 3578, trend: "down" },
    { id: 6, name: "Eleanor Pena", score: 3476, trend: "up" },
    { id: 7, name: "Savannah", score: 3125, trend: "down" },
    { id: 8, name: "Wade Warren", score: 2857, trend: "up" },
  ];



  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      const productsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsArray);
    };

    fetchProducts();
  }, []);


  return (
    <div className="leaderboard">
      <nav className="navbar1">
        <Link to="/top">
        <button className="back-button">&larr;</button>
        </Link>
        <Link to="/top" className="link">
        <h1>Back To Top Categories</h1>
        </Link>
       
      </nav>

      <div className="top-users">
        {topUsers.map((user) => (
          <div key={user.id} className={`top-user user-${user.id}`}>
            <div className="avatar">
              <img src={`avatar-${user.id}.jpg`} alt={user.name} />
              <span className="rank">{user.id}</span>
            </div>
            <p className="name">{user.name}</p>
            <p className="score">{user.score}</p>
          </div>
        ))}
      </div>

      <div className="other-users">
        <div className="users">
          {otherUsers.map((user) => (
            <div key={user.id} className="user-row">
              <span className="rank">{user.id}</span>
              <img
                src={`avatar-${user.id}.jpg`}
                alt={user.imageUrl}
                className="avatar"
              />
              <span className="name">{user.name}</span>
              <span className="score">{user.score}</span>
              <span className={`trend ${user.trend}`}></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
