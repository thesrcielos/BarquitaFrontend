import React, { useEffect, useState} from 'react';
import "./tasks.css";
import {
  getAllTasksByState,
  addTask,
  deleteTask,
  updateTask,
  updateTaskState,
    changeUserName,
    changeUserPassword
} from './connectionBackend.js';
import { useAuth } from './AuthenticationContext.js';
import Home from './home.js';
import user_icon from "./Assets/person.png";

const difficultyLevels = ['alta', 'media', 'baja'];
const priorityLevels = ['1', '2', '3', '4', '5'];

const Tasks = () => {
  const {getUserInfo} = useAuth();
  const [tasks, setTasks] = useState([]);
  const [tasksCompleted, setTasksCompleted] = useState([]);
  const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);
  const [infoTaskId, setInfoTaskId] = useState(null);
  const [taskInfoId, setTaskInfoId] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);
  const [isTasksNotCompletedVisible, setIsTasksNotCompletedVisible] = useState(true);
  const [isTasksCompletedVisible, setIsTasksCompletedVisible] = useState(true);
  const [userId, setUserId] = useState(undefined);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [visibleFilter, setVisibleFilter] = useState('none');
  const [isAnyFilterActivate, setIsAnyFilterActivate] = useState(false);
  const [isProfileWebSiteShowed, setIsProfileWebSiteShowed] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userConfirmPassword, setUserConfirmPassword] = useState('');


  
  useEffect(() => {
    const fetchUserIdAndTasks = async () => {
      const userInfo = getUserInfo();
      const userIdInfo = userInfo.usernameId;
      setUserId(userIdInfo);
      setUserName(userIdInfo.name);
      setUserEmail(userIdInfo.email);
      if (userIdInfo) {
        const incompleteTasks = await getAllTasksByState(userIdInfo, false);
        const completedTasks = await getAllTasksByState(userIdInfo, true);
        setTasks(incompleteTasks);
        setTasksCompleted(completedTasks);
      }
    };

    fetchUserIdAndTasks();
  }, [getUserInfo]);

  const toggleMenu = (id) => {
    setMenuVisible(menuVisible === id ? null : id);
  }

  const changeTaskNotCompletedVisibility = () => {
    setIsTasksNotCompletedVisible(!isTasksNotCompletedVisible);
  }

  const handleChangeStateTask = async (changeTask) => {
    toggleMenu(null);
    let taskId = changeTask.id;
    await updateTaskState(userId, taskId);

    let initialState= changeTask.state;
    changeTask.state = !initialState;

    if(!initialState){
      setTasks(tasks.filter(task => task.id !== taskId));
      setTasksCompleted(prevTasks => [...prevTasks, changeTask]);
    }else{
      setTasksCompleted(tasksCompleted.filter(task => task.id !== taskId));
      setTasks(prevTasks => [...prevTasks, changeTask]);
    }
  }
  const closeTaskInfo = () => {
    setTaskInfoId(null);
  }
  const changeTaskCompletedVisibility = () => {
    setIsTasksCompletedVisible(!isTasksCompletedVisible);
  }


  const closeEditForm = () => {
    setInfoTaskId(null);
  }
  
  const getTaskById = (id) =>{
    if(id === null) return null;
    let task = tasks.find(task => task.id === id);
    if(task !== undefined) return task;
    return tasksCompleted.find(task => task.id === id);
  }
  
  const handleAddTask = async (newTask) => {
    let savedTask = await addTask(userId, newTask);
    setTasks([...tasks, savedTask]);
  };

  const handleDeleteTask = async (taskId, isCompleted) => {
    await deleteTask(userId, taskId);
    if (isCompleted) {
      setTasksCompleted(tasksCompleted.filter(task => task.id !== taskId));
    } else {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
    toggleMenu(null);
  };

  const handleUpdateTask = async (updatedTask) => {
    await updateTask(userId, updatedTask);
    if (updatedTask.state) {
      setTasksCompleted(prevTasks => prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
    } else {
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
    }
  };

  const showAddTaskForm = () => {
    setIsAddTaskVisible(true);
  };

  const hideAddTaskForm = () => {
    setIsAddTaskVisible(false);
  };

  const TaskList = ({ tasks, onDelete}) => {
    return (
      <div className="for-complete">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  };

  const Task = ({ task, onDelete}) => {
    const handleEdit = () => {
      setInfoTaskId(task.id);
      toggleMenu(null);
    };

    return (
      <div className={`task-container`}>
        <button className={`menu-btn`} onClick={() => toggleMenu(task.id)}>⋮</button>
        <div className={`task-info`} onClick={() => setTaskInfoId(task.id)}>
          <p className={`task-name`}>{task.name}</p>
          <p className={`task-date`}>{dateFormat(task.deadline)}</p>
          <p className={`task-priority`}>Prioridad {task.priority}</p>
          <p className={`task-difficulty`}>{task.difficulty}</p>
        </div>
        {menuVisible === task.id && (
        <div className={`dropdown-content`}>
          <button className={`edit-btn`} onClick={() => handleEdit()}>✏️ Editar</button>
          <button className={`delete-btn`} onClick={()=>onDelete(task.id)}>🗑️ Eliminar</button>
          <label className={`checkbox-button`}>
            <input type="checkbox" className={`myCheckbox`} checked={task.state}
            name="myCheckbox" value="no" onChange={() => handleChangeStateTask(task)}/>
            <span>Completada</span>
          </label>
        </div>
        )}
      </div>
    );
  
  };
  
  const CompletedTaskList = ({ tasks, onDelete, onUpdate }) => {
    return (
      <div className="complete">
        {tasks.map(task => (
          <Task
            key={task.id}
            task={task}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    );
  };

  // Función para filtrar las tareas por dificultad
const filterTasksByDifficulty = () => {
  if (selectedDifficulty) {
    const newFilteredTasks = tasks.filter(task => task.difficulty === selectedDifficulty);
    setTasks(newFilteredTasks);
    const newFilteredTasksCompleted = tasksCompleted.filter(task => task.difficulty === selectedDifficulty);
    setTasksCompleted(newFilteredTasksCompleted);
    setVisibleFilter('none');
    setIsAnyFilterActivate(true);
  }
};

// Función para filtrar las tareas por prioridad
const filterTasksByPriority = () => {
  if (selectedPriority) {
    const newFilteredTasks = tasks.filter(task => task.priority === selectedPriority);
    setTasks(newFilteredTasks);
    const newFilteredTasksCompleted = tasksCompleted.filter(task => task.priority === selectedPriority);
    setTasksCompleted(newFilteredTasksCompleted);
    setSelectedPriority(selectedPriority);
    setVisibleFilter('none');
    setIsAnyFilterActivate(true);
  }
};

// Funció para filtrar las tareas por fecha
const filterTasksByDate = () => {
  if (selectedDate) {
    const newFilteredTasks = tasks.filter(task => task.deadline <= selectedDate);  // Suponiendo que las tareas tengan una propiedad 'date'
    setTasks(newFilteredTasks);
    const newFilteredTasksCompleted = tasksCompleted.filter(task => task.deadline <= selectedDate);
    setTasksCompleted(newFilteredTasksCompleted);
    setSelectedDate(selectedDate);
    setVisibleFilter('none');
    setIsAnyFilterActivate(true);
  }
}

// Función para mostrar el formulario de los botones de filtrado
const showFilter = (filterType) => {
    setVisibleFilter(filterType); // De lo contrario, lo mostramos
};

const disableFilter = async () => {
  if (isAnyFilterActivate){
      // Asegúrate de que userId se haya establecido antes de hacer las solicitudes de tareas
      if (userId) {
        const incompleteTasks = await getAllTasksByState(userId, false);
        const completedTasks = await getAllTasksByState(userId, true);
        setTasks(incompleteTasks);
        setTasksCompleted(completedTasks);
        setIsAnyFilterActivate(false);
      }
  }
};

const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{8,}$/;
  if (regex.test(password)) {
    return true;
  }
  return "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial (@$!%*?&). ";
}

const handleSave = async () => {
  const isValidPassword = validatePassword(userPassword)
  if (isValidPassword === true){
    if (userPassword === userConfirmPassword) {
      await changeUserName(userId, userName);
      await changeUserPassword(userId, userPassword);
      setUserPassword('');
      setIsEditingProfile(false);
    }
    else {
      const userInfo = getUserInfo();
      setUserName(userInfo.name);
      alert("La contraseña no coincide")
    }
  }
  else{
    const userInfo = getUserInfo();
    setUserName(userInfo.name);
    alert(isValidPassword)
  }

}
  
  return (
    <div className="app-container">
      <Home/>
      <div className="header">
        <div className="task-menu">
          <h1>Mis tareas</h1>
          <div className="profile-button-container">
            <button className="profile-button" onClick={() => setIsProfileWebSiteShowed(true)}>
              <img src={user_icon} alt=""/>
              Perfil
            </button>
          </div>
        </div>
        <div className="buttons">
          <button className="disable-filter-buton" onClick={() => disableFilter()}>Eliminar filtros 🗑️</button>
          <button className="order-by-priority-button" onClick={() => showFilter('priority')}>Ordenar por prioridad 🔝
          </button>
          <button className="order-by-difficulty-button" onClick={() => showFilter('difficulty')}>Ordenar por dificultad 👀</button>
          <button className="order-by-date-button" onClick={() => showFilter('date')}>Filtrar por fecha 📆</button>
          <button className="add-task-button" onClick={showAddTaskForm}>Agregar tarea ➕</button>
        </div>
      </div>
      {isAddTaskVisible && (
        <AddTaskForm onAddTask={handleAddTask} onClose={hideAddTaskForm} />
      )}
      <div className="tasks-not-completed">
        <div className="header-not-completed">
          <button className="hide-button-not-complete" onClick={changeTaskNotCompletedVisibility}>🔻</button>
          <h2 className="title-task">Por completar</h2>
        </div>
        { isTasksNotCompletedVisible && (
        <TaskList
          tasks={tasks}
          onDelete={handleDeleteTask}
        />
        )}
      </div>
      <div className="tasks-completed">
        <div className="header-completed">
          <button className="hide-button-complete" onClick={changeTaskCompletedVisibility}>🔻</button>
          <h2 className="title-task">Completadas</h2>
        </div>
      { isTasksCompletedVisible && (
        <CompletedTaskList
          className="container-tasks-completed"
          tasks={tasksCompleted}
          onDelete={handleDeleteTask}
          onUpdate={handleUpdateTask}
        />
      )}
      </div>
      {/* Aquí puedes incluir contenedores adicionales como edit-info-container, add-task-info-container, etc. */}
      {taskInfoId !==null && (
        <TaskInfo
          task={getTaskById(taskInfoId)}
          onClose={closeTaskInfo}
        />
      )}
      {/**Hacer visible el formulario de filtrar por fecha */}
      {visibleFilter === "date" && (
      <div className='filter-container'>
        <div className="date-filter-container">
        <button className="close-date-filter" onClick={() => setVisibleFilter('none')}>✖️</button>
        <h2>Seleccionar Fecha</h2>
        <label htmlFor="filter-date">Fecha:</label>
        <input type="datetime-local" id="filter-date" onChange={(e) => setSelectedDate(e.target.value)}/>
        <button id="filter-by-date-button" onClick={filterTasksByDate}>Filtrar</button>
        </div>
      </div>
      )}
      {/**Hacer visible el formulario de filtrar por dificultad */}
      {visibleFilter === 'difficulty' && (
      <div className='filter-container'>
        <div className="difficulty-filter-container">
        <button className="close-difficulty-filter" onClick={() => setVisibleFilter('none')}>✖️</button>
        <h2>Seleccionar Dificultad</h2>
        <select id="filter-difficulty" value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
          <option value="" disabled>Seleccionar dificultad</option>
          {difficultyLevels.map(level => (
            <option key={level} value={level.toUpperCase()}>{level.toUpperCase()}</option>
          ))}
        </select>
        <button id="apply-difficulty-filter" onClick={filterTasksByDifficulty}>Aplicar filtro</button>
        </div>
      </div>
      )}
      {isProfileWebSiteShowed === true && (
          <div className="user-info">
            {isEditingProfile === true && (
                <div>
                  <div className="form-group">
                    <label htmlFor="userName">Nombre:</label>
                    <input
                        id="userName"
                        type="text"
                        placeholder="Nombre"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="userPassword">Contraseña:</label>
                    <input
                        id="userPassword"
                        type="password"
                        placeholder="Contraseña"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirmar Contraseña"
                        value={userConfirmPassword}
                        onChange={(e) => setUserConfirmPassword(e.target.value)}
                        className="input-field"
                    />
                  </div>

                  <button onClick={handleSave} className="button-save">Guardar</button>
                  <button onClick={() => setIsEditingProfile(false)} className="button-close-edit-profile">Cerrar
                  </button>
                </div>
            )}
            {isEditingProfile === false && (
                <div>
                  <p><strong>Nombre:</strong> {userName}</p>
                  <p><strong>Correo:</strong> {userEmail}</p>
                  <button onClick={() => setIsEditingProfile(true)} className="edit-user-information-button">Editar
                  </button>
                  <button onClick={() => setIsProfileWebSiteShowed(false)}
                          className="close-user-information-button">Cerrar
                  </button>
                </div>
            )}
          </div>
      )}
      {/**Hacer visible el formulario de filtrar por prioridad */}
      {visibleFilter === 'priority' && (
          <div className='filter-container'>
            <div className="priority-filter-container">
              <button className="close-priority-filter" onClick={() => setVisibleFilter('none')}>✖️</button>
              <h2>Seleccionar Prioridad</h2>
              <select id="filter-priority" onChange={(e) => setSelectedPriority(e.target.value)}>
                <option value="" disabled selected>Seleccionar prioridad</option>
                {priorityLevels.map(p => (
                    <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <button id="apply-priority-filter" onClick={filterTasksByPriority}>Aplicar filtro</button>
            </div>
          </div>
      )}

      {infoTaskId !== null && (
          <div className='edit-info-container'>
            <AddEditForm
                onEditTask={handleUpdateTask}
                onClose={closeEditForm}
                task={getTaskById(infoTaskId)}
          />
      </div>
      )}
    </div>
  );
};
const TaskForm = ({onSubmit, onClose, onChange, taskData, title}) => {
  return (<div className='add-task-info-container'>
      <form className="task-form" onSubmit={onSubmit}>
        <button className="close-add-task" onClick={onClose}>✖️</button>
        <h2>{title}</h2>
        <label htmlFor='name'>Nombre</label>
        <input
          className="task-input"
          type="text"
          name="name"
          placeholder="Nombre"
          value={taskData.name}
          onChange={onChange}
          required
        />
        <label htmlFor='description'>Descripción</label>
        <textarea
          className="task-textarea"
          name="description"
          placeholder="Descripción"
          value={taskData.description}
          onChange={onChange}
          required
        />
        <label htmlFor='deadline'>Fecha Límite</label>
        <input
          className="task-datetime"
          type="datetime-local"
          name="deadline"
          value={taskData.deadline}
          onChange={onChange}
          required
        />
        <label htmlFor='difficulty'>Dificultad</label>
        <select className="task-difficulty" name="difficulty" 
        value={taskData.difficulty} onChange={onChange} required>
          <option value="">Dificultad</option>
          {difficultyLevels.map(level => (
            <option key={level} value={level.toUpperCase()}>{level.toUpperCase()}</option>
          ))}
        </select>
        <label htmlFor='priority'>Prioridad</label>
        <select className="task-priority" name="priority" 
        value={taskData.priority} onChange={onChange} required>
          <option value="">Prioridad</option>
          {priorityLevels.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <label htmlFor='estimatedTime'>Tiempo Estimado</label>
        <input name='estimatedTime' type='number' value={taskData.estimatedTime}
        min='1' max='100' onChange={onChange} required/>
        <button className="submit-task-button" type="submit">Enviar</button>
      </form>
    </div>
  );
}
const AddEditForm = ({ onEditTask, onClose, task}) => {
  const [taskData, setTaskData] = useState({
    id: task.id,
    name: task.name,
    description: task.description,
    deadline: task.deadline,
    difficulty: task.difficulty,
    priority: task.priority,
    state: task.state,
    estimatedTime: task.estimatedTime
  });
 
  const handleSubmit = (e) => {
    e.preventDefault();
    onEditTask({ ...taskData});
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prevData => ({ ...prevData, [name]: value }));
  };

  return (<TaskForm 
            onSubmit={handleSubmit}
            onClose={onClose}
            onChange={handleChange}
            taskData={taskData}
            title={"Editar Tarea"}
        />);

}
const AddTaskForm = ({ onAddTask, onClose }) => {
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    deadline: '',
    difficulty: '',
    priority: '',
    estimatedTime: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask({ ...taskData, state: false });
    onClose();
  };

  return (
    <TaskForm 
      onSubmit={handleSubmit}
      onClose={onClose}
      onChange={handleChange}
      taskData={taskData}
      title={"Crear Tarea"}
    />
  );
};

const TaskInfo = ({task, onClose}) => {
  return (
    <div className='visualize-task-info-container'>
      <div className="visualize-task-info">
        <button className="close-visualize" onClick={onClose}>x</button>
        <p>Nombre: {task.name}</p>
        <p>Descripción: {task.description}</p>
        <p>Fecha límite: {dateFormat(task.deadline)}</p>
        <p>Dificultad: {task.difficulty}</p>
        <p>Prioridad: {task.priority}</p>
        <p>Tiempo Estimado: {task.estimatedTime} horas</p>
      </div>
    </div>
  );
}
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

export default Tasks;