import { dateFormat } from "./tasks";
import "./tasks.css";

const TaskList = ({ tasks, onDelete, setInfoTaskId, setTaskInfoId, toggleMenu, handleChangeStateTask, completed, menuVisible}) => {
    return (
      <div className="for-complete">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDelete={onDelete}
            setInfoTaskId={setInfoTaskId}
            setTaskInfoId={setTaskInfoId}
            toggleMenu={toggleMenu}
            handleChangeStateTask={handleChangeStateTask}
            completed={completed}
            menuVisible={menuVisible}
          />
        ))}
      </div>
    );
  };

  const Task = ({ task, onDelete, setInfoTaskId, setTaskInfoId, toggleMenu,handleChangeStateTask, completed, menuVisible}) => {
    const handleEdit = () => {
      setInfoTaskId(task.id);
      toggleMenu(null);
    };

    return (
      <div className={`task-container`}>
        <button className={`menu-btn`} onClick={() =>toggleMenu(task.id)}>⋮</button>
        <div className={`task-info`} onClick={() => setTaskInfoId(task.id)}>
          <p className={`task-name`}>{task.name}</p>
          <p className={`task-date`}>{dateFormat(task.deadline)}</p>
          <p className={`task-priority`}>Prioridad {task.priority}</p>
          <p className={`task-difficulty`}>{task.difficulty}</p>
        </div>
        {menuVisible === task.id && (
        <div className={`dropdown-content`}>
          <button className={`edit-btn`} onClick={() => handleEdit()}>✏️ Editar</button>
          <button className={`delete-btn`} onClick={()=>onDelete(task.id, completed)}>🗑️ Eliminar</button>
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

  export default TaskList;