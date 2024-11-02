import "./tasks.css";
import { dateFormat } from "./tasks";

const TaskInfo = ({task, onClose}) => {
    return (
      <div className='visualize-task-info-container'>
        <div className="visualize-task-info">
          <button className="close-visualize" onClick={onClose}>x</button>
          <p><b>Nombre:</b> {task.name}</p>
          <p><b>Descripción:</b> {task.description}</p>
          <p><b>Fecha límite:</b> {dateFormat(task.deadline)}</p>
          <p><b>Dificultad:</b> {task.difficulty}</p>
          <p><b>Prioridad:</b> {task.priority}</p>
          <p><b>Tiempo Estimado:</b> {task.estimatedTime} horas</p>
        </div>
      </div>
    );
  }

export default TaskInfo;  

