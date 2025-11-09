// src/pages/usuarios/FilaUsuarios.jsx
import React from "react";

export default function FilaUsuarios({ usuario, funcionCambiarPerfil, funcionEliminar }) {
  // perfil puede venir como objeto { nombre } o como string
  const nombrePerfil = usuario?.perfil?.nombre ?? usuario?.perfil ?? "";

  return (
    <tr>
      <td>{usuario.codigo}</td>
      <td>{usuario.nombre}</td>
      <td>{usuario.correo}</td>
      <td>
        <span style={{ cursor: "pointer" }}>{nombrePerfil}</span>
      </td>
      <td>
        <button onClick={() => funcionCambiarPerfil(usuario.codigo)}>Cambiar Perfil</button>
        <button onClick={() => funcionEliminar(usuario.codigo)}>Eliminar</button>
      </td>
    </tr>
  );
}
