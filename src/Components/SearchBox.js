import "./style.css";
import React from "react";

export default function SearchBox(props) {
  return (
    <div className="searchbox">
      <input
        type="text"
        onChange={props.handleChange}
        value={props.searchText}
        name="cityInput"
        placeholder="Lafayette, IN"
        title="Enter the location of interest"
      />
      <button>Submit</button>
    </div>
  );
}
