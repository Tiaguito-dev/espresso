// Recibe las props 'Id' y 'onCancelar'
const BotonBaja = ({ pedidoId, onCancelar }) => {
  return (
    <button
      className="baja"
      // Llama a la función 'onCancelar' con el ID del pedido
      onClick={() => onCancelar(pedidoId, "Cancelado")}
    >
      Baja
    </button>
  );
};

export default BotonBaja;