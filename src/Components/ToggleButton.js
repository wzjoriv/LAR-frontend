import "./style.css";
import React from "react";
/*
0: Aviation Facilities
1: Fire Stations
2: Hospitals
3: Local Law Enforcement
4: Public Schools
*/ 
export default function ToggleButton(props){
    const styles = {
        backgroundColor: props.selected ? "#97DAFF" : "transparent",
    }
    return(
        <div
            style={styles}
            className="toggleButton"
            id={props.id}
            key={props.id}
            onClick={()=>props.changeToggle(props.id)}
        >{props.name} 
        </div>
    )
}
