import React, { useState } from "react";
import "./style.css";

function LogoFootnote() {
  const [showAuthors, setShowAuthors] = useState(false);

  return (
    <div
      className="logo-footnote"
      onMouseEnter={() => setShowAuthors(true)}
      onMouseLeave={() => setShowAuthors(false)}
    >
      <img src="logo192.png" alt="Logo" />
      <span>LAR</span>
      {showAuthors && (
        <div className="authors">
          <div>
            <p className="author-name">Josue N. Rivera</p>
            <p className="author-role">Lead Developer</p>
          </div>
          <div>
            <p className="author-name">Pruthvi S. Patel</p>
            <p className="author-role">Frontend Developer</p>
          </div>
          <div>
            <p className="author-name">Richard Donbosco</p>
            <p className="author-role">Consultant</p>
          </div>
          <div>
            <p className="author-name">Javid Mardanov</p>
            <p className="author-role">Consultant</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogoFootnote;