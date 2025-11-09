import React, { useState, useEffect } from 'react';
import { getProductos } from '../../services/productosService';
import Categoria from './Categoria';
import "../../UnicoCSS.css"

import logoEspressoMenu from "../../images/logoMenu.png";

export default function MenuCliente() {

    const [productos, setProductos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    const categoriasDinamicas = ["Todos los productos",
        ...Array.from(
            new Set(productos.map(p => p.categoria.nombre.trim()))
        ),
    ];

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductos();
                setProductos(data.filter(productoItem => productoItem.disponible));
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
        <div className="menu-contenedor">
            <img src={logoEspressoMenu} alt="logo de Espresso" />

            <h3 className='frase-menu'>Sentite como en casa, disfrutando de lo rico que tenemos para vos</h3>
            <div className="contenedor-categorias">
                {categoriasDinamicas.map((categoriaItem, index) => {
                    const activa = categoriaSeleccionada === categoriaItem;
                    const productosDeCategoria =
                        categoriaItem === 'Todos los productos'
                            ? productos
                            : productos.filter(
                                productoItem =>
                                    productoItem.categoria &&
                                    productoItem.categoria.nombre.trim().toLowerCase() ===
                                    categoriaItem.trim().toLowerCase()
                            );

                    return (
                        <div key={index} className="acordeon">
                            <Categoria
                                nombre={categoriaItem}
                                onClick={handleCategoria}
                                categoriaActiva={activa}
                            />

                            <div className={`lista-productos ${activa ? 'desplegado' : ''}`}>
                                {productosDeCategoria.length > 0 ? (
                                    productosDeCategoria.map(productoItem => (
                                        <div key={productoItem.id} className="producto">
                                            <h3>{productoItem.nombre}</h3>
                                            <p>{productoItem.descripcion}</p>
                                            <span>${productoItem.precio}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No hay productos disponibles en {categoriaItem}.</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );



}