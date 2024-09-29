/**
 * Fetches all tasks by their state from the server.
 * 
 * @param {string} state - The state of the tasks to be retrieved (e.g., "completed", "pending").
 * @returns {Promise<Object[]>} - A promise that resolves to an array of task objects.
 * @throws {Error} - Throws an error if the network response is not ok.
 */
export async function getAllTasksByState(state) {
    const response = await fetch(`http://localhost:8080/getTasksByState?state=${state}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
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
export async function addTask(task){
    const response = await fetch(`http://localhost:8080/addTask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    });
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
}

/**
 * Deletes a task from the server by its ID.
 * 
 * @param {number} id - The ID of the task to be deleted.
 * @returns {Promise<Object>} - A promise that resolves to the response object.
 * @throws {Error} - Throws an error if the network response is not ok.
 */
export async function deleteTask(id){
    const response = await fetch(`http://localhost:8080/deleteTask?id=${id}`, {
        method: 'DELETE',
        headers: {
                'Content-Type': 'application/json',
            }
    });
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
export async function updateTask(task){
    const response = await fetch(`http://localhost:8080/updateTask`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    });
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
export async function updateTaskState(id){
    const response = await fetch(`http://localhost:8080/changeStateTask?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
}
