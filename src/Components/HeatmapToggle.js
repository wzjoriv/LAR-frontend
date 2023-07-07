import "./style.css";
import React from "react";

export default function HeatmapToggle(props) {
  const styles = {
    backgroundColor: props.on ? "Gray" : "white",
    color: props.on ? "white" : "Gray",
  };
  const text = props.on ? "🧩 Remove Heatmap" : "🧩 Display Heatmap";

  return (
    <button
      className="heatmapToggle"
      style={styles}
      onClick={() => props.setHeatmapOn((prevVal) => !prevVal)}
    >
      {text}
    </button>
  );
}
