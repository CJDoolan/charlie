import React from 'react';
import ReactDOM from 'react-dom/client';
import Nav from './Nav';
import Reader from './Reader'
import './css/body_styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Nav />
    <Reader />
  </React.StrictMode>
);
