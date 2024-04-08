import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';


function ProductList({ handleProductoSelect, setcantidad }) {
    const [productosDisponibles, setProductosDisponibles] = useState([]);

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        handleProductoSelect(productosDisponibles[activeIndex]);
    }, [activeIndex, productosDisponibles]);

    const fetchProductosDisponibles = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/productos');
            if (!response.ok) {
                throw new Error('Error al cargar los productos disponibles');
            }
            const data = await response.json();
            setProductosDisponibles(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchProductosDisponibles();
    }, []);

    const handleCantidadChange = (event) => {
        setcantidad(Number(event.target.value)); // Actualiza la cantidad seleccionada
    };

    const handleSelect = (selectedIndex, e) => {
        setActiveIndex(selectedIndex);
        handleProductoSelect(productosDisponibles[selectedIndex]);
    };

    return (
        <div>
            <Carousel interval={null} onSelect={handleSelect}>
                {productosDisponibles.map(producto => (
                    <Carousel.Item key={producto._id}>
                        <img
                            className="d-block w-100"
                            src={producto.imagenURL || "https://img.freepik.com/vector-gratis/ilustracion-icono-galeria_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.539837299.1711843200&semt=ais"}
                            alt={producto.nombre}
                        />
                        <Carousel.Caption>
                            <h3 className="text-dark">{producto.nombre}</h3>
                            <p className="text-dark">{producto.detalle}</p>
                            <input
                                type="number"
                                onChange={handleCantidadChange} // Maneja el cambio de la cantidad seleccionada
                                placeholder="Cantidad"
                            />
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>

        </div>
    );
}

export default ProductList;
