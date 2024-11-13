import React from 'react';
import ReactDOM from 'react-dom/client';
import Nav from './Nav';
import Booklog from './Booklog';
import './css/body_styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Nav />
    <Booklog />
  </React.StrictMode>
);
