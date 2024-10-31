import "./tasks.css";
import { useState } from "react";

const difficultyLevels = ['alta', 'media', 'baja'];
const priorityLevels = ['1', '2', '3', '4', '5'];

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
            maxLength={40}
            required
          />
          <label htmlFor='description'>Descripción</label>
          <textarea
            className="task-textarea"
            name="description"
            placeholder="Descripción"
            value={taskData.description}
            onChange={onChange}
            maxLength={100}
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
export const AddEditForm = ({ onEditTask, onClose, task}) => {
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
export const AddTaskForm = ({ onAddTask, onClose }) => {
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