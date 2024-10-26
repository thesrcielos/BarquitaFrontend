import { React, useEffect, useState } from "react";
import { getUsers, deleteUser } from "./connectionBackend";
import "./AdminPanel.css";
import AdminMenu from "./AdminMenu";

const AdminPanel = () =>{
    const[users, setUsers] = useState([]);

    useEffect(()=>{
        const fetchUsers = async () =>{
            const usersDB = await getUsers();
            setUsers(usersDB);
        }
        fetchUsers();
    }, []);

    const handleUserDelete = async (id) => {
        await deleteUser(id);
        setUsers(users.filter((user)=> user.usernameId !== id));
    }
    const Users = () =>{
        return <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th className="actions">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <User key={user.usernameId} userInfo={user}/>
                        ))
                    ) : (
                        <tr>
                        <td>
                            No hay usuarios.
                        </td>
                        </tr>
                    )}
                    </tbody>
        </table>
    }

    const User = ({userInfo}) => {
        console.log("si");
        return <tr key={userInfo.usernameId}>
            <td>{userInfo.name}</td>
            <td>{userInfo.email}</td>
            <td><button onClick={() => handleUserDelete(userInfo.usernameId)}>🗑️</button></td>
        </tr>
    }

    return <div>
        <AdminMenu/>
        <h2>Lista de usuarios</h2>
        <Users/>
    </div>
}

export default AdminPanel;