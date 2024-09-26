const tasks = [
    {
        'name':"task 1",
        'description':"description task 1",
        'date':"date",
        'priority':"Baja"
    },
    {
        'name':"task2",
        'description':"description task 2",
        'date':"date",
        'priority':"Baja"
    },
    {
        'name':"task3",
        'description':"description task 3",
        'date':"date",
        'priority':"Baja"
    },
    {
        'name':"task4",
        'description':"description task 4",
        'date':"date",
        'priority':"Baja"
    },
    {
        'name':"task5",
        'description':"description task 5",
        'date':"date",
        'priority':"Baja"
    },
    {
        'name':"task6",
        'description':"description task 6",
        'date':"date",
        'priority':"Baja"
    }
];

const containerTasks = document.querySelector(".container-tasks");
const containerTasksCompleted = document.querySelector(".container-tasks-completed");
const hideButtonNotCompletedTasks = document.querySelector(".hide-button-not-complete");
const hideButtonCompletedTasks = document.querySelector(".hide-button-complete");
const addTaskButton = document.querySelector(".add-task-button");

hideButtonNotCompletedTasks.addEventListener("click", ()=>{
    containerTasks.classList.toggle("hide");
});

hideButtonCompletedTasks.addEventListener("click", ()=>{
    containerTasksCompleted.classList.toggle("hide");
});

tasks.forEach((task, index)=>{
    createTaskContainer(containerTasks,task, index);
});

addTaskButton.addEventListener("click", ()=>{
    showAddTaskForm();
});


function createTaskContainer(containerTasks,task, id){
    const taskContainer = document.createElement("div");
    taskContainer.classList.add(`task-container`);
    taskContainer.classList.add(`task-container${id}`);
    createTaskHTML(taskContainer, task, id);
    containerTasks.appendChild(taskContainer);

    const menuItemButton = document.querySelector(`.menu-btn${id}`);
    const dropdownContent = document.querySelector(`.dropdown-content${id}`);
    const editButton = document.querySelector(`.edit-btn${id}`);
    const deleteButton = document.querySelector(`.delete-btn${id}`); 
    const completedButton = document.querySelector(`.myCheckbox${id}`);
    const taskInfo = document.querySelector(`.task-info${id}`);

    menuItemButton.addEventListener("click",()=>{
        dropdownContent.classList.toggle("visible");
    });

    
    deleteButton.addEventListener("click", (event)=>{
        taskContainer.style.display = "none";
        containerTasks.removeChild(taskContainer);
        event.stopPropagation();
    });

    addEventListenerToCheckBox(completedButton,id);
    addEventListenerToEditButton(editButton,id);
    addEventListenerToTaskInfo(taskInfo,id);

    return taskContainer;
}

function handleEventSubmitEditInfo(event){
    event.preventDefault();
    const form = event.target;  // Forms that triggers the event
    const formData = new FormData(form);
    const id = getIdFromURL();
    let task = tasks[id];
    task.name = formData.get('name');
    task.description = document.querySelector("#description").value;
    task.date = dateFormat(formData.get('deadline'));
    task.priority = formData.get('priority');

    const taskName = document.querySelector(`.task-name${id}`);
    const editInfoContainer = document.querySelector(".edit-info-container");
    editInfoContainer.style.display = "none";

    //Delete ?edit=id of the url
    deleteEditFromUrl();
    editTaskInfo(id);
}

function deleteEditFromUrl(){
    let currentUrl = window.location.href; 
    let newUrl = currentUrl.split('?')[0];
    window.history.replaceState(null, '', newUrl);
}
function getIdFromURL(){
    const params = new URLSearchParams(window.location.search);
    return Number(params.get('edit')); 
}

function addEventListenerToEditButton(editButton, id){
    editButton.addEventListener("click", (event)=>{
        selectedButtonMenu = true;
        //Put ?edit=id in the url
        window.history.pushState({}, '', `?edit=${id}`);
        event.stopPropagation();
        
        //Make dropdown content invivible
        const dropdown = document.querySelector(`.dropdown-content${id}`);
        dropdown.classList.toggle("visible");

        const editInfoContainer = document.querySelector(".edit-info-container");
        editInfoContainer.style.display = "flex";
        createEditFormHTML(editInfoContainer);

        const closeButton = document.querySelector(".close-edit");
        closeButton.addEventListener("click", ()=>{
            editInfoContainer.style.display ="none";
            deleteEditFromUrl();
        });

        const editNameForm = document.querySelector("#editNameForm");
        editNameForm.addEventListener("submit",handleEventSubmitEditInfo);
        selectedButtonMenu = false;
    });
}

function addEventListenerToCheckBox(checkbox, id){
    checkbox.addEventListener("change",(event)=>{

        const container = document.querySelector(".visualize-task-info-container");
        container.style.display="none";
        const taskElement = document.querySelector(`.task-container${id}`);
        const dropdown = document.querySelector(`.dropdown-content${id}`);
        taskElement.classList.toggle("hide");
        if(checkbox.checked){
            containerTasks.removeChild(taskElement);
            containerTasksCompleted.appendChild(taskElement);
        }else{
            containerTasksCompleted.removeChild(taskElement);
            containerTasks.appendChild(taskElement);
        }
        taskElement.classList.toggle("hide");
        dropdown.classList.toggle("visible");
    }
    );
}
function createEditFormHTML(editInfoContainer) {
    let id = getIdFromURL();
    let task = getTaskById(id);
    editInfoContainer.innerHTML = `
        <div class="form-container">
            <h2>Editar Tarea</h2>
            <button class="close-edit">x</button>
            <form id="editNameForm">
                <label for="name"><b>Nombre</b></label>
                <input type="text" id="name" name="name" placeholder="Ingrese su nombre" value="${task.name}" required>    
                <label for="description"><b>Descripción</b></label>
                <textarea id="description" "name="description" rows="5" columns="40" required>${task.description}</textarea>
                <label for="deadline"><b>Fecha y hora</b></label>
                <input type="datetime-local" id="deadline" name="deadline" required>
                <label for="prioridad"><b>Prioridad</b></label>
                <select id="options" name="priority" required>
                    <option value="" disabled selected>Seleccionar</option>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                </select>
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    `;
}
function getTaskById(id){
    return tasks[id];
}

function createTaskHTML(taskContainer, task, id){
    taskContainer.innerHTML = `
    <button class="menu-btn menu-btn${id}">⋮</button>
    <div class="task-info task-info${id}">
        <p class="task-name${id}">${task.name}</p>
        <p class="task-date${id}">${task.date}</p>
        <p class="task-priority${id}">${task.priority}</p>
    <div/>
    <div class="dropdown-content dropdown-content${id}">
        <button class="edit-btn edit-btn${id}">✏️ Editar</button>
        <button class="delete-btn delete-btn${id}">🗑️ Eliminar</button>
        <label class="checkbox-button checkbox-button${id}">
            <input type="checkbox" class="myCheckbox myCheckbox${id}" name="myCheckbox" value="no">
            <span>Completada</span>
        </label>
    </div>     
`;
}

function editTaskInfo(id){
    let task = getTaskById(id);
    const taskName = document.querySelector(`.task-name${id}`);
    const taskDate = document.querySelector(`.task-date${id}`);
    const taskPriority = document.querySelector(`.task-priority${id}`);
    taskName.textContent = task.name;
    taskDate.textContent = task.date;
    taskPriority.textContent = task.priority;

}

function addEventListenerToTaskInfo(taskInfo,id){
    taskInfo.addEventListener("click", ()=>{
        let task = getTaskById(id);
        const container = document.querySelector(".visualize-task-info-container");
        container.style.display="flex";
        container.innerHTML = `
            <div class="visualize-task-info">
                <button class="close-visualize">x</button>
                <p>Nombre: ${task.name}</p>
                <p>Descripción: ${task.description}</p>
                <p>Fecha límite: ${task.date}</p>
                <p>Prioridad: ${task.priority}</p>
            </div>
        `;
        const closeButton = document.querySelector(".close-visualize");
        closeButton.addEventListener("click",()=>{
            container.style.display="none";
        });
    ;}
        
);
}

function dateFormat(date){
    let format = new Date(date);
    return `${format.getDate()}/${format.getMonth()+1}/${format.getFullYear()} 
            - ${hoursFormat(format.getHours().toString())}:${minuteFormat(format.getMinutes().toString())}`;
}

function minuteFormat(minutes){
    return minutes.length > 1 ? minutes : "0"+minutes;
}

function hoursFormat(hours){
    return hours.length > 1 ? hours : "0"+hours;
}

function showAddTaskForm() {
    const addTaskInformation = document.querySelector(".add-task-info-container"); 
    addTaskInformation.innerHTML = `
        <button class="close-add-task">✖️</button>
        <div class="task-form">
            <h2>Nueva Tarea</h2>
            <label for="task-name">Nombre:</label>
            <input type="text" id="task-name" placeholder="Ingrese el nombre de la tarea" required>

            <label for="task-description">Descripción:</label>
            <textarea id="task-description" placeholder="Ingrese la descripción de la tarea" rows="4" required></textarea>

            <label for="task-priority">Prioridad:</label>
            <select id="task-priority" required>
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
            </select>
            <button id="create-task-button">Crear</button>
        </div>
    `;

    // Mostrar el formulario
    addTaskInformation.classList.add("show");

    // Cerrar el formulario
    const closeButton = document.querySelector(".close-add-task");
    closeButton.addEventListener("click", () => {
        addTaskInformation.classList.remove("show");
    });

    const createTaskButton = document.getElementById("create-task-button");
    createTaskButton.addEventListener("click", addNewTask);
}

function addNewTask(){
    const name = document.getElementById("task-name").value;
    const description = document.getElementById("task-description").value;
    const priority = document.getElementById("task-priority").value;
    const date = new Date().toLocaleDateString();
    const addTaskInformation = document.querySelector(".add-task-info-container");
    
    if (name && description && priority) {
        const newTask = {
            name: name,
            description: description,
            date: date,
            priority: priority
        };
        
        tasks.push(newTask);
        const taskId = tasks.length - 1;
        createTaskContainer(containerTasks, newTask, taskId);

        // Limpiar el formulario
        addTaskInformation.innerHTML = '';
        addTaskInformation.classList.remove("show");
    } else {
        alert("Por favor, rellene todos los campos.");
    }
}