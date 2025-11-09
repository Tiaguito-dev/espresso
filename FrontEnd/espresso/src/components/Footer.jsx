import React from "react";
import "../UnicoCSS.css";

import imagenLogo from "../images/logoEspressoCremita.png"


function Footer() {

  return (
    <footer className="footer">
      <div className="contenedor-footer">
        <img src={imagenLogo} alt="Logo Espresso"/>
      </div>
    </footer>
  );
}

export default Footer;