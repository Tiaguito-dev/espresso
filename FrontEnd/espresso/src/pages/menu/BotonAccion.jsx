function BotonAccion({className, onClick, texto}) {


    return (
        <button className={className} onClick={() => onClick()}>
            {texto}
        </button>
    );
}

export default BotonAccion;