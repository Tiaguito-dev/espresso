import React from "react";
import "../UnicoCSS.css";

import imagenLogo from "../images/logoEspressoCremita.png"
import imagenMedia from "../images/logosMedia.png"


function Footer() {

  return (
    <footer className="footer">
      <div className="contenedor-footer">
        <img src={imagenLogo} alt="Logo Espresso"/>
        <img src={imagenMedia} alt="Logos de Facebook, Instagram y Twitter"/>
      </div>
    </footer>
  );
}

export default Footer;