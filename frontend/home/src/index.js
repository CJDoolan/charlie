import React from 'react';
import ReactDOM from 'react-dom/client';
import Nav from './Nav';
import Home from './Home';
import './css/body_styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Nav />
    <Home />
  </React.StrictMode>
);
