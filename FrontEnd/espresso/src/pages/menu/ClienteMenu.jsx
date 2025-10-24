import React, { useState, useEffect } from 'react';
import { getProductos } from '../../services/productosService';
import "../menu/ClienteMenu.css"
import Categoria from './Categoria';



export default function MenuCliente() {
    
    const [productos, setProductos] = useState([]);
    //const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null); 


    //esta funcion era la nueva version del codigo, porque me faltaba el fetchCategorias. PERO con la version vieja funciona, lo dejor por las duda por si en un futuro lo llegamos a precisar 
/*
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductos();
                setProductos(data.filter(productoItem => productoItem.disponible));
            } catch (error) {
                console.error("Error al obtener el menú:", error);
            }
        };

        const fetchCategorias = async () => {
            try {
                const data = await getCategorias();
                setCategorias(data); 
            } catch (error) {
                console.error("Error al obtener las categorías:", error);
            }
        };
        fetchProductos();
        fetchCategorias();
    }, []);

    const categoriasDinamicas = ["Todos los productos",
        ...categorias.map(c => c.nombre.trim())
    ];
*/
    

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
        <div className="menu-container">
            <h1>Nuestro Menú</h1>

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
                        <div key={index} className="item-acordeon"> 
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