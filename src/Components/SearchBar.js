import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import SearchBox from "./SearchBox";
import buttons from "./buttons";
import ToggleButton from "./ToggleButton";

export default function SearchBar(props) {
  const [searchLocation, setSearchLocation] = useState("");
  const [buttonInfo, setButtonInfo] = useState(buttons);

  function handleChange(event) {
    setSearchLocation(event.target.value);
  }

  //`http://localhost:5000/adds/Lafayette,IN/1`
  let searchTargets = "";
  for (let i = 0; i < buttonInfo.length; i++) {
    if (buttonInfo[i].selected) {
      searchTargets = searchTargets + buttonInfo[i].id + ",";
    }
  }
  searchTargets = searchTargets.slice(0, -1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let searchType = /[\d.]+\W+[\d.]+\W+[\d.]+/.test(searchLocation) ? "locs" : "adds";
    try {
      const res = await axios.get(
        `http://localhost:5000/${searchType}/${searchLocation}/${searchTargets}`
      );
      props.setLOIResponse(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const ToggleOptions = buttonInfo.map((button) => (
    <ToggleButton
      id={button.id}
      name={button.name}
      selected={button.selected}
      changeToggle={changeToggle}
    />
  ));

  function changeToggle(key) {
    setButtonInfo((prevInfo) => {
      return prevInfo.map((info) => {
        return info.id === key ? { ...info, selected: !info.selected } : info;
      });
    });
  }

  React.useEffect(
    function () {
      if (props.locationChangedByUser.current) {
        setSearchLocation(`${props.location.latitude}, ${props.location.longitude}, ${props.location.radius}`)
      };
    },
    [props.location, props.locationChangedByUser, setSearchLocation]
  );

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <SearchBox
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        handleChange={handleChange}
        changeToggle={changeToggle}
      />
      {ToggleOptions}
    </form>
  );
}
