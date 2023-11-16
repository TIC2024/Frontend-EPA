import React, { useState, useEffect } from 'react';
import './Registros.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Registros = () => {
    const navigate = useNavigate();
    const [estados, setEstados] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [estado, setEstado] = useState("");
    const [contrato, setContrato] = useState("");
    //
    // const [fecha, setFecha] = useState('');
    const [fechaIngreso] = useState('');
    const [fechaInicio] = useState('');
    const [fechaFinal] = useState('');
    const [consecutivo, setConsecutivo] = useState('');
    const [objetoContrato, setObjetoContrato] = useState('');
    const [novedades, setNovedades] = useState('');

    const handleRegister = () => {
        // Asegúrate de que estas variables correspondan a tu modelo de datos y formulario
        const contractData = {
            fechaIngreso,  
            idconsecutivo: consecutivo,
            objeto: objetoContrato,
            fechainicio: fechaInicio,
            fechatermina: fechaFinal,
            novedades,     
            idcontrato: contrato,  // Asumiendo que `contrato` es el ID seleccionado por el usuario
            idestado: estado,      // Asumiendo que `estado` es el ID seleccionado por el usuario
        };
    
        fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contractData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Manejo después de un registro exitoso
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'El registro se completó con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/home/'); // Redirigir al usuario a la página principal
                    }
                });
            } else {
                // Manejo del caso en que no se pudo registrar
                Swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
    };
    //

    useEffect(() => {
        // Cargar los estados de la base de datos
        fetch('http://localhost:5000/api/estados')
            .then(response => response.json())
            .then(data => {
                setEstados(data);
                // Establece un estado inicial si es necesario
                if (data.length > 0) {
                    setEstado(data[0].idestado);
                }
            })
            .catch(error => {
                console.error('Error al cargar los estados:', error);
            });

        // Cargar los tipos de contrato de la base de datos
        fetch('http://localhost:5000/api/tiposcontrato')
            .then(response => response.json())
            .then(data => {
                setContratos(data);
                // Establece un contrato inicial si es necesario
                if (data.length > 0) {
                    setContrato(data[0].idcontrato);
                }
            })
            .catch(error => {
                console.error('Error al cargar los tipos de contrato:', error);
            });
    }, []);

    const regresar = () => {
        navigate('/home/');
    }

    return (
        <div className="registro-container">
            <div className="registro-header">
                <img src="https://www.epa.gov.co/images/imagenes/LOGO_EPA.png" alt="Logo EPA" className="registro-logo"/>
                <h2>Área Jurídica - EPA</h2>
                <h3>Aplicación Web Registro Contratos</h3>
            </div>
            <div className="registro-form">
                <div className="registro-left">
                {/* <label>Fecha: <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} /></label> */}
                    <label>Tipo Contrato: 
                        <select value={contrato} onChange={(e) => setContrato(e.target.value)}>
                            {contratos.map(c => <option key={c.idcontrato} value={c.idcontrato}>{c.tpcontrato}</option>)}
                        </select>
                    </label>
                    <label>Estado: 
                        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                            {estados.map(e => <option key={e.idestado} value={e.idestado}>{e.estado}</option>)}
                        </select>
                    </label>
                    <label>Consecutivo: <input type="number" value={consecutivo} onChange={(e) => setConsecutivo(e.target.value)} /></label>
                    <h4>OBJETO CONTRATO</h4>
                    <textarea placeholder="Objeto del contrato..." className="text-area" value={objetoContrato} onChange={(e) => setObjetoContrato(e.target.value)}></textarea>
                </div>
                {/* <div className="registro-right">
                <label>Fecha Ingreso: <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} /></label>
                    <label>Fecha Inicio: <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} /></label>
                    <label>Fecha Final: <input type="date" value={fechaFinal} onChange={(e) => setFechaFinal(e.target.value)} /></label>
                </div> */}
            </div>
            <h4>CONTRATISTA</h4>
            <textarea placeholder="Novedades del contrato, ejemplo documentos, contratista..." value={novedades} onChange={(e) => setNovedades(e.target.value)}></textarea>
            <div className="registro-buttons">
                <button onClick={handleRegister}>REGISTRAR</button>
                <button onClick={regresar}>REGRESAR</button>
            </div>
        </div>
    );
}