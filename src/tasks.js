import React, { useEffect, useState} from 'react';
import "./tasks.css";
import {
  getAllTasksByState,
  addTask,
  deleteTask,
  updateTask,
  updateTaskState,
} from './connectionBackend.js';
import { useAuth } from './AuthenticationContext.js';
import Home from './home.js';
import TaskInfo from './taskInfo.js';
import { AddTaskForm, AddEditForm } from './tasksForms.js';
import TaskList from './taskList.js';

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
  
  useEffect(() => {
    const fetchUserIdAndTasks = async () => {
      const userInfo = getUserInfo();
      const userIdInfo = userInfo.usernameId;
      setUserId(userIdInfo);
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
    let priority = parseInt(selectedPriority, 10);
    const newFilteredTasks = tasks.filter(task => task.priority === priority);
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
  
  return (
    <div className="app-container">
      <Home/>
      <div className="header">
        <div className="task-menu">
          <h1>Mis tareas</h1>
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
          setInfoTaskId={setInfoTaskId}
          setTaskInfoId={setTaskInfoId}
          toggleMenu={toggleMenu}
          handleChangeStateTask={handleChangeStateTask}
          completed={false}
          menuVisible={menuVisible}
        />
        )}
      </div>
      <div className="tasks-completed">
        <div className="header-completed">
          <button className="hide-button-complete" onClick={changeTaskCompletedVisibility}>🔻</button>
          <h2 className="title-task">Completadas</h2>
        </div>
      { isTasksCompletedVisible && (
        <TaskList
          className="container-tasks-completed"
          tasks={tasksCompleted}
          onDelete={handleDeleteTask}
          setInfoTaskId={setInfoTaskId}
          setTaskInfoId={setTaskInfoId}
          toggleMenu={toggleMenu}
          handleChangeStateTask={handleChangeStateTask}
          completed={true}
          menuVisible={menuVisible}
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

export function dateFormat(date){
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