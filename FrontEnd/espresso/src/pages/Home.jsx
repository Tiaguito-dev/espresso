import BotonHome from "./BotonHome";
{/*import "./Home.css";*/}
import "../UnicoCSS.css"
import Carrusel from "../components/CarruselImagen";
import Footer from "../components/Footer";

import cafeteria1 from "../images/cafeteria1.jpeg"
import cafeteria2 from "../images/cafeteria2.jpeg"
import cafeteria3 from "../images/cafeteria3.jpeg"
import cafeteria4 from "../images/cafeteria4.jpeg"
import cafe1 from "../images/cafe1.jpeg"
import cafe2 from "../images/cafe2.jpeg"
import cafe3 from "../images/cafe3.jpeg"

const imagenes = [cafeteria1, cafe3, cafeteria2, cafe1, cafeteria3, cafe2, cafeteria4];


function Home() {
  return (
    <div className="home-contenedor">

      <h1 className="titulo-home">¡Bienvenido!</h1>

      <div>
        <Carrusel imagenes={imagenes}/>
      </div>

      <h3 className="subtitulo">Sobre nosotros</h3>

      <div className="texto-home">
        <p className="texto-home1">
        En Espresso, te invitamos a disfrutar de una pausa deliciosa y relajada, cualquier día de la semana. Somos el lugar ideal para tu merienda, ofreciendo una amplia variedad de cafés, infusiones y bebidas refrescantes, siempre preparados con dedicación.
        </p>
        <p className="texto-home2">
        Nuestra gran pasión es acompañar tu momento con una exquisita selección de pastelería fresca, tortas caseras y opciones saladas, todas elaboradas con ingredientes de calidad para deleitar tu paladar.
        </p>
        <p className="texto-home3">
        Encuentra en nuestro ambiente cálido y acogedor el espacio perfecto para reunirte, trabajar o simplemente desconectar. ¡En Espresso, cada merienda se convierte en un pequeño gran placer!
        </p>
      </div>

      <div className="contenedor-boton">
        <BotonHome
          ruta="/menu/menuEspresso/"
          texto="Ver Nuestro Menú"
        ></BotonHome>
        <BotonHome
          ruta="/usuarios"
          texto="Gestion de Perfiles"
        ></BotonHome>
      </div>

        <Footer/>

    </div>
  );
}

export default Home;
