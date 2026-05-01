// src/App.jsx
import React from 'react';
// Hiqe importin e BrowserRouter prej këtu
import routes, { RenderRoutes } from './routes';

export default function App() {
  return (
    <>
      {/* Vetëm RenderRoutes, pa BrowserRouter këtu */}
      {RenderRoutes(routes)}
    </>
  );
}