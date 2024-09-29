// Importa las funciones necesarias para manejar tareas desde el backend
import {getAllTasksByState, addTask, deleteTask, updateTask, updateTaskState} from './connectionBackend.js'

// Obtiene las tareas no completadas y completadas desde el backend
let tasks = await getAllTasksByState(false);
let taskCompleted = await getAllTasksByState(true);

// Referencias a elementos del DOM
const containerTasks = document.querySelector(".container-tasks");
const containerTasksCompleted = document.querySelector(".container-tasks-completed");
const hideButtonNotCompletedTasks = document.querySelector(".hide-button-not-complete");
const hideButtonCompletedTasks = document.querySelector(".hide-button-complete");
const addTaskButton = document.querySelector(".add-task-button");
const orderByPriorityButton = document.querySelector(".order-by-priority-button");
const orderByDateButton = document.querySelector(".order-by-date-button");

// Oculta o muestra las tareas no completadas al hacer clic en el botón correspondiente
hideButtonNotCompletedTasks.addEventListener("click", ()=>{
    containerTasks.classList.toggle("hide");
});

// Oculta o muestra las tareas completadas al hacer clic en el botón correspondiente
hideButtonCompletedTasks.addEventListener("click", ()=>{
    containerTasksCompleted.classList.toggle("hide");
});

// Crea los contenedores de tareas no completadas
tasks.forEach((task, index)=>{
    createTaskContainer(containerTasks,task, index);
});

// Crea los contenedores de tareas completadas
taskCompleted.forEach((task, index)=>{
    createTaskContainer(containerTasksCompleted, task, -1*index-1);
})

// Muestra el formulario para agregar una nueva tarea al hacer clic en el botón correspondiente
addTaskButton.addEventListener("click", ()=>{
    showAddTaskForm();
});

// Muestra el filtro por fecha al hacer clic en el botón de ordenar por fecha
orderByDateButton.addEventListener("click",  ()=>{
    showDateFilter();
});

// Muestra el filtro por prioridad al hacer clic en el botón de ordenar por prioridad
orderByPriorityButton.addEventListener("click", () => {
    showPriorityFilter();
});

// Función que crea el contenedor para cada tarea
function createTaskContainer(containerTasks, task, id){
    const taskContainer = document.createElement("div"); // Crea un div para la tarea
    taskContainer.classList.add(`task-container`);
    taskContainer.classList.add(`task-container${id}`);
    createTaskHTML(taskContainer, task, id);  // Agrega el contenido HTML de la tarea
    containerTasks.appendChild(taskContainer);  // Añade la tarea al contenedor de tareas

    // Referencias a los botones y elementos interactivos dentro de la tarea
    const menuItemButton = document.querySelector(`.menu-btn${id}`);
    const dropdownContent = document.querySelector(`.dropdown-content${id}`);
    const editButton = document.querySelector(`.edit-btn${id}`);
    const deleteButton = document.querySelector(`.delete-btn${id}`); 
    const completedButton = document.querySelector(`.myCheckbox${id}`);
    const taskInfo = document.querySelector(`.task-info${id}`)

    // Evento para mostrar el menú de opciones de la tarea
    menuItemButton.addEventListener("click",()=>{
        dropdownContent.classList.toggle("visible");
    });

    // Evento para eliminar la tarea al hacer clic en el botón eliminar
    deleteButton.addEventListener("click", async (event)=>{
        event.stopPropagation();
        taskContainer.style.display = "none";
        containerTasks.removeChild(taskContainer);
        let id = deleteButton.classList[1].substring(10);
        let taskId = getTaskId(id);
        await deleteTask(taskId);
    });

    // Añade eventos a la casilla de completado, botón de edición, y la información de la tarea
    addEventListenerToCheckBox(completedButton,id);
    addEventListenerToEditButton(editButton,id);
    addEventListenerToTaskInfo(taskInfo,id);

    return taskContainer;  // Retorna el contenedor de la tarea
}

// Evento que maneja el envío del formulario de edición de la tarea
async function handleEventSubmitEditInfo(event){
    event.preventDefault();
    const form = event.target;  // Formulario que desencadena el evento
    const formData = new FormData(form);  // Obtiene los datos del formulario
    const id = getIdFromURL();  // Obtiene el ID de la tarea desde la URL
    let task = tasks[id];  // Obtiene la tarea correspondiente al ID
    task.name = formData.get('name');  // Actualiza el nombre de la tarea
    task.description = document.querySelector("#description").value;  // Actualiza la descripción
    task.deadline = formData.get('deadline');  // Actualiza la fecha límite
    task.priority = formData.get('priority').toUpperCase();  // Actualiza la prioridad
    await updateTask(task);  // Llama a la función de actualización de la tarea en el backend
    deleteEditFromUrl();  // Elimina el parámetro de edición de la URL
    location.reload(true);  // Recarga la página para reflejar los cambios

    editTaskInfo(id);  // Edita la información de la tarea en la interfaz
}

// Elimina el parámetro de edición de la URL
function deleteEditFromUrl(){
    let currentUrl = window.location.href;
    let newUrl = currentUrl.split('?')[0];  // Separa la URL por el parámetro de edición
    window.history.replaceState(null, '', newUrl);  // Reemplaza la URL con la nueva sin el parámetro
}

// Obtiene el ID de la tarea desde la URL
function getIdFromURL(){
    const params = new URLSearchParams(window.location.search);
    return Number(params.get('edit'));  // Retorna el ID en formato numérico
}

// Añade un evento al botón de edición de la tarea
function addEventListenerToEditButton(editButton, id){
    editButton.addEventListener("click", (event)=>{
        event.stopPropagation();
        window.history.pushState({}, '', `?edit=${id}`);  // Agrega el parámetro de edición a la URL
        event.stopPropagation();
        
        // Oculta el contenido del menú desplegable
        const dropdown = document.querySelector(`.dropdown-content${id}`);
        dropdown.classList.toggle("visible");

        // Muestra el formulario de edición
        const editInfoContainer = document.querySelector(".edit-info-container");
        editInfoContainer.style.display = "flex";
        createEditFormHTML(editInfoContainer);

        // Cierra el formulario de edición al hacer clic en el botón de cerrar
        const closeButton = document.querySelector(".close-edit");
        closeButton.addEventListener("click", ()=>{
            editInfoContainer.style.display ="none";
            deleteEditFromUrl();
        });

        // Añade un evento al formulario de edición para manejar el envío
        const editNameForm = document.querySelector("#editNameForm");
        editNameForm.addEventListener("submit",handleEventSubmitEditInfo);
    });
}

// Añade un evento a la casilla de verificación para marcar una tarea como completada
function addEventListenerToCheckBox(checkbox, id){
    checkbox.addEventListener("change",async (event) => {
            let taskId = getTaskId(id);
            await updateTaskState(taskId);
            location.reload(true);
            const container = document.querySelector(".visualize-task-info-container");
            container.style.display = "none";
            const taskElement = document.querySelector(`.task-container${id}`);
            const dropdown = document.querySelector(`.dropdown-content${id}`);
            taskElement.classList.toggle("hide");
            if (checkbox.checked) {
                containerTasks.removeChild(taskElement);
                containerTasksCompleted.appendChild(taskElement);
            } else {
                containerTasksCompleted.removeChild(taskElement);
                containerTasks.appendChild(taskElement);
            }
            taskElement.classList.toggle("hide");
            dropdown.classList.toggle("visible");
        }
    );
}


// Obtiene una tarea por su ID
function getTaskId(id){
    if (id < 0) {
       return taskCompleted[-1 - 1 * id].id;
    }
    return tasks[id].id;
}
// Crea el formulario HTML para editar una tarea
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

// Función que obtiene el id de una tarea
function getTaskById(id){
    return tasks[id];
}

// Función que crea el HTML de una tarea específica
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

// Función para editar la información de una tarea con un ID específico
function editTaskInfo(id){
    let task = getTaskById(id);
    const taskName = document.querySelector(`.task-name${id}`);
    const taskDate = document.querySelector(`.task-date${id}`);
    const taskPriority = document.querySelector(`.task-priority${id}`);
    taskName.textContent = task.name;
    taskDate.textContent = task.date;
    taskPriority.textContent = task.priority;
}

// Función para agregar un evento de clic en el contenedor de la tarea
function addEventListenerToTaskInfo(taskInfo, id) {
    taskInfo.addEventListener("click", ()=>{
        let task = getTaskById(id);
        const container = document.querySelector(".visualize-task-info-container");
        container.style.display="flex";

        // Genera el HTML para visualizar los detalles de la tarea
        container.innerHTML = `
            <div class="visualize-task-info">
                <button class="close-visualize">x</button>
                <p>Nombre: ${task.name}</p>
                <p>Descripción: ${task.description}</p>
                <p>Fecha límite: ${task.date}</p>
                <p>Prioridad: ${task.priority}</p>
            </div>
        `;
        
        // Agrega evento para cerrar el modal de visualización de la tarea
        const closeButton = document.querySelector(".close-visualize");
        closeButton.addEventListener("click",()=>{
            container.style.display="none";
        });
    });
}

// Función para formatear la fecha en formato día/mes/año - horas:minutos
function dateFormat(date){
    let format = new Date(date);
    return `${format.getDate()}/${format.getMonth()+1}/${format.getFullYear()} 
            - ${hoursFormat(format.getHours().toString())}:${minuteFormat(format.getMinutes().toString())}`;
}

// Función para formatear los minutos a dos dígitos
function minuteFormat(minutes){
    return minutes.length > 1 ? minutes : "0"+minutes;
}

// Función para formatear las horas a dos dígitos
function hoursFormat(hours){
    return hours.length > 1 ? hours : "0"+hours;
}


// Muestra el formulario para agregar una nueva tarea
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

// Función que crea la nueva tarea, valida los datos y la agrega  a la lista
async function addNewTask(){
    const name = document.getElementById("task-name").value;
    const description = document.getElementById("task-description").value;
    const priority = document.getElementById("task-priority").value;
    const date = document.getElementById("task-deadline").value;
    const addTaskInformation = document.querySelector(".add-task-info-container");
    
    if (name && description && priority && date) {
        console.log(date)
        const newTask = {
            name: name,
            description: description,
            deadline: date,
            state: false,
            priority: priority.toUpperCase()
        };
        await addTask(newTask);
        const taskId = tasks.length - 1;

        createTaskContainer(containerTasks, newTask, taskId);

        // Limpiar el formulario
        addTaskInformation.innerHTML = '';
        addTaskInformation.classList.toggle("show");
    } else {
        alert("Por favor, rellene todos los campos.");
    }
}

// Muestra el filtro de fecha para ordenar las tareas
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

// Verificar el campo de fecha sea correctamente lleno
function filterTasksByDate(selectedDate) {
    if (!selectedDate) {
        alert("Por favor, seleccione una fecha.");
        return;
    }
}

// Muestra el cuadro de selección de filtro por prioridad
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


// Filtra las tareas según la prioridad seleccionada
function filterTasksByPriority(selectedPriority) {
    const filteredTasks = tasks.filter(task => task.priority === selectedPriority);
}

// Cambia el color del botón de filtro de prioridad según la prioridad seleccionada
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

// Muestra todas las tareas sin aplicar filtros
function showAllTasks() {
    // Mostrar todas las tareas sin filtro
    containerTasks.innerHTML = ''; // Limpiar las tareas actuales

    tasks.forEach((task, index) => {
        createTaskContainer(containerTasks, task, index);
    });
}
