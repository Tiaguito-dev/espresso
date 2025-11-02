export const iniciarSesion = async (usuarioData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioData),
    });

    if (!response.ok) {
        throw new Error('No se pudo iniciar sesión');
    }

    // Lo que voy a hacer es armar un paquetito para mandarle a ValidarSesion. Ya que response tiene que contener: codigo del usuario, nombre del usuario, perfil y el token que me genera. Pero yo no quiero darle el token ya que me es más fácil acceder desde el local storage guardándolo acá

    const data = await response.json();

    // Guardo el token en localStorage
    localStorage.setItem('token', data.token);

    // Retorno solo los datos que necesito
    return {
        codigoUsuario: data.codigo,
        nombreUsuario: data.nombre,
        perfil: data.perfil
    };
};
