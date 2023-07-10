import "./style.css";
import React from "react";

export default function SearchBox(props) {
  function handleChange(event) {
    props.setSearchLocation(event.target.value);
  }

  function handleKeyPress(event) {
    if (event.keyCode === 9) {
      props.setSearchLocation(props.placeholder);
    }
  }

  return (
    <div className="searchbox">
      <input
        type="text"
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        value={props.searchLocation}
        name="locationInput"
        placeholder={props.placeholder}
        title="Enter the location of interest"
      />
      <button>🔍</button>
    </div>
  );
}
