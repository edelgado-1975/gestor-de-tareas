import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import styles from './TaskColumn.module.css';

const TaskColumn = ({ title, tasks, onCardClick, onDeleteTask }) => {
  return (
    <div className={styles.column}>
      <h3 className={styles.title}>{title}</h3>
      <Droppable droppableId={title}>
        {(provided) => (
          <div
            className={styles.tasksContainer}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task._id} 
                task={task} 
                index={index}
                onCardClick={onCardClick}
                onDeleteTask={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;