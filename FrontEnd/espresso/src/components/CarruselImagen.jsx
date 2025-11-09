import React, { useEffect, useState } from "react";
import "../UnicoCSS.css"

const Carrusel = ({ imagenes }) => {
  const [indice, setIndice] = useState(0);

  const siguiente = () => {
    setIndice((anterior) => (anterior + 1) % imagenes.length);
  };

  const anterior = () => {
    setIndice((anterior) => (anterior - 1 + imagenes.length) % imagenes.length);
  };

  useEffect(() => {
    const temporizador = setTimeout(() => {
        siguiente();
    }, 3000);

    return () => clearTimeout(temporizador);
  }, [indice]);

  return (
    <div className="carrusel">
      <img
      key={indice}
        src={imagenes[indice]}
        alt={`imagen-${indice}`}
        className="carrusel-imagen"
      />

        <button onClick={anterior} className="carrusel-boton izquierda"> ◀ </button>

        <button onClick={siguiente} className="carrusel-boton derecha"> ▶ </button>
     

      <div className="carrusel-indicadores">
        {imagenes.map((_, i) => (
          <span
            key={i}
            className={`indicador ${
              i === indice ? "activo" : ""
            }`}
            onClick={() => setIndice(i)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carrusel;
