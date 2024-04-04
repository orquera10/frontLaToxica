import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'
import moment from 'moment'; // Importa Moment.js
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

//Dario Orquera mod
function App() {

  //Traer Productos -----------------------------------
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/productos');
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProductos();
  }, []);

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

  // Estado para los campos del formulario
  const [nombreReserva, setNombreReserva] = useState('');
  const [horaEntrada, setHoraEntrada] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [cancha, setCancha] = useState('');

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

    console.log('Nuevo evento:', nuevoEvento);
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

      const data = await response.json();
      console.log('Evento agregado:', data);
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [showModal, setShowModal] = useState(false);


  const handleDateClick = (arg) => {
    setShowModal(true);
    setNombreReserva('');
    // Obtener la fecha seleccionada y establecer la hora a las 15:00
    const selectedDateTime = moment(arg.dateStr).set('hour', 15).set('minute', 0);
    // Formatear en el formato requerido "yyyy-MM-ddThh:mm"
    const formattedDateTime = selectedDateTime.format('YYYY-MM-DDTHH:mm');
    // Establecer la hora de entrada y salida
    setHoraEntrada(formattedDateTime);
    setHoraSalida(formattedDateTime);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [showModal2, setShowModal2] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (arg) => {
    setSelectedEvent(arg.event);
    console.log(arg.event);
    setShowModal2(true);
  };

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/turnos');
      if (!response.ok) {
        throw new Error('Error al obtener los eventos');
      }
      const data = await response.json();
      const formattedEvents = data.map(event => ({
        title: event.nombre_reserva, // Reemplaza 'titulo' con la propiedad que corresponda al título de tu evento
        start: event.hora_entrada, // Reemplaza 'fecha_inicio' con la propiedad que corresponda a la fecha de inicio de tu evento
        end: event.hora_salida, // Reemplaza 'fecha_fin' con la propiedad que corresponda a la fecha de fin de tu evento (si está disponible)
        id: event._id,
        cancha: event.cancha,
        detalle: event.detalle
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  console.log(events);

  // Función para formatear hora y minutos
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);

    // Sumar tres horas a la hora de la fecha
    date.setHours(date.getHours() + 3);

    const hours = date.getHours().toString().padStart(2, '0'); // Obtener horas y asegurar que tenga dos dígitos
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Obtener minutos y asegurar que tenga dos dígitos
    return `${hours}:${minutes}`; // Formatear la hora y los minutos sumando tres horas
  };

  // Estado para almacenar el ID del evento a eliminar
  const [eventToDelete, setEventToDelete] = useState(null);

  // Función para abrir el modal de confirmación
  const handleConfirmDelete = (eventId) => {
    setEventToDelete(eventId);
  };

  // Función para cerrar el modal de confirmación
  const handleCloseModal3 = () => {
    setEventToDelete(null);
  };

  // Función para eliminar el evento
  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/turnos/${eventId}`, {
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
      handleCloseModal3();
    }
  };

  return (
    <div className="App">
      <h1 className='text-center'>Aplicación React para La Toxica</h1>
      <div className="container mt-5">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay' // user can switch between the two
          }}
          timeZone="America/Argentina/Buenos_Aires" // Zona horaria de Chile
          eventContent={(arg, createElement) => {
            return (
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
                <Modal show={!!eventToDelete} onHide={handleCloseModal3}>
                  <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    ¿Estás seguro que deseas eliminar este evento?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal3}>
                      Cancelar
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteEvent(eventToDelete)}>
                      Eliminar
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            );
          }}
        />
      </div>

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

      <Modal show={showModal2} onHide={() => setShowModal2(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <div>
                <h4>Detalles del Turno</h4>
                <p>Nombre de Reserva: {selectedEvent.title}</p>
                <p>Hora de Entrada: {formatTime(selectedEvent._instance.range.start)}</p>
                <p>Hora de Salida: {formatTime(selectedEvent._instance.range.end)}</p>
                <p>Cancha: {selectedEvent.extendedProps.cancha.nombre}</p>
              </div>
              <div>
                <h4>Productos</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Renderizar los productos del detalle del turno */}
                    {selectedEvent.extendedProps.detalle.productos_consumidos.map((detalleProducto, index) => (
                      <tr key={index}>
                        <td>{detalleProducto.producto.nombre}</td>
                        <td>{detalleProducto.cantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default App;
