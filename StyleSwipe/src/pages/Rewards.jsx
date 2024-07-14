import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import './Rewards.css';
import rewardsImage from './rew.png'; // Add your rewards image here

const Rewards = () => {
  const { userId } = useParams();
  const [rank, setRank] = useState(null);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const fetchUserRank = async () => {
      const db = getFirestore();
      const itemsRef = collection(db, 'items');
      const q = query(itemsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      let totalLikes = 0;
      querySnapshot.forEach((doc) => {
        totalLikes += doc.data().likeCount || 0;
      });

      // Fetch all users and sort by likeCount
      const allUsersRef = collection(db, 'users');
      const allUsersSnapshot = await getDocs(allUsersRef);
      const users = [];

      allUsersSnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      
      users.sort((a, b) => b.likeCount - a.likeCount);
      
       const userRank = users.findIndex((user) => user.uid === userId) + 1;
      // const userRank = 7;
      console.log(userRank);
      setRank(userRank);
      
      if (userRank <= 3) {
        setRewards([
          '₹200 off coupon code',
          'Buy one get one free on cosmetics'
        ]);
      } else if (userRank >= 4 && userRank <= 10) {
        setRewards([
          'Free delivery coupon code',
          '10% off on purchase above ₹999'
        ]);
      } else {
        setRewards([]);
      }
    };

    fetchUserRank();
  }, [userId]);

  return (
    <div className="rewards-container">
      <div className="rewards-content">
        <div className="rewards-list">
          <div className="rewards-header">
            <h1>Congratulations!</h1>
            <p>You have earned exclusive rewards based on your rank.</p>
            {rank && <h2>Your Rank: {rank}</h2>}
          </div>
          {rewards.length > 0 ? (
            rewards.map((reward, index) => (
              <div key={index} className="reward-card">
                <h2>Reward {index + 1}</h2>
                <p>{reward}</p>
              </div>
            ))
          ) : (
            <div className="reward-card">
              <h2>No Rewards</h2>
              <p>Keep uploading and get more likes to earn rewards!</p>
            </div>
          )}
        </div>
        <div className="rewards-image-container">
          <img src={rewardsImage} alt="Rewards" className="rewards-image" />
        </div>
      </div>
    </div>
  );
};

export default Rewards;
