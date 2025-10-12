import React from 'react';
import "../menu/ClienteMenu.css"

export default function Categoria({ nombre, onClick, categoriaActiva }) {
  // Asegúrate de usar tu clase CSS original 'btn-categoria'
  const claseBoton = `btn-categoria ${categoriaActiva ? 'activa' : ''}`;

  return (
    <button
      className={claseBoton}
      onClick={() => onClick(nombre)}
    >
      {nombre}
    </button>
  );
}