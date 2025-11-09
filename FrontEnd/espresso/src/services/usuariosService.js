import getAuthHeaders from "pedidosService.js";

// HACER EL CAMBIO DE TODOS LOS HEADERS



const API_BASE = "http://localhost:3001/api";

/* --------------------------- LOGIN --------------------------- */
export const iniciarSesion = async (credenciales) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciales),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "No se pudo iniciar sesión");
  }

  const data = await response.json();
  localStorage.setItem("token", data.token);

  return {
    codigoUsuario: data.codigo,
    nombreUsuario: data.nombre,
    perfil: data.perfil,
  };
};

/* ---------------------- REGISTRAR USUARIO --------------------- */
export const registrarUsuario = async (usuarioData) => {
  const response = await fetch(`${API_BASE}/auth/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuarioData),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "Error al registrar usuario");
  }

  return await response.json(); // { mensaje, usuario }
};

/* -------------------- OBTENER PERFIL ACTUAL ------------------- */
export const obtenerMiPerfil = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/usuarios/mi-perfil`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "Error al obtener perfil");
  }

  const data = await response.json();
  return data.perfil;
};

/* -------------------- OBTENER TODOS LOS USUARIOS -------------- */
export const obtenerUsuarios = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/usuarios`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "Error al obtener usuarios");
  }

  const data = await response.json();
  return data.usuarios || [];
};

/* -------------------- OBTENER USUARIO POR ID ------------------ */
export const obtenerUsuarioPorId = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/usuarios/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "Error al obtener usuario");
  }

  const data = await response.json();
  return data.usuario || data;
};

/* -------------------- ACTUALIZAR USUARIO ---------------------- */
export const actualizarUsuario = async (id, usuarioData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(usuarioData),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "Error al actualizar usuario");
  }

  return await response.json();
};

/* -------------------- CAMBIAR PERFIL -------------------------- */
export const cambiarPerfilUsuario = async (codigoUsuario, nuevoPerfil) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/usuarios/perfil/${codigoUsuario}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ perfil: nuevoPerfil }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "Error al cambiar el perfil del usuario");
  }

  return await response.json();
};

/* -------------------- ELIMINAR USUARIO ------------------------ */
export const eliminarUsuario = async (codigoUsuario) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/usuarios/${codigoUsuario}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "Error al eliminar usuario");
  }

  return await response.json();
};

/* -------------------- OBTENER PERFILES ------------------------ */
export const obtenerPerfiles = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/usuarios/perfiles`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "Error al obtener perfiles");
  }

  const data = await response.json();
  return data.perfiles || [];
};

/* -------------------- CREAR USUARIO --------------------------- */
export const createUsuario = async (usuarioData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/usuarios`, { // 🔹 asegurate de incluir /usuarios
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(usuarioData),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.mensaje || "Error al crear el usuario");
  }

  return await response.json();
};

/* -------------------- ACTUALIZAR USUARIO ---------------------- */
export const updateUsuario = async (id, usuarioData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(usuarioData),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.mensaje || "Error al actualizar el usuario");
  }

  return await response.json();
};