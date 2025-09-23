import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold italic mb-6">Bienvenido a Espresso</h1>
      <p className="text-lg mb-8">
        Sistema de gestión de pedidos. Usa el menú para navegar o selecciona una opción aquí abajo.
      </p>

      <div className="flex justify-center gap-6">
        <Link
          to="/pedidos"
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
        >
          Lista de Pedidos
        </Link>

        <Link
          to="/pedidos/agregar"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
        >
          Agregar Pedido
        </Link>

        <Link
          to="/menu"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
        >
          Gestión de Menú
        </Link>
      </div>
    </div>
  );
}

export default Home;
