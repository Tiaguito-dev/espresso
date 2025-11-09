import React from 'react';
import "../../UnicoCSS.css"

export default function Categoria({ nombre, onClick, categoriaActiva }) {
  const claseBoton = `boton-categoria ${categoriaActiva ? 'activa' : ''}`;

  return (
    <button
      className={claseBoton}
      onClick={() => onClick(nombre)}
    >
      {nombre}
    </button>
  );
}