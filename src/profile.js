import React, { useEffect, useState } from 'react';
import "./profile.css";
import { useAuth } from './AuthenticationContext';
import { changeUserName, changeUserPassword } from './connectionBackend';
import AdminMenu from './AdminMenu';
import Home from './home';

const UserProfile = () => {
  const{getUserInfo, updateUser} = useAuth();
  const[userId, setUserId] = useState('');
  const[userName, setUserName] = useState('');
  const[userEmail, setUserEmail] = useState('');
  const[userPassword, setUserPassword] = useState('');
  const[isEditingProfile, setIsEditingProfile] = useState(false);
  const [userConfirmPassword, setUserConfirmPassword] = useState('');
  const [role, setRole] = useState('');

  useEffect(()=>{
    const userInfo = getUserInfo();
    setUserId(userInfo.usernameId);
    setUserName(userInfo.name);
    setUserEmail(userInfo.email);
    setRole(userInfo.role);
  }, [getUserInfo]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{8,}$/;
    if (regex.test(password)) {
      return true;
    }
    return "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial (@$!%*?&). ";
  }
  
  const handleSave = async () => {
    const isValidPassword = validatePassword(userPassword)
    if (isValidPassword === true){
      if (userPassword === userConfirmPassword) {
        await changeUserName(userId, userName);
        await changeUserPassword(userId, userPassword);
        updateUser();
        setUserPassword('');
        setIsEditingProfile(false);
      }
      else {
        const userInfo = getUserInfo();
        setUserName(userInfo.name);
        alert("La contraseña no coincide");
      }
    }
    else{
      const userInfo = getUserInfo();
      setUserName(userInfo.name);
      alert(isValidPassword);
    }
  
  }

  return <div className="user-info">
            {role === "ADMIN" && (<AdminMenu/>)}
            {role === "USER" && (<Home/>)}
            {isEditingProfile === true && (
                <div className='profile-container'>
                  <div className="form-group">
                    <label htmlFor="userName">Nombre:</label>
                    <input
                        id="userName"
                        type="text"
                        placeholder="Nombre"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="userPassword">Contraseña:</label>
                    <input
                        id="userPassword"
                        type="password"
                        placeholder="Contraseña"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirmar Contraseña"
                        value={userConfirmPassword}
                        onChange={(e) => setUserConfirmPassword(e.target.value)}
                        className="input-field"
                    />
                  </div>

                  <button onClick={handleSave} className="button-save">Guardar</button>
                  <button onClick={() => setIsEditingProfile(false)} className="button-close-edit-profile">Cerrar
                  </button>
                </div>
            )}
            {isEditingProfile === false && (
                <div className='profile-container'>
                  <p><strong>Nombre:</strong> {userName}</p>
                  <p><strong>Correo:</strong> {userEmail}</p>
                  <button onClick={() => setIsEditingProfile(true)} className="edit-user-information-button">Editar
                  </button>
                </div>
            )}
          </div>
}

export default UserProfile;