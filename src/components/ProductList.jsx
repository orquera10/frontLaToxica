import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';

function ProductList({ handleProductoSelect, setcantidad }) {
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);

    useEffect(() => {
        handleProductoSelect(productosDisponibles[selectedProductIndex]);
    }, [selectedProductIndex, productosDisponibles, handleProductoSelect]);

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

    const handleProductSelect = (index) => {
        setSelectedProductIndex(index);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                            {productosDisponibles.map((producto, index) => (
                                <Col key={producto._id}>
                                    <Card
                                        className={`mb-3 ${index === selectedProductIndex ? 'border-primary' : ''}`}
                                        style={{ width: '100%' }}
                                        onClick={() => handleProductSelect(index)}
                                    >
                                        <Card.Img variant="top" src={producto.imagenURL || "https://img.freepik.com/vector-gratis/ilustracion-icono-galeria_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.539837299.1711843200&semt=ais"} />
                                        <Card.Body>
                                            <Card.Title>{producto.nombre}</Card.Title>
                                            <Card.Text>{producto.detalle}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 offset-md-4">
                    <div className="mt-3">
                        <input
                            type="number"
                            onChange={handleCantidadChange}
                            placeholder="Cantidad"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductList;
