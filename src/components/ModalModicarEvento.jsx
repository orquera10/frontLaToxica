import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ModalProductos from './ModalProductos';

const ModalModicarEvento = ({ showModal, handleOpenModal, handleCloseModal, selectedEvent, fetchEvents }) => {

    // Función para formatear hora y minutos
    const formatTime = (dateStr) => {
        const date = new Date(dateStr);

        // Sumar tres horas a la hora de la fecha
        date.setHours(date.getHours() + 3);

        const hours = date.getHours().toString().padStart(2, '0'); // Obtener horas y asegurar que tenga dos dígitos
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Obtener minutos y asegurar que tenga dos dígitos
        return `${hours}:${minutes}`; // Formatear la hora y los minutos sumando tres horas
    };

    const [showModalAgregarProducto, setShowModalAgregarProducto] = useState(false);

    // Crea un método para borrar el producto seleccionado al detalle del turno
    const handleBorrarProducto = async (id) => {

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/turnos/${selectedEvent.id}/producto/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al borrar el producto al detalle del turno');
            }
            fetchEvents();


        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Modal show={showModal} onHide={handleCloseModal} className='modalModificar'>
                <Modal.Header closeButton>
                    <Modal.Title><h3>Detalles del Evento</h3></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEvent && (
                        <div>
                            <div className='row'>
                                <div className='col-4 d-flex flex-column'>
                                    <h4 className='mb-3'>Detalles del Turno</h4>

                                    <h6>Nombre de Reserva: <span className='h5'>{selectedEvent.title}</span></h6>
                                    <h6>Hora de Entrada: {formatTime(selectedEvent.start) + " Hs"}</h6>
                                    <h6>Hora de Salida: {formatTime(selectedEvent.end) + " Hs"}</h6>
                                    <h6>Cancha: {selectedEvent.cancha.nombre}</h6>


                                </div>
                                <div className='col-8'>
                                    <h4 className='mb-3'>Productos</h4>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th scope="col">Producto</th>
                                                <th scope="col">Cantidad</th>
                                                <th scope="col">Precio Unitario</th>
                                                <th scope="col">Total</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Renderizar los productos del detalle del turno */}
                                            {selectedEvent.detalle.productos_consumidos.map((detalleProducto, index) => (
                                                <tr key={index}>
                                                    <td>{detalleProducto.producto.nombre}</td>
                                                    <td className='text-center'>{detalleProducto.cantidad}</td>
                                                    <td className='text-center'>{detalleProducto.producto.precio_unitario} $</td>
                                                    <td className='text-center'>{detalleProducto.producto.precio_unitario * detalleProducto.cantidad} $</td>
                                                    <td className='text-center'><Button variant="danger" onClick={() => { handleBorrarProducto(detalleProducto.producto._id) }}>
                                                        eliminar
                                                    </Button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="d-flex justify-content-center">
                                        <Button variant="primary" onClick={
                                            () => {
                                                setShowModalAgregarProducto(true);
                                                handleCloseModal();
                                            }}>
                                            add
                                        </Button>
                                    </div>

                                </div>

                            </div>
                            <div className='row mt-3'>
                                <div className='col-4'>
                                    <h5 className='text-end'>Total Turno {selectedEvent.detalle.total_alquiler} $</h5>
                                </div>
                                <div className='col-8'>
                                    <h5 className='text-end'>Total Consumo {selectedEvent.detalle.total_consumido} $</h5>
                                </div>
                            </div>
                            <h4 className='text-end'>Total Consumo {selectedEvent.detalle.total} $</h4>
                        </div>
                    )}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Aceptar
                    </Button>
                    <Button variant="danger" onClick={handleCloseModal}>
                        Cerrar Turno
                    </Button>
                </Modal.Footer>
            </Modal>
            <ModalProductos modal={showModalAgregarProducto} setModal={setShowModalAgregarProducto} selectedEvent={selectedEvent} fetchEvents={fetchEvents} handleOpenModal={handleOpenModal} />
        </div>
    )
}

export default ModalModicarEvento