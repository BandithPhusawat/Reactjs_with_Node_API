import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import Login from './Login';
import Products from './Products';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
     <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/Products' element={<Products/>} />
      </Routes>
  </BrowserRouter>
);
