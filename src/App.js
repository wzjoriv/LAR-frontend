import "./App.css";
import MapViewer from "./Components/MapViewer";
import { SearchBar } from './Components/SearchBar';
import React, { useState, useRef } from "react";
import buttons from "./Components/buttons.js";

function App() {
  const [location, setLocation] = useState({
    longitude: -71.1642646,
    latitude: 42.7002117,
    radius: 9000, //meters
    zoom: 14,
  });
  const [LOIResponse, setLOIResponse] = useState(null); //loi = location of interest
  const locationChangedByInteraction = useRef(false);
  const [buttonInfo, setButtonInfo] = useState(buttons);

  return (
    <div className="App">
      <MapViewer
        location={location}
        locationChangedByInteraction={locationChangedByInteraction}
        setLocation={setLocation}
        LOIResponse={LOIResponse}
      />
      <div className="App-header">
        <SearchBar
          buttonInfo={buttonInfo}
          setButtonInfo={setButtonInfo}
          location={location}
          locationChangedByInteraction={locationChangedByInteraction}
          setLOIResponse={setLOIResponse}
        />
      </div>
    </div>
  );
}

export default App;
