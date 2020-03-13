import React from 'react';
import './App.css';
import RouteContentArea from './components/ContentArea';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>Teste de parte fixa</div>
      <RouteContentArea />
    </BrowserRouter>
  );
}

export default App;
