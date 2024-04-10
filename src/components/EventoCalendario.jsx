import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const EventoCalendario = ({arg, fetchEvents}) => {
    
    // Estado para almacenar el ID del evento a eliminar
    const [eventToDelete, setEventToDelete] = useState(null);

    // Función para abrir el modal de confirmación
    const handleConfirmDelete = (eventId) => {
        setEventToDelete(eventId);
    };

    // Función para cerrar el modal de confirmación
    const handleCloseModal = () => {
        setEventToDelete(null);
    };

    // Función para eliminar el evento
    const handleDeleteEvent = async (eventId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/turnos/${eventId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el evento');
            }

            // Actualizar la lista de eventos después de eliminar el evento
            fetchEvents();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            // Cerrar el modal de confirmación
            handleCloseModal();
        }
    };

    return (
        <div>
            <div style={{
                backgroundColor: 'blue', // Fondo azul
                color: 'white', // Letras blancas
                borderRadius: '10px', // Bordes redondeados
                padding: '5px', // Espacio interno
            }}>
                <span>{new Date(arg.event.start).toLocaleTimeString('es-ES', { timeZone: 'UTC' }).substring(0, 5)}</span>
                <span className='px-2'>{arg.event.title}</span>
                <FontAwesomeIcon icon={faTrashAlt} onClick={(event) => {
                    event.stopPropagation(); // Evitar propagación del evento
                    handleConfirmDelete(arg.event.id);
                }} />
                <Modal show={!!eventToDelete} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar eliminación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        ¿Estás seguro que deseas eliminar este evento?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteEvent(eventToDelete)}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default EventoCalendario