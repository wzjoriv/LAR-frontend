// Textbox.js
import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

function Textbox() {
  const [response, setResponse] = useState(null);

  const handleClick = async () => {
    try {
      const res = await axios.get('<URL>');
      setResponse(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="textbox">
      <input type="text" />
      <button onClick={handleClick}>Submit</button>
      {response && <div>{JSON.stringify(response)}</div>}
    </div>
  );
}

export default Textbox;
