export async function getAllTasksByState(state) {
    try {
        const response = await fetch(`http://localhost:8080/getTasksByState?state=${state}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        return JSON.parse(data);
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function addTask(task){
    try {
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
        const data = await response.json();
        return JSON.parse(data);
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function deleteTask(id){
    try {
        const response = await fetch(`http://localhost:8080/deleteTask?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        return JSON.parse(data);
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function updateTask(task){
    try {
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
        const data = await response.json();
        return JSON.parse(data);
    } catch (e) {
        console.log(e);
        throw e;
    }
}