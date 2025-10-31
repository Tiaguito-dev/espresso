// src/data/mockPedidos.js

// 🚨 Nota: Añadí el campo 'mozo' a cada pedido para que el filtro de Mozo funcione en el front.
export const PEDIDOS_MOCK_DATA = [
    {
        "nroPedido": 1001,
        "fecha": "2025-10-20T10:00:00.000Z",
        "mesa": 5,
        "mozo": "Juan Pérez", // Añadido para el filtro
        "estadoPedido": "listo",
        "total": 3200, // Calculado: 1*1600 + 2*800
        "lineas": [
            { "idProducto": "002", "cantidad": 1 },
            { "idProducto": "001", "cantidad": 2 }
        ]
    },
    {
        "nroPedido": 1002,
        "fecha": "2025-10-21T11:00:00.000Z",
        "mesa": 2,
        "mozo": "Ana Gómez", // Añadido para el filtro
        "estadoPedido": "listo",
        "total": 3500, // Calculado: 1*3500
        "lineas": [
            { "idProducto": "004", "cantidad": 1 }
        ]
    },
    {
        "nroPedido": 1003,
        "fecha": "2025-10-21T12:00:00.000Z",
        "mesa": 3,
        "mozo": "Juan Pérez",
        "estadoPedido": "pendiente",
        "total": 4000, // Calculado: 1*4000
        "lineas": [
            { "idProducto": "003", "cantidad": 1 }
        ]
    }
];