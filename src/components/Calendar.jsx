import FullCalendar from '@fullcalendar/react';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'
import React, { useCallback, useEffect, useState } from 'react';

import ModalAgregarEvento from './ModalAgregarEvento';
import ModalModicarEvento from './ModalModicarEvento';
import EventoCalendario from './EventoCalendario';

function Calendar() {

    const [showModalAgregarEvento, setShowModalAgregarEvento] = useState(false);

    const handleCloseModalAgregarEvento = () => {
        setShowModalAgregarEvento(false);
    };

    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        
        try {
            
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/turnos`);
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
            // console.log(formattedEvents);
            setEvents(formattedEvents);
            // return formattedEvents
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const [showModalModificarEvento, setShowModalModificarEvento] = useState(false);

    const handleCloseModalModificarEvento = () => {
        setShowModalModificarEvento(false);
    };

    const handleOpenModalModificarEvento = () => {
        setShowModalModificarEvento(true);
    };

    const [selectedEvent, setSelectedEvent] = useState(null);

    const updateSelectedEvent = useCallback(() => {
        const eventoSelected = events.find((evento => evento.id === selectedEvent.id));
        setSelectedEvent(eventoSelected);
    }, [events, selectedEvent]);

    useEffect(() => {
        if (selectedEvent) {
            updateSelectedEvent();
            return;
        }
    }, [events, selectedEvent, updateSelectedEvent]);



    const handleEventClick = (arg) => {
        const eventoSelected = events.find((evento => evento.id === arg.event.id));
        setSelectedEvent(eventoSelected);
        handleOpenModalModificarEvento();

    };

    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateClick = (arg) => {
        setSelectedDate(arg);
        // console.log(arg.event);
        setShowModalAgregarEvento(true);
    };

    return (
        <div className="container mt-5">
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
                            <EventoCalendario arg={arg} fetchEvents={fetchEvents} />
                        );
                    }}
                    locales={[esLocale]} // Esto configurará el idioma en español
                    locale="es"
                />
            </div>
            <ModalAgregarEvento showModal={showModalAgregarEvento} handleCloseModal={handleCloseModalAgregarEvento} selectedDate={selectedDate} fetchEvents={fetchEvents} />
            <ModalModicarEvento showModal={showModalModificarEvento} handleOpenModal={handleOpenModalModificarEvento} handleCloseModal={handleCloseModalModificarEvento} selectedEvent={selectedEvent} fetchEvents={fetchEvents} />
        </div>
    );
}

export default Calendar;
