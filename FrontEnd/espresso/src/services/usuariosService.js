// src/services/usuariosService.js

const API_BASE = "http://localhost:3001/api";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/* -------------------- LOGIN ------------------------------- */
export const iniciarSesion = async (credenciales) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: getAuthHeaders(),
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

/* -------------------- REGISTRAR USUARIO -------------------- */
export const registrarUsuario = async (usuarioData) => {
  const response = await fetch(`${API_BASE}/auth/registrar`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(usuarioData),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "Error al registrar usuario");
  }

  return await response.json();
};

/* -------------------- PERFIL ACTUAL ------------------------ */
export const obtenerMiPerfil = async () => {
  const response = await fetch(`${API_BASE}/usuarios/mi-perfil`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "Error al obtener perfil");
  }

  const data = await response.json();
  return data.perfil;
};

/* -------------------- OBTENER TODOS ------------------------ */
export const obtenerUsuarios = async () => {
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

/* -------------------- OBTENER POR ID ----------------------- */
export const obtenerUsuarioPorId = async (id) => {
  const response = await fetch(`${API_BASE}/usuarios/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "Error al obtener usuario");
  }

  const data = await response.json();
  return data.usuario || data;
};

/* -------------------- CREAR USUARIO ------------------------ */
export const createUsuario = async (usuarioData) => {
  const response = await fetch(`${API_BASE}/usuarios`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(usuarioData),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.mensaje || "Error al crear el usuario");
  }

  return await response.json();
};

/* -------------------- ACTUALIZAR USUARIO ------------------- */
export const updateUsuario = async (id, usuarioData) => {
  const response = await fetch(`${API_BASE}/usuarios/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(usuarioData),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.mensaje || "Error al actualizar el usuario");
  }

  return await response.json();
};

/* -------------------- CAMBIAR PERFIL ----------------------- */
export const cambiarPerfilUsuario = async (codigoUsuario, nuevoPerfil) => {
  const response = await fetch(`${API_BASE}/usuarios/perfil/${codigoUsuario}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ perfil: nuevoPerfil }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "Error al cambiar el perfil del usuario");
  }

  return await response.json();
};

/* -------------------- ELIMINAR USUARIO --------------------- */
export const eliminarUsuario = async (codigoUsuario) => {
  const response = await fetch(`${API_BASE}/usuarios/${codigoUsuario}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "Error al eliminar usuario");
  }

  return await response.json();
};

/* -------------------- OBTENER PERFILES --------------------- */
export const obtenerPerfiles = async () => {
  const response = await fetch(`${API_BASE}/perfiles`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.mensaje || "Error al obtener perfiles");
  }

  const data = await response.json();


  return data; // o lo que uses
};