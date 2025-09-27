import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  /*
    NOTA IMPORTANTE: DOBLE EJECUCIÓN EN DESARROLLO
    Si notan que hay cosas que se ejecutan dos veces (sobre todo el useEffect), es porque React.StrictMode que está habilitado en la aplicación (generalmente en index.js o App.js).
 
    ¿Es un problema?
    - No, porque es comportamiento esperado e intencional de React
    - Indica que el código es "puro" si funciona correctamente con doble ejecución
    - Ayuda a detectar efectos secundarios no deseados en desarrollo

    Cómo sacarlo TEMPORALMENTE solucionarlo si es necesario?
    Remover <React.StrictMode> de acá abajo pero tienen que volverlo a poner.

    Más info: https://react.dev/reference/react/StrictMode#fixing-bugs-found-by-double-execution
 */
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
