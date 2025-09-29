function Filtro({ estadoActual, estadoValor, nombreFiltro, onClick }) {
    return (
        <span
            className={estadoActual === estadoValor ? "activo" : ""}
            onClick={() => onClick(estadoValor)}
        >
            {nombreFiltro}
        </span>
    );
}

export default Filtro;