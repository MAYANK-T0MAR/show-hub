import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ContextProvider from './context/context.js'
import DbContextProvider from './context/DbContext.js';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <DbContextProvider>
    <ContextProvider>
      <App />
    </ContextProvider>
  </DbContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
