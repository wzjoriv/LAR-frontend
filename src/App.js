import './App.css';
import MapViewer from './Components/MapViewer';
import SearchBar from './Components/SearchBar';
import React, { useState, useRef } from 'react';

function App() {

  const [location, setLocation] = useState({
    longitude: -86.8831443,
    latitude: 40.41731893,
    radius: 4250, //meters
    zoom: 14
  });
  const [LOIResponse, setLOIResponse] = useState(null); //loi = location of interest
	const locationChangedByUser = useRef(false);
  const [heatmapOn, setHeatmapOn] = useState(true);

  return (
    <div className="App">
      <MapViewer location={location} locationChangedByUser={locationChangedByUser} heatmapOn={heatmapOn} setLocation={setLocation} LOIResponse={LOIResponse}/>
      <div className='App-header'>
        <SearchBar location={location} locationChangedByUser={locationChangedByUser} setHeatmapOn={setHeatmapOn} setLOIResponse={setLOIResponse} />
      </div>
    </div>
  );
}

export default App;
