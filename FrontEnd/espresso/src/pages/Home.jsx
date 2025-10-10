import BotonHome from "./BotonHome";
import "./Home.css";

function Home() {
  return (
    <div>
      <h1 className="titulo-home">Bienvenido a Espresso</h1>
      <p className="texto-home">
        Sistema de gestión de pedidos. Usa la barra de navegacion o selecciona una opción aquí abajo.
      </p>

      <div className="home-container">
        <BotonHome
          ruta="/pedidos"
          texto="Gestion de Pedidos"
        ></BotonHome>
        <BotonHome
          ruta="/pedidos/agregar"
          texto="Agregar pedido"
        ></BotonHome>
        <BotonHome
          ruta="/menu"
          texto="Gestion de Menu"
        ></BotonHome>
        <BotonHome
          ruta="/caja"
          texto="Gestion de Caja"
        ></BotonHome>
        <BotonHome
          ruta="/cocina"
          texto="Gestion de Cocina"
        ></BotonHome>
      </div>
    </div>
  );
}

export default Home;
