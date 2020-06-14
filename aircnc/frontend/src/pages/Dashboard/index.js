import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './style.css';

const Dashboard = () => {
  const [spots, setSports] = useState([]);

  useEffect(() => {
    const loadSpots = async () => {
      const user_id = localStorage.getItem('user');
      const response = await api.get('/dashboard', {
        headers: { user_id },
      });
      setSports(response.data);
    };

    loadSpots();
  }, []);

  return (
    <>
      <ul className='spot-list'>
        {spots.map((spot) => (
          <li key={spot._id}>
            <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
            <strong>{spot.company}</strong>
            <span>{spot.price ? `R$${spot.price}/dia` : 'GRATUITO'}</span>
          </li>
        ))}
      </ul>

      <Link to='/new'>
        <button className='btn'>Cadastrar novo spot</button>
      </Link>
    </>
  );
};

export default Dashboard;
