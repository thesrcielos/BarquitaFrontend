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


