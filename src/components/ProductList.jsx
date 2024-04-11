import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';

function ProductList({ handleProductoSelect, setcantidad, cantidad }) {
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);

    useEffect(() => {
        handleProductoSelect(productosDisponibles[selectedProductIndex]);
    }, [selectedProductIndex, productosDisponibles, handleProductoSelect]);

    const fetchProductosDisponibles = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/productos`);
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
                <div className="">

                    <div className="mt-3 d-flex align-items-center justify-content-center">
                        <p className='m-0 p-0 h5'>Cantidad</p>
                        <input
                            type="number"
                            value={cantidad}
                            onChange={handleCantidadChange}
                            placeholder="Cantidad"
                            className='mx-3 p-1 text-center w-25'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductList;
