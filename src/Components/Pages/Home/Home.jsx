import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


export const Home = () => {
    const [contracts, setContracts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      fetch('http://localhost:5000/api/contratos')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              setContracts(data);
          })
          .catch(error => {
              console.error("Error fetching data:", error);
          });
  }, []);

  const handleNewContractClick = () => {
    navigate('/register/');
  }

  const handleCerrarSesion = () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas cerrar sesión?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#003863',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            // Lugar donde borras las credenciales, por ejemplo:
            // localStorage.removeItem('token'); // o lo que uses para manejar la sesión
            navigate('/');
        }
    });
};

  return (
    <div className="container">
        <div className="header">
            <div className="logo-container">
                <img src="https://www.epa.gov.co/images/imagenes/LOGO_EPA.png" alt="Logo de la empresa" className="logo" />
            </div>

            <button className="new-contract-btn" onClick={handleNewContractClick}>
                Nuevo registro
            </button>
            <button className="cerrar-sesion" onClick={handleCerrarSesion}>
                Cerrar Sesion
            </button>
        </div>

        <table className="table">
            <thead>
                <tr>
                    <th>Tipo de Contrato</th>
                    <th>Estado</th>
                    <th>Consecutivo</th>
                    {/* <th>Ingreso</th>
                    <th>Inicio</th>
                    <th>Termina</th>
                    <th>Actualización</th> */}
                    <th>Objeto</th>
                    <th>Contratista</th>
                </tr>
            </thead>
            <tbody>
                {contracts.map((contract,index) => (
                    <tr key={index}>
                        <td>{contract.tpcontrato}</td>
                        <td>{contract.estado}</td>
                        <td>{contract.idconsecutivo}</td>
                        {/* <td>{contract.fechaingreso}</td>
                        <td>{contract.fechainicio}</td>
                        <td>{contract.fechatermina}</td>
                        <td>{contract.fechaactualizacion}</td> */}
                        <td>{contract.objeto}</td>
                        <td>{contract.novedades}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)
}
