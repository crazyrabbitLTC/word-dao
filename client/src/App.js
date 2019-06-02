import React from 'react';
import logo from './logo.svg';
import './App.css';

import TopContainer from './components/TopContainer';
import BottomContainer from './components/BottomContainer';
import RegisterWord from './components/RegisterWord';

function App() {
  return (
    <div className="App">
      <TopContainer/>
      <header className="App-header">
<RegisterWord/>

      </header>
      <BottomContainer/>
    </div>
  );
}

export default App;


