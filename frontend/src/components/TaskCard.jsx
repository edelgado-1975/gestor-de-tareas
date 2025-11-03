import { Draggable } from '@hello-pangea/dnd';
import styles from './TaskCard.module.css';

const TaskCard = ({ task, onCardClick, onDeleteTask, index }) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDeleteTask(task._id);
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          className={styles.card}
          onClick={() => onCardClick(task)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <button onClick={handleDeleteClick} className={styles.deleteButton}>×</button>
          <p className={styles.description}>{task.descripcion}</p>
          <small>Vence: {new Date(task.fechaVencimiento).toLocaleDateString()}</small>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;