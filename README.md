# Cafetería Espresso

## Descripción del proyecto
**Cafetería Espresso** es un software integral para la gestión de pedidos, menús y operaciones internas de una cafetería.  
Optimiza la comunicación entre camareros, cocineros, cajeros, dueño y clientes, garantizando un flujo de trabajo claro, eficiente y sincronizado.

---

## Índice
1. [Flujo del pedido](#flujo-del-pedido)  
2. [Módulo de gestión de pedidos](#módulo-de-gestión-de-pedidos)  
3. [Módulos de la cafetería](#módulos-de-la-cafetería)  
4. [Arquitectura del sistema](#arquitectura-del-sistema)  
5. [Tecnologías usadas](#tecnologías-usadas)  
6. [Instalación y ejecución](#instalación-y-ejecución)  
7. [Licencia](#licencia)  
8. [Troubleshooting](#troubleshooting)  

---

## Flujo del pedido
1. El camarero toma el pedido desde la mesa.  
2. El pedido aparece automáticamente en la vista del cocinero.  
3. El cocinero marca el pedido como “listo”.  
4. El cajero lo pasa a “pago pendiente”.  
5. El cliente paga su pedido.  
6. El pedido se marca como “finalizado”.  

---

## Módulo de gestión de pedidos

### Funcionalidades principales
- Toma de pedidos  
- Selección de mesa desde la tabla  
- Selección de productos y categorías  
- Ingreso de cantidad por producto  
- Visualización de la lista de artículos seleccionados  
- Confirmación del pedido → pasa a la vista del cocinero  
- Gestión de pedidos activos  
  - Edición del pedido (según estado)  
  - Actualización del estado:  
    - En preparación  
    - Listo para entregar  
    - Rechazado  
  - Asignación de prioridad (alta, media, baja)  

### Pago de pedidos
- El pedido pasa a caja al estar listo  
- El cajero puede marcarlo como pagado o pendiente  
- El pedido se da por finalizado al registrarse el pago  

---

## Módulos de la cafetería

### Vista del dueño
- Administración del menú  
- Carga y modificación de productos:  
  - Nombre  
  - Categoría  
  - Precio  
  - Estado (disponible / no disponible)  

### Vista del cocinero
- Visualización de pedidos pendientes  
- Cambio de estado de productos y pedidos  
- Control de flujo de preparación y despacho  

### Vista del camarero
- Creación y carga de nuevos pedidos  
- Visualización de productos disponibles  
- Envío de pedidos a cocina  

### Vista de caja
- Lista de pedidos activos y finalizados  
- Búsqueda por mesa, estado o fecha  
- Cambio de estado (pagado / pendiente)  
- Cierre de pedido al cobrar  

### Vista del cliente
- Visualización del menú  
- Seguimiento del estado del pedido  

---

## Arquitectura del sistema
El sistema se divide en módulos principales:  
- Gestión de Pedidos  
- Gestión de Menú  
- Gestión de Usuarios (roles y permisos)  
- Gestión de Pagos  
- Gestión de Mesas  

Cada módulo cuenta con sus propias vistas, controladores y modelos, manteniendo una arquitectura modular, mantenible y escalable.

---

## Tecnologías usadas

| Componente   | Tecnología |
|------------|------------|
| Frontend   | React      | ![React](https://img.shields.io/badge/React-18-blue)
| Backend    | Node.js    | ![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)
| Base de datos | Supabase |

---

## Instalación y ejecución

### Clonar el repositorio
```bash
1. Clonamos el repositorio
git clone https://github.com/Tiaguito-dev/espresso.git
2. instalamos NodeJs en el backend y en el Frontend VIte+React
cd espresso
cd backend && npm install NodeJs
cd ../frontend && npm install vite
3. Levantamos el servidor
 ##en el Backend y en el frontend
 cd backend
   npm run dev
 cd Frontend
   npm run dev
```
## Cómo utilizar el proyecto
1. Iniciar el backend y frontend con `npm run dev`.
2. Acceder desde el navegador a `http://localhost:5173`.
3. Crear pedidos desde la vista del camarero.
4. Ver el flujo de pedidos en tiempo real entre camarero, cocinero, caja y cliente.

---
## Licencia

MIT License
Copyright (c) 2025 [Nombre del poseedor del Copyright]

Se permite a cualquier persona usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software, sujeto a que se incluya el aviso de copyright y esta nota de permiso.
El software se proporciona “tal cual”, sin garantía de ningún tipo.
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
---
## Troubleshooting

Verificar conexión a Supabase si el backend no inicia

Asegurarse de tener Node.js y npm instalados

Si el frontend no carga, ejecutar `npm install vite` nuevamente en la carpeta frontend
