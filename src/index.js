import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Home from './home.js';
import Navbar_main from './components/navbar.jsx';
import reportWebVitals from './reportWebVitals';
import DataTable from './components/DataTable.jsx';
import {QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <Navbar_main/>
    <Home/>
    <DataTable/>
  </QueryClientProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
