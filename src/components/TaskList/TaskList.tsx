import React, { useState } from 'react';
import { useTaskContext, Task } from '../../context/TaskContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import { CheckSquare, PlusSquare } from 'lucide-react';
import './TaskList.css';

interface TaskListProps {
  onStartTimer: (taskId: string) => void;
}

function TaskList({ onStartTimer }: TaskListProps) {
  const { tasks, reorderTasks } = useTaskContext();
  const [showCompleted, setShowCompleted] = useState(false);
  
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const {
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useDragAndDrop<Task>(activeTasks, reorderTasks);

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2 className="task-list-title">Tasks</h2>
      </div>
      
      <AddTaskForm />
      
      <div className="task-list">
        <div className="active-tasks">
          <h3 className="task-section-title">Active Tasks</h3>
          {activeTasks.length === 0 ? (
            <p className="empty-state">No active tasks. Add one above!</p>
          ) : (
            <ul className="task-items">
              {activeTasks.map((task, index) => (
                <li 
                  key={task.id} 
                  className={`task-item-wrapper ${isDragging ? 'draggable' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index, task.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <TaskItem 
                    task={task} 
                    onTimerStart={onStartTimer} 
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {completedTasks.length > 0 && (
          <div className="completed-tasks">
            <button 
              className="toggle-completed-button"
              onClick={() => setShowCompleted(!showCompleted)}
              aria-expanded={showCompleted}
            >
              {showCompleted ? (
                <>
                  <CheckSquare size={18} />
                  <span>Hide Completed ({completedTasks.length})</span>
                </>
              ) : (
                <>
                  <PlusSquare size={18} />
                  <span>Show Completed ({completedTasks.length})</span>
                </>
              )}
            </button>
            
            {showCompleted && (
              <ul className="task-items completed">
                {completedTasks.map((task) => (
                  <li key={task.id} className="task-item-wrapper completed">
                    <TaskItem 
                      task={task} 
                      onTimerStart={onStartTimer} 
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskList;