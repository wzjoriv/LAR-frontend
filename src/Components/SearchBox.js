import "./style.css";
import React from "react";

export default function SearchBox(props) {
  function handleChange(event) {
    props.setSearchLocation(event.target.value);
  }
  return (
    <div className="searchbox">
      <input
        type="text"
        onChange={handleChange}
        value={props.searchLocation}
        name="cityInput"
        placeholder={props.placeholder}
        title="Enter the location of interest"
      />
      <button>🔍</button>
    </div>
  );
}
