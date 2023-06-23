import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import SearchBox from "./SearchBox";

export default function SearchBar(props) {
  const [searchText, setSearchText] = useState("");

  function handleChange(event) {
    setSearchText(event.target.value);
  }

  //`http://localhost:5000/adds/Lafayette,IN/0,1,2,3` 

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const res = await axios.get(
        `http://localhost:5000/adds/${searchText}/1,2`
      );
      props.setLOIResponse(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <SearchBox
        searchText={searchText}
        setSearchText={setSearchText}
        handleChange={handleChange}
      />
    </form>
  );
}
