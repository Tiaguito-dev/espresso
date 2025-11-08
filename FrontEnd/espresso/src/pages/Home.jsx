import BotonHome from "./BotonHome";
import "./Home.css";

function Home() {
  return (
    <div>
      <h1 className="titulo-home">¡Bienvenido!</h1>

      <div>

        <h3>Sobre nosotros</h3>
        <p className="texto-home">
        Sistema de gestión de pedidos. Usa la barra de navegacion o selecciona una opción aquí abajo.
      </p>
      <div>
        <BotonHome
          ruta="/menu/menuEspresso/"
          texto="Gestion de Menu"
        ></BotonHome>
      </div>
      </div>
  
      

      <div className="home-container">
        {/*<BotonHome
          ruta="/pedidos"
          texto="Gestion de Pedidos"
        ></BotonHome>
        <BotonHome
          ruta="/pedidos/agregar"
          texto="Agregar pedido"
        ></BotonHome> */}
        
      </div>
      {/* <div className="home-container">
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
      </div> */}
    </div>
  );
}

export default Home;
