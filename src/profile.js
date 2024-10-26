import React from 'react';
import "./profile.css";

function UserProfile({ user, onClose, onDelete }) {
  return (
    <div style={styles.container}>
      <h2>Perfil de Usuario</h2>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Correo:</strong> {user.email}</p>
      <div style={styles.buttonContainer}>
        <button onClick={onClose} style={styles.button}>
          Cerrar Perfil
        </button>
        <button onClick={onDelete} style={{ ...styles.button, backgroundColor: 'red' }}>
          Eliminar Usuario
        </button>
      </div>
    </div>
  );
}

export default UserProfile;