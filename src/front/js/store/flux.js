const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            smokers: [],
            tiposConsumo: [],
            coaches: [],
            loggedInUser: null,
            seguimiento: [],
            solicitud: []
        },
        actions: {
            getSmokers: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smokers`);
                    const data = await response.json();
                    setStore({ smokers: data });
                } catch (error) {
                    console.error("Error fetching smokers:", error);
                }
            },

            createSmoker: async (smokerData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smokers`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(smokerData),
                    });

                    if (response.ok) {
                        const newSmoker = await response.json();
                        setStore({ smokers: [...getStore().smokers, newSmoker] }); // Añadimos el nuevo fumador a la lista
                    }
                } catch (error) {
                    console.error("Error creating smoker:", error);
                }
            },

            updateSmoker: async (smokerId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smokers/${smokerId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedData),
                    });

                    if (response.ok) {
                        const updatedSmoker = await response.json();
                        const smokers = getStore().smokers.map(smoker =>
                            smoker.id === smokerId ? updatedSmoker : smoker
                        );
                        setStore({ smokers }); // Actualizamos la lista de fumadores
                    }
                } catch (error) {
                    console.error("Error updating smoker:", error);
                }
            },

            deleteSmoker: async (smokerId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smokers/${smokerId}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        const smokers = getStore().smokers.filter(smoker => smoker.id !== smokerId);
                        setStore({ smokers }); // Actualizamos la lista de fumadores
                    }
                } catch (error) {
                    console.error("Error deleting smoker:", error);
                }
            },

            signupSmoker: async (smokerData) => {
                try {
                    // Primer paso: crear el nuevo usuario
                    const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(smokerData),
                    });
            
                    if (response.ok) {
                        const newSmoker = await response.json();
                        setStore({ smokers: [...getStore().smokers, newSmoker] });
                        localStorage.setItem("token", newSmoker.token);  // Guarda el token si es parte de la respuesta
                        
                        // Segundo paso: crear el seguimiento (si es necesario)
                        const seguimientoData = {
                            cantidad: smokerData.cantidad,  // Asegúrate de que estos datos están en smokerData
                            id_usuario: newSmoker.id,  // ID del nuevo usuario
                            id_tipo: smokerData.id_tipo,  // Asegúrate de que este dato está en smokerData
                        };
            
                        const seguimientoResponse = await fetch(`${process.env.BACKEND_URL}/api/seguimiento`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(seguimientoData),
                        });
            
                        if (!seguimientoResponse.ok) {
                            const errorData = await seguimientoResponse.json();
                            console.error("Error al registrar seguimiento:", errorData);
                        }
            
                        return true;  // Registro y seguimiento exitosos
                    } else {
                        const errorData = await response.json();
                        console.error("Error en la respuesta del servidor:", errorData);
                        return false;
                    }
                } catch (error) {
                    console.error("Error durante el registro del fumador:", error);
                    return false;
                }
            },
            
            
            loginSmoker: async (smokerData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(smokerData),
                    });
            
                    if (response.ok) {
                        const data = await response.json();
                        setStore({
                            isAuthenticated: true,
                            userId: data.id,
                            nombreUsuario: data.nombre_usuario,
                            numerocigarro_usuario: data.numerocigarro_usuario,
                            periodicidad: data.periodicidad,
                            tipo_consumo: data.tipo_consumo,
                            fotoUsuario: data.foto_usuario,
                        });
                        localStorage.setItem("token", data.token);
                        return true;
                    } else {
                        return false;
                    }
                } catch (error) {
                    console.error("Error during login:", error);
                    return false;
                }
            },
            
            

            getConsuming: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/tiposconsumo`);
                    const data = await response.json();
                    setStore({ tiposConsumo: data });
                } catch (error) {
                    console.error("Error fetching tiposconsumo:", error);
                }
            },

            createConsuming: async (consumingData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/tiposconsumo`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(consumingData),
                    });

                    if (response.ok) {
                        const newConsuming = await response.json();
                        setStore({ tiposConsumo: [...getStore().tiposConsumo, newConsuming] });
                    }
                } catch (error) {
                    console.error("Error creating consuming:", error);
                }
            },

            updateConsuming: async (consumingId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/tiposconsumo/${consumingId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedData),
                    });

                    if (response.ok) {
                        const updatedConsuming = await response.json();
                        const updatedTiposConsumo = getStore().tiposConsumo.map(consuming =>
                            consuming.id === consumingId ? updatedConsuming : consuming
                        );
                        setStore({ tiposConsumo: updatedTiposConsumo });
                    }
                } catch (error) {
                    console.error("Error updating consuming:", error);
                }
            },

            deleteConsuming: async (consumingId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/tiposconsumo/${consumingId}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        const updatedTiposConsumo = getStore().tiposConsumo.filter(consuming => consuming.id !== consumingId);
                        setStore({ tiposConsumo: updatedTiposConsumo });
                    }
                } catch (error) {
                    console.error("Error deleting consuming:", error);
                }
            },

                        //SEGUIMIENTO Y SOLICITUDES DE JOSE

            getFollowing: async (userId) => {
                try {
                    const response = await fetch(`${API_URL}/seguimiento?user_id=${userId}`);
                     if (!response.ok) {
                         throw new Error('Network response was not ok');
                     }
                    const data = await response.json();
                    console.log("Datos obtenidos:", data);
                    setStore({ seguimiento: data });
                } catch (error) {
                    console.error("Error en la solicitud de seguimientos:", error);
                }
            },
                        
            createFollowing: async (followingData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/seguimiento`, {
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json",
                        },
                                body: JSON.stringify(followingData),
                         });
                        
                        if (!response.ok) {
                            const errorText = await response.text();
                            throw new Error(`Error creating seguimiento: ${errorText}`);
                        }
                        
                    const newFollowing = await response.json();
                        setStore((prevStore) => ({
                            seguimiento: [...prevStore.seguimiento, newFollowing], 
                            }));
                        } catch (error) {
                            console.error("Error creating seguimiento:", error);
                        }
            },

            addSolicitud: async (solicitudData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/solicitudes`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(solicitudData),
                    });
            
                    if (response.ok) {
                        const newSolicitud = await response.json();
                        // Asegúrate de que getStore().solicitudes está definido
                        setStore({ solicitud: [...(getStore().solicitud || []), newSolicitud] });
                        return true; 
                    } else {
                        const errorData = await response.json();
                        console.error("Error al agregar solicitud:", errorData);
                        return false;  // Manejo del error
                    }
                } catch (error) {
                    console.error("Error durante la solicitud:", error);
                    return false;  // Manejo del error
                }
            },
            


                        
            getAllCoaches: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
            
                    if (response.ok) {
                        const coaches = await response.json();
                        setStore({
                            coaches: coaches,  
                        });
                    } else {
                        const errorText = await response.text();
                        throw new Error(`Error fetching coaches: ${errorText}`);
                    }
                } catch (error) {
                    console.error("Error fetching all coaches:", error);
                }
            },

            getCoach: async (coachId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/${coachId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
            
                    if (response.ok) {
                        const coach = await response.json();
                        setStore({
                            selectedCoach: coach,  // Puedes guardar el coach seleccionado en el store
                        });
                        return coach;
                    } else {
                        const errorText = await response.text();
                        throw new Error(`Error fetching coach: ${errorText}`);
                    }
                } catch (error) {
                    console.error("Error fetching coach:", error);
                }
            },
            
            // Crear un nuevo coach
            createCoach: async (coachData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(coachData),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Error creating coach: ${errorText}`);
                    }

                    const newCoach = await response.json();
                    setStore((prevStore) => ({
                        coaches: [...prevStore.coaches, newCoach], // Agregar el nuevo coach al estado
                    }));
                } catch (error) {
                    console.error("Error creating coach:", error);
                }
            },

            // Actualizar un coach existente
            updateCoach: async (coachId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/${coachId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedData),
                    });
            
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Error updating coach: ${errorText}`);
                    }
            
                    const updatedCoach = await response.json();
                    setStore((prevStore) => ({
                        coaches: prevStore.coaches.map(coach =>
                            coach.id === coachId ? updatedCoach : coach
                        ),
                    }));
                    
                    // Aquí puedes agregar una notificación o un estado de éxito
                    return updatedCoach; // Retorna el coach actualizado si es necesario
                } catch (error) {
                    console.error("Error updating coach:", error);
                    throw error; // Lanza el error para manejarlo en el componente
                }
            },
            
            // Eliminar un coach
            deleteCoach: async (coachId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/${coachId}`, {
                        method: "DELETE",
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Error deleting coach: ${errorText}`);
                    }

                    setStore((prevStore) => ({
                        coaches: prevStore.coaches.filter(coach => coach.id !== coachId),
                    }));
                } catch (error) {
                    console.error("Error deleting coach:", error);
                }
            },
                        //SIGNUP Y LOGIN DE BEA
           // Método para registrar un nuevo coach
           signupCoach: async (coachData, imageFile) => {
                try {
                    // Subir la imagen y obtener la URL
                    const imageUrl = await getActions().uploadCoachImage(imageFile);

                    if (imageUrl) {
                    // Agregar la URL de la imagen a coachData
                        const dataWithImage = { ...coachData, foto_coach: imageUrl };

                        const response = await fetch(`${process.env.BACKEND_URL}/api/signup-coach`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(dataWithImage),
                        });

                    if (response.ok) {
                        const newCoach = await response.json();
                        setStore({ coaches: [...getStore().coaches, newCoach] });
                        localStorage.setItem("token", newCoach.token); // Guarda el token si es parte de la respuesta
                        return true;
                    } else {
                        const errorData = await response.json();
                        console.error("Error en la respuesta del servidor:", errorData);
                        return false;
                    }
                    } else {
                        console.error("No se pudo subir la imagen");
                        return false;
                    }
                } catch (error) {
                    console.error("Error durante el registro del coach:", error);
                    return false;
                }
            },
            
            //login coach
            loginCoach: async (coachData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login-coach`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(coachData),
                    });
            
                    if (response.ok) {
                        const data = await response.json();
                        setStore({
                            isAuthenticated: true,
                            coachId: data.coach_id,
                            nombre_coach: data.nombre_coach, // Nuevo campo
                            genero_coach: data.genero_coach, // Nuevo campo
                            foto_coach: data.foto_coach, // Nuevo campo
                        });
                        localStorage.setItem("token", data.token); // Guarda el token en localStorage
                        return true; // Indica que el login fue exitoso
                    } else {
                        const errorData = await response.json();
                        console.error("Error en el login del coach:", errorData);
                        return false; // Indica que el login falló
                    }
                } catch (error) {
                    console.error("Error durante el login del coach:", error);
                    return false; // Indica que hubo un error durante el proceso
                }
            },  
              // Método para subir la imagen del coach a Cloudinary
            uploadCoachImage: async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "your_upload_preset"); // Reemplaza con tu preset de subida

                try {
                    const response = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error("Error al subir la imagen");
                    }

                    const data = await response.json();
                    return data.secure_url; // Retorna la URL de la imagen subida
                } catch (error) {
                    console.error("Error uploading image:", error);
                    return null; // Retorna null si hay un error
                }
                
            },
            // Método para subir la imagen del smoker a Cloudinary
            uploadSmokerImage: async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "your_upload_preset"); // Reemplaza con tu preset de subida

                try {
                    const response = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error("Error al subir la imagen");
                    }

                    const data = await response.json();
                    return data.secure_url; // Retorna la URL de la imagen subida
                } catch (error) {
                    console.error("Error uploading image:", error);
                    return null; // Retorna null si hay un error
                }
            },
        },
    };
};

export default getState;

