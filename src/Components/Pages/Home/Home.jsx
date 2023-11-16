import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export const Home = () => {
    const [contracts, setContracts] = useState([]);
    const navigate = useNavigate();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [currentContract, setCurrentContract] = useState({
        tpcontrato: '',
        objeto: '',
        novedades: '',
        estado: '',
      });
    const [contractTypes, setContractTypes] = useState([]);
    const [contractStates, setContractStates] = useState([]);

    const fetchContractTypes = () => {
        fetch('http://localhost:5000/api/tiposcontrato')
            .then(response => response.json())
            .then(data => setContractTypes(data))
            .catch(error => console.error('Error fetching contract types:', error));
    };

    // Función para obtener los estados de contrato
    const fetchContractStates = () => {
        fetch('http://localhost:5000/api/estados')
            .then(response => response.json())
            .then(data => setContractStates(data))
            .catch(error => console.error('Error fetching contract states:', error));
    };

    const downloadExcel = () => {
        // Crear un nuevo libro de trabajo
        const wb = XLSX.utils.book_new();
        // Convertir los datos de los contratos a formato de hoja de trabajo
        const ws = XLSX.utils.json_to_sheet(contracts);
        // Añadir la hoja de trabajo al libro con un nombre
        XLSX.utils.book_append_sheet(wb, ws, "Contratos");
        // Escribir el archivo y forzar el download
        XLSX.writeFile(wb, "contratos.xlsx");
      };
    
    const deleteContract = (id) => {
        fetch(`http://localhost:5000/api/contratos/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Contrato eliminado:', data);
            // Remueve el contrato eliminado del estado
            setContracts(contracts.filter(contract => contract.idconsecutivo !== id));
        })
        .catch(error => {
            console.error("Error deleting contract:", error);
        });
    }

    const confirmDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteContract(id);
            }
        });
    };

    const openUpdateModal = (contract) => {
        setCurrentContract({
            ...currentContract,
            idcontrato: contract.idcontrato,
            objeto: contract.objeto,
            novedades: contract.novedades,
            idestado: contract.idestado,
            idconsecutivo: contract.idconsecutivo // Asegúrate de tener este campo en tus contratos
        });
        setIsUpdateModalOpen(true);
    };
    

    // Función para cerrar el modal de actualización
    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
    };

    const loadContracts = () => {
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
    };

    // Función para manejar la actualización del contrato después de la confirmación
    const handleUpdate = (updatedContract) => {
        const { idconsecutivo } = updatedContract;
        
        const contractToUpdate = {
            objeto: updatedContract.objeto,
            novedades: updatedContract.novedades,
            idestado: parseInt(updatedContract.idestado), // Asegúrate de convertir a número
            idcontrato: parseInt(updatedContract.idcontrato), // Asegúrate de convertir a número
        };
        
        fetch(`http://localhost:5000/api/contratos/${idconsecutivo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contractToUpdate)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                Swal.fire('Actualización Exitosa', 'El contrato se ha actualizado correctamente', 'success');
            } else {
                Swal.fire('Error de Actualización', 'No se pudo actualizar el contrato', 'error');
            }
            setIsUpdateModalOpen(false); // Cierra el modal después de la actualización
            loadContracts(); // Recarga los contratos después de actualizar
        })
        .catch(error => {
            console.error("Error updating contract:", error);
            Swal.fire('Error de Actualización', 'Hubo un problema al actualizar el contrato', 'error');
        });
    };

    // Función para confirmar la actualización
    const confirmUpdate = (updatedFields) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Confirmar los cambios",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleUpdate(updatedFields);
                closeUpdateModal();
            }
        });
    };


    useEffect(() => {
        fetchContractTypes();
        fetchContractStates();
        loadContracts();
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
            <button className="download-btn last-btn" onClick={downloadExcel}>
                <img src="https://static.vecteezy.com/system/resources/previews/017/396/828/original/microsoft-excel-mobile-apps-logo-free-png.png" alt="Descargar Excel" />
                Descargar Excel
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
                    <th>Acciones</th>
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
                        <td>
                        <FontAwesomeIcon 
                            icon={faEdit} 
                            onClick={() => openUpdateModal(contract)} 
                            className="action-icon edit-icon" 
                        />
                        <FontAwesomeIcon 
                            icon={faTrashAlt} 
                            onClick={() => confirmDelete(contract.idconsecutivo)} 
                            className="action-icon delete-icon" 
                        />
                            </td>
                    </tr>
                ))}
            </tbody>
            </table>
 {isUpdateModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Actualizando Contrato</h3>
      <div className="input-group">
        <label>Tipo de Contrato</label>
        <select
    value={currentContract.idcontrato}
    onChange={(e) => setCurrentContract({ ...currentContract, idcontrato: e.target.value })}
>
    {contractTypes.map((type) => (
        <option key={type.idcontrato} value={type.idcontrato}>
            {type.tpcontrato}
        </option>
    ))}
</select>
      </div>
      <div className="input-group">
        <label>Objeto</label>
        <input 
          type="text" 
          value={currentContract.objeto}
          onChange={(e) => setCurrentContract({ ...currentContract, objeto: e.target.value })}
          placeholder="Objeto del contrato" 
        />
      </div>
      <div className="input-group">
        <label>Contratista</label>
        <input 
          type="text" 
          value={currentContract.novedades}
          onChange={(e) => setCurrentContract({ ...currentContract, novedades: e.target.value })}
          placeholder="Nombre del contratista" 
        />
      </div>
      <div className="input-group">
        <label>Estado</label>
        <select
    value={currentContract.idestado}
    onChange={(e) => setCurrentContract({ ...currentContract, idestado: e.target.value })}
>
    {contractStates.map((state) => (
        <option key={state.idestado} value={state.idestado}>
            {state.estado}
        </option>
    ))}
</select>
      </div>
      <div className="modal-button-group">
        <button 
          className="modal-button" 
          onClick={() => confirmUpdate(currentContract)}
        >
          Confirmar Actualización
        </button>
        <button 
          className="modal-button cancel" 
          onClick={closeUpdateModal}
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}
    </div>
)
}
