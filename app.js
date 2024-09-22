const tasks = [
    {
        'name':"task 1"
    },
    {
        'name':"task2"
    },
    {
        'name':"task3"
    },
    {
        'name':"task4"
    },
    {
        'name':"task5"
    },
    {
        'name':"task6"
    }
]
const containerTasks = document.querySelector(".container-tasks");
const containerTasksCompleted = document.querySelector(".container-tasks-completed");
const hideButtonNotCompletedTasks = document.querySelector(".hide-button-not-complete");
const hideButtonCompletedTasks = document.querySelector(".hide-button-complete");

hideButtonNotCompletedTasks.addEventListener("click", ()=>{
    containerTasks.classList.toggle("hide");
});

hideButtonCompletedTasks.addEventListener("click", ()=>{
    containerTasksCompleted.classList.toggle("hide");
});

tasks.forEach((task, index)=>{
    createTaskContainer(containerTasks,task, index);
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
    menuItemButton.addEventListener("click",()=>{
        dropdownContent.classList.toggle("visible");
    });

    
    deleteButton.addEventListener("click", ()=>{
        taskContainer.style.display = "none";
        containerTasks.removeChild(taskContainer);
    });

    addEventListenerToCheckBox(completedButton,id);
    addEventListenerToEditButton(editButton,id);
    return taskContainer;
}

function handleEventSubmitEditInfo(event){
    event.preventDefault();
    const form = event.target;  // Forms that triggers the event
    const formData = new FormData(form);
    const name = formData.get('name');

    const id = getIdFromURL();
    let task = tasks[id];
    task.name = name;
    const taskName = document.querySelector(`.task-name${id}`);

    taskName.textContent = name;
    const editInfoContainer = document.querySelector(".edit-info-container");
    editInfoContainer.style.display = "none";

    //Delete ?edit=id of the url
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
        //Put ?edit=id in the url
        window.history.pushState({}, '', `?edit=${id}`);
        //Make dropdown content invivible

        const editInfoContainer = document.querySelector(".edit-info-container");
        editInfoContainer.style.display = "flex";
        createEditFormHTML(editInfoContainer);

        const closeButton = document.querySelector(".close-edit");
        closeButton.addEventListener("click", ()=>{
            editInfoContainer.style.display ="none";
        });

        const editNameForm = document.querySelector("#editNameForm");
        editNameForm.addEventListener("submit",handleEventSubmitEditInfo);
        
    });
}

function addEventListenerToCheckBox(checkbox, id){
    checkbox.addEventListener("change",()=>{
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
    editInfoContainer.innerHTML = `
        <div class="form-container">
            <h2>Editar Tarea</h2>
            <button class="close-edit">x</button>
            <form id="editNameForm">
                <div>
                    <label for="name">Nombre:</label>
                    <input type="text" id="name" name="name" placeholder="Ingrese su nombre" required>
                </div>
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    `;
}

function createTaskHTML(taskContainer, task, id){
    taskContainer.innerHTML = `
    <p class="task-name${id}">${task.name}</p>
    <button class="menu-btn menu-btn${id}">⋮</button>
    <div class="dropdown-content dropdown-content${id}">
        <button class="edit-btn edit-btn${id}">✏️ Editar</button>
        <button class="delete-btn delete-btn${id}">🗑️ Eliminar</button>
        <label class="checkbox-button">
            <input type="checkbox" class="myCheckbox${id}" name="myCheckbox" value="no">
            <span>Completada</span>
        </label>
    </div>     
`;
}
