import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import SearchBox from "./SearchBox";
import ToggleButton from "./ToggleButton";

function makeSearchTargets(buttonInfo) {
  let searchTargets = "";
  for (let i = 0; i < buttonInfo.length; i++) {
    if (buttonInfo[i].selected) {
      searchTargets = searchTargets + buttonInfo[i].id + ",";
    }
  }
  return searchTargets.slice(0, -1);
}

function SearchBar(props) {
  const [searchLocation, setSearchLocation] = useState("");
  function handleChange(event) {
    setSearchLocation(event.target.value);
  }

  //`http://localhost:5000/adds/Lafayette,IN/1`
  let searchTargets = makeSearchTargets(props.buttonInfo);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!props.heatmapOn) props.setHeatmapOn(true);

    let searchType = /[\d.]+\W+[\d.]+\W+[\d.]+/.test(searchLocation)
      ? "locs"
      : "adds";
    try {
      const res = await axios.get(
        `http://localhost:5000/${searchType}/${searchLocation}/${searchTargets}`
      );
      props.setLOIResponse(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  function changeToggle(key) {
    let isOnlyOneSelected = true;
    for (let i = 0; i < props.buttonInfo.length; i++) {
      if (props.buttonInfo[i].selected && i !== key) {
        isOnlyOneSelected = false;
      }
    }
    if (isOnlyOneSelected) {
      alert("You must have at least one LOI selected.");
    } else {
      props.setButtonInfo((prevInfo) => {
        return prevInfo.map((info) => {
          return info.id === key ? { ...info, selected: !info.selected } : info;
        });
      });
    }
  }

  const ToggleOptions = props.buttonInfo.map((button) => (
    <ToggleButton
      key={button.id}
      id={button.id}
      name={button.name}
      selected={button.selected}
      changeToggle={changeToggle}
    />
  ));

  React.useEffect(() => {
    if (props.locationChangedByInteraction.current) {
      let numDecimals = -1 * (11 - props.location.zoom);
      setSearchLocation(
        `${props.location.latitude.toFixed(
          numDecimals
        )},${props.location.longitude.toFixed(
          numDecimals
        )},${props.location.radius.toFixed(0)}`
      );
    }
    props.locationChangedByInteraction.current = false;
  }, [props.location, props.locationChangedByInteraction, setSearchLocation]);

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

export { SearchBar, makeSearchTargets };
