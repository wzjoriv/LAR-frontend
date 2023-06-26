import './App.css';
import MapViewer from './Components/MapViewer';
import SearchBar from './Components/SearchBar';
import React, { useState } from 'react';

function App() {

  const [location, setLocation] = useState({
    longitude: -71.1642646,
    latitude: 42.7002117,
    radius: 9000,
    zoom: 14
  });
  const [LOIResponse, setLOIResponse] = useState(null); //loi = location of interest

  return (
    <div className="App">
      <MapViewer location={location} setLocation={setLocation} LOIResponse={LOIResponse} />
      <div className='App-header'>
        <SearchBar location={location} setLOIResponse={setLOIResponse} />
      </div>
    </div>
  );
}

export default App;
