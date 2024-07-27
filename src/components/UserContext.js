import React, { createContext, useState } from 'react';
import axios from 'axios';
import { API_URL_LOG } from '../var';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (token) => {
    localStorage.setItem('token', token);
    axios.post(`${API_URL_LOG}verify`, { token })
      .then(response => {
        if (response.status === 200) {
          const { user_id, role } = response.data;
          setUser({ correo: user_id, role });
        } else {
          throw new Error("Invalid token");
        }
      })
      .catch(error => {
        console.error("Login error:", error);
        localStorage.removeItem('token');
        setUser(null); // Asegúrate de que el estado del usuario se limpie en caso de error
      });
  };

  const logout = (navigate) => {
    localStorage.removeItem('token');
    setUser(null);
    navigate("/login"); // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <UserContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
