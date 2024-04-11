import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ProductList from './ProductList';

const ModalProductos = ({ modal, setModal, selectedEvent, fetchEvents, handleOpenModal }) => {

    // Crea un estado para almacenar el producto seleccionado
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const [cantidad, setcantidad] = useState(1);

    // Crea un método para manejar la selección de productos
    const handleProductoSelect = (producto) => {
        setProductoSeleccionado(producto);
    };

    // Crea un método para agregar el producto seleccionado al detalle del turno
    const handleAgregarProducto = async () => {
        if (!productoSeleccionado) return;
        try {
            const quantity = {cantidad:cantidad};
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/turnos/${selectedEvent.id}/producto/${productoSeleccionado._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quantity),
            });

            if (!response.ok) {
                throw new Error('Error al agregar el producto al detalle del turno');
            }
            fetchEvents();
            setcantidad(1)
            setModal(false);
            handleOpenModal();

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Modal show={modal} onHide={() => {
                setModal(false);
                handleOpenModal();
            }} className='modalModificar'>
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductList handleProductoSelect={handleProductoSelect} setcantidad={setcantidad} cantidad={cantidad} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setModal(false);
                        handleOpenModal();
                    }}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleAgregarProducto}>
                        Agregar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ModalProductos