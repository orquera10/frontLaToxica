import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí puedes implementar la lógica para autenticar al usuario
    console.log("Usuario:", username);
    console.log("Contraseña:", password);
    // Por ejemplo, puedes enviar los datos a un servidor para autenticación
  };

  return (
    <div className="row container-fluid contenedorLogin m-0 p-0">
      <div className="col-4 d-flex align-items-center justify-content-center contenedorInputs">
        <Container>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label className="mt-3">Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Link
              to={"/calendar"}
              variant="primary"
              type="submit"
              title="Ingresar"
            >
              <Button variant="primary" type="submit" className="my-5">
                Ingresar
              </Button>
            </Link>
          </Form>
        </Container>
      </div>
      <div className="col-8 contenedorImagen"></div>
    </div>
  );
};

export default Login;
