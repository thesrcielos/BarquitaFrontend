import React, { useState } from 'react';
import './loginSignUp.css';

import user_icon from './Assets/person.png'
import email_icon from './Assets/email.png'
import password_icon from './Assets/password.png'

const LoginSignUp = ()  => {

    const [action, setAction] = useState("Sign Up");

    return (
        <div className="container">
            <div className='header'>
                <div className='text'>{action}</div>
                <div className='underLine'></div>
            </div>
            <div className='inputs'>
                {action === "Login" ? <div></div> : <div className='input'>
                    <img src={user_icon} alt=""/>
                    <input type="text" placeholder="Nombre"/>
                </div>}
                <div className='input'>
                    <img src={email_icon} alt=""/>
                    <input type="email" placeholder="Email"/>
                </div>
                <div className='input'>
                    <img src={password_icon} alt=""/>
                    <input type="password" placeholder="Contraseña"/>
                </div>
            </div>
            {action === "Sign Up" ? <div></div> : <div className='forgot-password'>Olvidó la Contraseña? <span>Clickee Aquí</span></div>}
            <div className='buttons-container'>
                <div className={action === "Login" ? "button gray" : "button"} onClick={()=>{setAction("Sign Up")}}>Sign  Up</div>
                <div className={action === "Sign Up" ? "button gray" : "button"}  onClick={()=>{setAction("Login")}}>Login</div>
            </div>
        </div>
    )
}

export default LoginSignUp;