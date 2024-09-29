import {getAllTasksByState, addTask, deleteTask, updateTask, updateTaskState} from './connectionBackend.js'
const tasks = await getAllTasksByState(false);
const tasksCompleted = await getAllTasksByState(true);

const containerTasks = document.querySelector(".container-tasks");
const containerTasksCompleted = document.querySelector(".container-tasks-completed");
const hideButtonNotCompletedTasks = document.querySelector(".hide-button-not-complete");
const hideButtonCompletedTasks = document.querySelector(".hide-button-complete");
const addTaskButton = document.querySelector(".add-task-button");
const orderByPriorityButton = document.querySelector(".order-by-priority-button");
const orderByDateButton = document.querySelector(".order-by-date-button");

hideButtonNotCompletedTasks.addEventListener("click", ()=>{
    containerTasks.classList.toggle("hide");
});

hideButtonCompletedTasks.addEventListener("click", ()=>{
    containerTasksCompleted.classList.toggle("hide");
});
tasks.forEach((task,index)=>{
    createTaskContainer(containerTasks,task,index);
});

tasksCompleted.forEach((task,index)=>{
    createTaskContainer(containerTasksCompleted,task,-1-1*index);
});

addTaskButton.addEventListener("click", ()=>{
    showAddTaskForm();
});

orderByDateButton.addEventListener("click",  ()=>{
    showDateFilter();
});

orderByPriorityButton.addEventListener("click", () => {
    showPriorityFilter();
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

    
    if(id < 0){
        completedButton.checked = true;
    }
    addEventDeleteButton(deleteButton,taskContainer);
    addEventListenerToCheckBox(completedButton,id);
    addEventListenerToEditButton(editButton,id);
    addEventListenerToTaskInfo(taskInfo,id);

    return taskContainer;
}

function addEventDeleteButton(deleteButton, taskContainer){
    deleteButton.addEventListener("click", async(event)=>{
        event.stopPropagation();  
        let id = deleteButton.classList[1].substring(10);
        let taskId = getTaskById(id).id;
        if(id>=0){
            containerTasks.removeChild(taskContainer);
        }else{
            containerTasksCompleted.removeChild(taskContainer);
        }
        await deleteTask(taskId);
    });
}
async function handleEventSubmitEditInfo(event){
    event.preventDefault();
    const form = event.target;  // Forms that triggers the event
    const formData = new FormData(form);
    const id = getIdFromURL();
    let task = getTaskById(id);

    task.name = formData.get('name');
    task.description = document.querySelector("#description").value;
    task.deadline = formData.get('deadline');
    task.priority = formData.get('priority').toUpperCase();

    await updateTask(task);

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
        event.stopPropagation();
        //Put ?edit=id in the url
        window.history.pushState({}, '', `?edit=${id}`);
        
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
    });
}

function addEventListenerToCheckBox(checkbox, id){
    checkbox.addEventListener("change",async (event)=>{
        event.stopPropagation();
        const container = document.querySelector(".visualize-task-info-container");
        container.style.display = "none";
        let taskId = getTaskById(id).id;
        await updateTaskState(taskId);
        location.reload(true);
    });
}
function createEditFormHTML(editInfoContainer) {
    let id = getIdFromURL();
    let task = getTaskById(id);
    editInfoContainer.innerHTML = `
        <div class="form-container">
            <button class="close-edit">✖️</button>
            <form id="editNameForm">
                <h2>Editar Tarea</h2>
                <label for="name">Nombre</label>
                <input type="text" id="name" name="name" placeholder="Ingrese su nombre" value="${task.name}" required>    
                <label for="description">Descripción</label>
                <textarea id="description" "name="description" rows="5" columns="40" required>${task.description}</textarea>
                <label for="deadline">Fecha y hora</label>
                <input type="datetime-local" id="deadline" name="deadline" required>
                <label for="prioridad">Prioridad</label>
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
    return id >= 0 ? tasks[id] : tasksCompleted[-1-1*id];
}

function createTaskHTML(taskContainer, task, id){
    taskContainer.innerHTML = `
    <button class="menu-btn menu-btn${id}">⋮</button>
    <div class="task-info task-info${id}">
        <p class="task-name${id}">${task.name}</p>
        <p class="task-date${id}">${dateFormat(task.deadline)}</p>
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
    taskDate.textContent = dateFormat(task.deadline);
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
                <p>Fecha límite: ${dateFormat(task.deadline)}</p>
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
        <div class="task-form">
            <button class="close-add-task">✖️</button>
            <h2>Nueva Tarea</h2>
            <label for="task-name">Nombre:</label>
            <input type="text" id="task-name" placeholder="Ingrese el nombre de la tarea" required>

            <label for="task-description">Descripción:</label>
            <textarea id="task-description" placeholder="Ingrese la descripción de la tarea" rows="4" required></textarea>

            <label for="deadline">Fecha y hora</label>
            <input type="datetime-local" id="task-deadline" name="deadline" required>

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

async function addNewTask(){
    const name = document.getElementById("task-name").value;
    const description = document.getElementById("task-description").value;
    const priority = document.getElementById("task-priority").value;
    const date = document.getElementById("task-deadline").value;
    const addTaskInformation = document.querySelector(".add-task-info-container");
    
    if (name && description && priority && date) {
        const newTask = {
            name: name,
            description: description,
            deadline: date,
            state: false,
            priority: priority.toUpperCase()
        };
        await addTask(newTask);
        tasks.push(newTask);
        const taskId = tasks.length - 1;
        createTaskContainer(containerTasks, newTask, taskId);

        // Limpiar el formulario
        addTaskInformation.innerHTML = '';
        addTaskInformation.classList.toggle("show");
    } else {
        alert("Por favor, rellene todos los campos.");
    }
}

function showDateFilter() {
    const dateFilterContainer = document.querySelector(".date-filter-container");
    dateFilterContainer.classList.add("show");

    // Cerrar el cuadro de fecha
    const closeButton = document.querySelector(".close-date-filter");
    closeButton.addEventListener("click", () => {
        dateFilterContainer.classList.remove("show");
    });

    // Filtrar tareas por la fecha seleccionada
    const filterByDateButton = document.getElementById("filter-by-date-button");
    filterByDateButton.addEventListener("click", () => {
        const selectedDate = document.getElementById("filter-date").value;
        filterTasksByDate(selectedDate);
        dateFilterContainer.classList.remove("show"); // Cerrar el cuadro después de filtrar
    });
}

function filterTasksByDate(selectedDate) {
    if (!selectedDate) {
        alert("Por favor, seleccione una fecha.");
        return;
    }
}

function showPriorityFilter() {
    const priorityFilterContainer = document.querySelector(".priority-filter-container");
    priorityFilterContainer.classList.add("show");

    // Cerrar el cuadro de selección de prioridad
    const closeButton = document.querySelector(".close-priority-filter");
    closeButton.addEventListener("click", () => {
        priorityFilterContainer.classList.remove("show");
    });

    // Aplicar el filtro de prioridad
    const applyPriorityFilterButton = document.getElementById("apply-priority-filter");
    applyPriorityFilterButton.addEventListener("click", () => {
        const selectedPriority = document.getElementById("filter-priority").value;
        if (selectedPriority) {    
            filterTasksByPriority(selectedPriority);
            changePriorityButtonColor(selectedPriority);
        }
        priorityFilterContainer.classList.remove("show"); // Cerrar el cuadro después de aplicar el filtro
    });
}

function filterTasksByPriority(selectedPriority) {
    const filteredTasks = tasks.filter(task => task.priority === selectedPriority);
}

function changePriorityButtonColor(priority) {
    // Remover las clases de color actuales
    orderByPriorityButton.classList.remove('alta', 'media', 'baja');
    // Agregar la clase correcta según la prioridad
    if (priority === "Alta") {
        orderByPriorityButton.classList.add('alta');
    } else if (priority === "Media") {
        orderByPriorityButton.classList.add('media');
    } else if (priority === "Baja") {
        orderByPriorityButton.classList.add('baja');
    } else {
        orderByPriorityButton.classList.add('normal');
        showAllTasks();
    }
}
