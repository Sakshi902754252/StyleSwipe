import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Leaderboard.css";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(
        collection(db, "items"),
        orderBy("likeCount", "desc"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const usersArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        imageUrl:doc.data().imageUrl,
        likeCount: doc.data().likeCount,
        timestamp: doc.data().timestamp.toDate(),
        category: doc.data().category,
      }));
      setUsers(usersArray);
    };

    fetchUsers();
  }, []);

  const topUsers = users.slice(0, 3);
  const otherUsers = users.slice(3);

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
        {topUsers.map((user, index) => (
          <div key={user.id} className={`top-user user-${index + 1}`}>
            <div className="avatar">
              <img src={user.imageUrl} alt={user.name} />
              <span className="rank">{index + 1}</span>
            </div>
            <div className="user-info">
              <p className="name-category">{user.name} | {user.category}</p>
              <p className="top-score">❤️ {user.likeCount}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="other-users">
        <div className="users">
          {otherUsers.map((user, index) => (
            <div key={user.id} className="user-row">
              <span className="rank">{index + 4}</span>
              <img
                src={user.imageUrl}
                alt={user.name}
                className="avatar"
              />
              <div className="user-info">
                <p className="name-category">{user.name} | {user.category}</p>
                <p className="score">❤️ {user.likeCount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;