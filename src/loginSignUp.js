import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './loginSignUp.css';
import user_icon from './Assets/person.png'
import email_icon from './Assets/email.png'
import password_icon from './Assets/password.png'
import { useAuth } from './AuthenticationContext';

const LoginSignUp = ()  => {

    const {login, register, verifyAuth} = useAuth();
    const [action, setAction] = useState("Sign Up");
    const [submit, setSubmit] = useState("Crear Cuenta");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const navigateUser = useCallback((role) => {
        if(role === 'USER'){
            navigate('/tasks');
        }else if(role === 'ADMIN'){
            navigate('/admin');
        }
    }, [navigate]);

    useEffect(()=>{
        const verify = async() => {
            const res = await verifyAuth();
            if(res.authenticated){
                navigateUser(res.role);
            }
        }
        verify();
    }, [verifyAuth, navigateUser]);

    const selectLoginAction = () => {
        setAction("Login");
        setSubmit("Iniciar Sesión");
    }

    const selectSignUpAction = ()  => {
        setAction("Sign Up");
        setSubmit("Crear Cuenta");
    }

    const submitLoginInfo = async ()  => {
        let res = await login({ email, password });
        if(res.authenticated){
            navigateUser(res.role);
        }else{
            alert(res.error);
        }
    }

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%#*?&]{8,}$/;
        if (regex.test(password)) {
            return true;
        }
        return "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial (@$!%*?&). ";
    }

    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(regex.test(email)){
            return true;
        }
        return "La estructura del Email es incorrecta ";
    }

    const submitSignUpInfo = async () => {
        const validationPassword = validatePassword(password);
        const validationEmail = validateEmail(email);
        if(validationPassword === true && validationEmail === true){
            let res = await register({ name, email, password });
            if(res.created){
                navigateUser(res.role);
            }else{
                alert(res.error);
            }
        }
        if(validationPassword !== true){
            alert(validationPassword);
        }
        if(validationEmail !== true){
            alert(validationEmail);
        }
    }

    return (
        <div className='container-login-signup'>
        <div className="container">
            <div className='buttons-container'>
                <div className={action === "Login" ? "button gray" : "button"} onClick={()=>{selectSignUpAction()}}>Sign  Up</div>
                <div className={action === "Sign Up" ? "button gray" : "button"}  onClick={()=>{selectLoginAction()}}>Login</div>
            </div>
            <div className='header'>
                <div className='text'>{action}</div>
                <div className='underLine'></div>
            </div>
            <div className='inputs'>
                {action === "Login" ? <div></div> : 
                <div className='input'>
                    <img src={user_icon} alt=""/>
                    <input type="text" placeholder="Nombre" value={name}  onChange={(e)=>{setName(e.target.value)}}/>

                </div>}
                <div className='input'>
                    <img src={email_icon} alt=""/>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className='input'>
                    <img src={password_icon} alt=""/>
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
            </div>
            {action === "Sign Up" ? <div></div> : <div className='forgot-password'>Olvidó la Contraseña? <span>Clickee Aquí</span></div>}
            {submit === "Iniciar Sesión" && action === "Login" ? <div className='submit-button' onClick={()=>{submitLoginInfo()}}>{submit}</div> : 
            <div className='submit-button' onClick={()=>{submitSignUpInfo()}}>{submit}</div>}
        </div>
        </div>
    )
}

export default LoginSignUp;