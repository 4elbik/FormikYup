import React from 'react';
import Register from '../Register';
import './App.css';
import 'antd/dist/antd.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Create a new user account:</h1>
      </header>
      <div className="register-form">
        <Register />
      </div>
    </div>
  );
}

export default App;
