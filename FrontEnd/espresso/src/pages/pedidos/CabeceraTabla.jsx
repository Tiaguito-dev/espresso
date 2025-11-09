function CabeceraTabla({ arrayCampos }) {
    
    return (
        <tr>
            {arrayCampos.map((campo) => (
                <th key={campo}>{campo}</th>
            ))}
        </tr>
    );
}

export default CabeceraTabla;