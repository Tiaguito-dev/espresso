import BotonHome from "./BotonHome";
import "./Home.css";

function Home() {
  return (
    <div>
      <div className="bienvenida">
        <h1 className="titulo-home">Bienvenido a</h1>
        <div className="titulo">espresso</div>
      </div>
      
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
      </div>
      <div className="home-container">
        <BotonHome
          ruta="/caja"
          texto="Gestion de Caja"
        ></BotonHome>
        <BotonHome
          ruta="/cocina"
          texto="Gestion de Cocina"
        ></BotonHome>
        <BotonHome
          ruta="/mesas"
          texto="Gestion mesas"
        ></BotonHome>
        <BotonHome
          ruta="/usuarios"
          texto="Gestion de Perfiles"
        ></BotonHome>
      </div>
    </div>
  );
}

export default Home;
