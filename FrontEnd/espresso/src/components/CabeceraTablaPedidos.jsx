import React from "react";

function CabeceraTablaPedidos({ arrayCampos }) {
    return (
        <tr>
            {arrayCampos.map((campo, index) => (
                <th key={index}>{campo}</th>
            ))}
        </tr>
    );
}

export default CabeceraTablaPedidos;