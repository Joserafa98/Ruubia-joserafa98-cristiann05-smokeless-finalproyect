import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const CoachCard = () => {
    const { store, actions } = useContext(Context);
    const [alertMessage, setAlertMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            await actions.getAllCoaches(); // Trae todos los coaches
            await actions.getAllSolicitudes(); // Trae todas las solicitudes
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const formatFecha = (date) => {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    const fechaSolicitud = formatFecha(new Date());

    const handleAddCoach = (coachId) => {
        const userId = store.loggedInUser?.id;
    
        if (!userId) {
            setAlertMessage("Error: Usuario no autenticado.");
            return;
        }
    
        const solicitudData = {
            id_usuario: userId,
            id_coach: coachId,
            fecha_solicitud: fechaSolicitud,
            estado: false,
            fecha_respuesta: null,
            comentarios: 'Estoy interesado en el coaching',
        };
    
        console.log("Solicitud a enviar:", solicitudData);
    
        actions.addSolicitud(solicitudData)
            .then(() => {
                setAlertMessage("Solicitud enviada exitosamente!");
                
                return Promise.all([
                    actions.getAllCoaches(), 
                    actions.getAllSolicitudes() 
                ]);
            })
            .then(() => {
                // Aquí puedes hacer cualquier otra acción que necesites después de la actualización
                console.log("Coaches y solicitudes actualizados.");
            })
            .catch((error) => {
                console.error("Error al enviar la solicitud:", error);
                setAlertMessage("Hubo un fallo al enviar la solicitud.");
            });
    };
    

    const handleViewProfile = (coachId) => {
        navigate(`/coach-details/${coachId}`);
    };

    // Filtrar coaches que han completado su perfil y que no tienen solicitudes pendientes ni aprobadas
    const filteredCoaches = store.coaches.filter(coach => {
        const hasValidProfile = coach.nombre_coach && coach.genero_coach && coach.direccion && coach.nacimiento_coach;
        const hasRequest = store.solicitudes.some(solicitud => {
            return (
                solicitud.id_coach === coach.id &&
                solicitud.id_usuario === store.loggedInUser.id &&
                (solicitud.fecha_respuesta !== null || solicitud.estado === true)
            );
        });
        return hasValidProfile && !hasRequest; // Retornar solo aquellos que tienen un perfil válido y no tienen solicitudes pendientes ni aprobadas
    });

    return (
        <div className="container mt-5">
            {alertMessage && (
                <div className={`alert ${alertMessage.includes("éxitosamente") ? "alert-success" : "alert-danger"}`} role="alert">
                    {alertMessage}
                </div>
            )}
            <h1 className="text-center mb-4 text-light">Coachs Disponibles</h1>
            {isLoading ? (
                <p className="text-center text-light">Cargando datos...</p>
            ) : filteredCoaches && filteredCoaches.length > 0 ? (
                <div className="row">
                    {filteredCoaches.map((coach) => (
                        <div className="col-md-12 mb-4" key={coach.id}>
                            <div className="card text-light" style={{ width: "18rem", backgroundColor: "#333" }}>
                                <img
                                    src={coach.foto_coach || "https://i.pinimg.com/550x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg"}
                                    className="card-img-top"
                                    alt={coach.nombre_coach || "Imagen no disponible"}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{coach.nombre_coach}</h5>
                                    <p className="card-text">
                                        <strong>Género:</strong> {coach.genero_coach}
                                    </p>
                                    <p className="card-text">
                                        <strong>¿Quién soy?:</strong> {coach.descripcion_coach}
                                    </p>
                                    <p className="card-text">
                                        <strong>Dirección:</strong> {coach.direccion}
                                    </p>
                                    <button className="btn btn-primary" onClick={() => handleAddCoach(coach.id)}>
                                        Agregar Coach
                                    </button>
                                    <button className="btn btn-info mt-2" onClick={() => handleViewProfile(coach.id)}>
                                        Ver Perfil
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-light">No hay coaches disponibles.</p>
            )}
        </div>
    );
};

export default CoachCard;
