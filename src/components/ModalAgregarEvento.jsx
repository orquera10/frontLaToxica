import moment from 'moment'; // Importa Moment.js
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalAgregarEvento = ({ showModal, handleCloseModal, fetchEvents, selectedDate }) => {

    // Estado para los campos del formulario
    const [nombreReserva, setNombreReserva] = useState('');
    const [horaEntrada, setHoraEntrada] = useState('');
    const [horaSalida, setHoraSalida] = useState('');
    const [cancha, setCancha] = useState('');

    useEffect(() => {
        if (selectedDate) {
            // Obtener la fecha seleccionada y establecer la hora a las 15:00
            const selectedDateTime = moment(selectedDate.dateStr).set('hour', 15).set('minute', 0);
            // Formatear en el formato requerido "yyyy-MM-ddThh:mm"
            const formattedDateTime = selectedDateTime.format('YYYY-MM-DDTHH:mm');
            // Establecer la hora de entrada y salida
            setHoraEntrada(formattedDateTime);
            setHoraSalida(formattedDateTime);
        }
    }, [selectedDate, showModal])

    useEffect(() => {
        setNombreReserva("");
    }, [showModal])

    // Traer Canchas ------------------------------------
    const [canchas, setCanchas] = useState([]);

    useEffect(() => {
        const fetchCanchas = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/canchas');
                if (!response.ok) {
                    throw new Error('Error al cargar las canchas');
                }
                const data = await response.json();
                setCanchas(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchCanchas();
    }, []);

    // Manejadores de cambio para los campos del formulario
    const handleNombreReservaChange = (event) => {
        setNombreReserva(event.target.value);
    };

    const handleHoraEntradaChange = (event) => {
        // Obtener la hora de entrada seleccionada
        const selectedDateTime = moment(event.target.value);
        // Formatear en el formato requerido "yyyy-MM-ddThh:mm"
        const formattedDateTime = selectedDateTime.format('YYYY-MM-DDTHH:mm');
        setHoraEntrada(formattedDateTime);
    };

    const handleHoraSalidaChange = (event) => {
        // Obtener la hora de salida seleccionada
        const selectedDateTime = moment(event.target.value);
        // Formatear en el formato requerido "yyyy-MM-ddThh:mm"
        const formattedDateTime = selectedDateTime.format('YYYY-MM-DDTHH:mm');
        setHoraSalida(formattedDateTime);
    };

    const handleCanchaChange = (event) => {
        const canchaSeleccionada = event.target.value;
        const canchaIdSeleccionada = canchas.find(cancha => cancha.nombre === canchaSeleccionada)._id;
        setCancha(canchaIdSeleccionada);
    };

    // Manejador de envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();


        const nuevoEvento = {
            nombre_reserva: nombreReserva,
            hora_entrada: horaEntrada + ':00.000Z',
            hora_salida: horaSalida + ':00.000Z',
            cancha: cancha,
        };

        // Aquí puedes enviar el nuevo evento al backend con fetch
        try {
            const response = await fetch('http://localhost:8081/api/turnos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoEvento),
            });

            if (!response.ok) {
                throw new Error('Error al agregar el evento');
            }

            
            handleCloseModal();
            fetchEvents();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Nombre de reserva:</label>
                        <input type="text" value={nombreReserva} onChange={handleNombreReservaChange} />
                    </div>
                    <div>
                        <label>Hora de entrada:</label>
                        <input type="datetime-local" value={horaEntrada} onChange={handleHoraEntradaChange} />
                    </div>
                    <div>
                        <label>Hora de salida:</label>
                        <input type="datetime-local" value={horaSalida} onChange={handleHoraSalidaChange} />
                    </div>
                    <div>
                        <label>Cancha:</label>
                        <select onChange={handleCanchaChange}>
                            <option value="">Seleccionar cancha</option>
                            {canchas.map(cancha => (
                                <option key={cancha._id} value={cancha.nombre}>
                                    {cancha.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ModalAgregarEvento