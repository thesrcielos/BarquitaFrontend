const API_URL = 'https://taskmanagement-h3h6aeggbtbwdvfs.brazilsouth-01.azurewebsites.net/';

/**
 * Fetches all tasks by their state from the server.
 * 
 * @param {string} state - The state of the tasks to be retrieved (e.g., "completed", "pending").
 * @returns {Promise<Object[]>} - A promise that resolves to an array of task objects.
 * @throws {Error} - Throws an error if the network response is not ok.
 */
export async function getAllTasksByState(userId, state) {
    verifyTokenExists();
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${userId}/getTasksByState?state=${state}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    verifyIfTokenHasExpired(response);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Adds a new task to the server.
 * 
 * @param {Object} task - The task object to be added. It should contain the relevant task properties.
 * @returns {Promise<Object>} - A promise that resolves to the added task object.
 * @throws {Error} - Throws an error if the network response is not ok.
 */
export async function addTask(userId, task){
    verifyTokenExists();
    const token = localStorage.getItem('token');
    console.log(token);
    const response = await fetch(`${API_URL}/${userId}/addTask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(task)
    });
    verifyIfTokenHasExpired(response);
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
    return await response.json();
}

/**
 * Deletes a task from the server by its ID.
 * 
 * @param {number} id - The ID of the task to be deleted.
 * @returns {Promise<Object>} - A promise that resolves to the response object.
 * @throws {Error} - Throws an error if the network response is not ok.
 */
export async function deleteTask(userId, id){
    verifyTokenExists();
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${userId}/deleteTask?id=${id}`, {
        method: 'DELETE',
        headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
    });
    verifyIfTokenHasExpired(response);
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
}

/**
 * Updates an existing task on the server.
 * 
 * @param {Object} task - The updated task object containing the changes.
 * @returns {Promise<void>} - A promise that resolves when the task is updated.
 * @throws {Error} - Logs and throws any encountered errors.
 */
export async function updateTask(userId, task){
    verifyTokenExists();
    const token = localStorage.getItem('token');
    console.log(task);
    const response = await fetch(`${API_URL}/${userId}/updateTask`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(task)
    });
    verifyIfTokenHasExpired(response);
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
}

/**
 * Updates the state of a task on the server by its ID.
 * 
 * @param {number} id - The ID of the task whose state is to be updated.
 * @returns {Promise<void>} - A promise that resolves when the task's state is updated.
 * @throws {Error} - Logs any encountered errors.
 */
export async function updateTaskState(userId, id){
    const token = localStorage.getItem('token');
    verifyTokenExists();
    const response = await fetch(`${API_URL}/${userId}/changeStateTask?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    verifyIfTokenHasExpired(response);
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
}

export async function getHistogram(userId){
    const token = localStorage.getItem('token');
    verifyTokenExists();
    const response = await fetch(`${API_URL}/Analytics/getHistogram?userId=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    verifyIfTokenHasExpired(response);
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }

    return await response.json();
}

export async function getFinishedTasksByTime(userId){
    const token = localStorage.getItem('token');
    verifyTokenExists();
    const response = await fetch(`${API_URL}/Analytics/getFinishedTasks?userId=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    verifyIfTokenHasExpired(response);
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
    return await response.json();
}

export async function getAverageByPriority(userId){
    const token = localStorage.getItem('token');
    verifyTokenExists();
    const response = await fetch(`${API_URL}/Analytics/getAverageByPriority?userId=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    verifyIfTokenHasExpired(response);
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
    return await response.json();
}

export async function getTotalTimeSpentByDifficulty(userId){
    const token = localStorage.getItem('token');
    verifyTokenExists();
    const response = await fetch(`${API_URL}/Analytics/getTotalTimeSpentByDifficulty?userId=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    verifyIfTokenHasExpired(response);
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
    return await response.json();
}

export async function loginUser(userCredentials) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userCredentials)
    });
    return response;
}

export async function registerUser(user) {
    const response = await fetch(`${API_URL}/createUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });
    return response;
}

export async function getUserIdFromEmail(email) {
    const token = localStorage.getItem('token');
    verifyTokenExists();
    const response = await fetch(`${API_URL}/getUserId?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
    });
    verifyIfTokenHasExpired(response);
    return await response.json();
}

const verifyIfTokenHasExpired = (response) => {
    if(response.status === 403){
        localStorage.removeItem('token');
        alert("Sesión expirada, por favor inicia sesión nuevamente");
        window.location.href = '/loginSignUp';
    }
}

const verifyTokenExists = () => {
    let token = localStorage.getItem('token');
    if(!token){
        alert("Sesión expirada, por favor inicia sesión nuevamente");
        window.location.href = '/loginSignUp';
    }
}