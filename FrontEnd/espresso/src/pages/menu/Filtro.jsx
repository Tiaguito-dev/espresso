function Filtro({ estadoActual, estadoValor, nombreFiltro, onClick }) {
    return (
        <button
            className={"todos"}
            onClick={() => onClick(estadoValor)}
        >
            {nombreFiltro}
        </button>
    );
}

export default Filtro;