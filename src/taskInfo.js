import "./tasks.css";
import { dateFormat } from "./tasks";

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

export default TaskInfo;  

