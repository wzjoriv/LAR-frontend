import './App.css';
import MapViewer from './Components/MapViewer';
import SearchBar from './Components/SearchBar';
import React, { useState } from 'react';

function App() {

  const [location, setLocation] = useState({
    longitude: -70.0,
    latitude: 40.0,
    zoom: 14
  });
  const [LOIResponse, setLOIResponse] = useState(null); //loi = location of interest

  return (
    <div className="App">
      <MapViewer location={location} setLocation={setLocation} LOIResponse={LOIResponse} />
      <div className='App-header'>
        <SearchBar location={location} setLOIResponse={setLOIResponse} />
        <p>Test: {LOIResponse && <div>{JSON.stringify(LOIResponse)}</div>}</p>
      </div>
    </div>
  );
}

export default App;
