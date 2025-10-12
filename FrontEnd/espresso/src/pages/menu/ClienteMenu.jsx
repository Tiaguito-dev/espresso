import React, { useState, useEffect } from 'react';
import { getProductos } from '../../services/productosService';
import "../menu/ClienteMenu.css"
import Categoria from './Categoria';

export default function MenuCliente() {
    
    const [productos, setProductos] = useState([]);
    // Usamos null para el estado inicial
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null); 
    
    const CATEGORIAS = ['Pizzas', 'Hamburguesas', 'Bebidas', 'Postres']; 
    
    // ... useEffect para cargar productos (queda igual) ...
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductos();
                setProductos(data.filter(p => p.disponible));
            } catch (error) {
                console.error("Error al obtener el menú:", error);
            }
        };
        fetchProductos();
    }, []);
    
    const handleCategoria = (categoria) => {
        setCategoriaSeleccionada(prev =>
            prev === categoria ? null : categoria
        );
    };
    
    return (
        <div className="menu-container">
            <h1>Nuestro Menú</h1>

            <div className="contenedor-categorias">
                {CATEGORIAS.map((cat, index) => {
                    const activa = categoriaSeleccionada === cat;
                    const productosDeCat = productos.filter(p => p.categoria === cat);

                    return (
                        // Contenedor para cada ITEM COMPLETO del acordeón
                        <div key={index} className="item-acordeon"> 
                            {/* USAMOS EL COMPONENTE EXTERNO PARA EL BOTÓN */}
                            <Categoria 
                                nombre={cat}
                                onClick={handleCategoria}
                                categoriaActiva={activa}
                            />

                            {/* PANEL DESPLEGABLE (Se mantiene la lógica de renderizado aquí) */}
                            {activa && (
                                <div className="lista-productos desplegado">
                                    {productosDeCat.length > 0 ? (
                                        productosDeCat.map(p => (
                                            <div key={p.id} className="producto">
                                                <h3>{p.nombre}</h3>
                                                <p>{p.descripcion}</p>
                                                <span>${p.precio}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No hay productos disponibles en {cat}.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}