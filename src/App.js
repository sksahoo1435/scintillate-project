// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CharacterList from './components/CharactersList';
import CharacterDetails from './components/CharacterDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CharacterList />} />
        <Route path="/characters/:id" element={<CharacterDetails />} />
      </Routes>
    </Router>
  );
};

export default App;