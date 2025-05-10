import React, { useState } from 'react';
import { useTaskContext, Task } from '../../context/TaskContext';
import { Clock, Trash, Edit, Check, X } from 'lucide-react';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onTimerStart: (taskId: string) => void;
}

function TaskItem({ task, onTimerStart }: TaskItemProps) {
  const { updateTask, deleteTask, completeTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  
  const handleEdit = () => {
    setEditText(task.text);
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (editText.trim()) {
      updateTask(task.id, { text: editText });
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditText(task.text);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };
  
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="task-edit-form">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="task-edit-input"
          />
          <div className="task-edit-actions">
            <button 
              onClick={handleSave}
              className="task-edit-button save"
              aria-label="Save task"
            >
              <Check size={18} />
            </button>
            <button 
              onClick={handleCancel}
              className="task-edit-button cancel"
              aria-label="Cancel editing"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content">
            <button 
              className={`task-complete-button ${task.completed ? 'checked' : ''}`}
              onClick={() => !task.completed && completeTask(task.id)}
              disabled={task.completed}
              aria-label={task.completed ? "Task completed" : "Mark task as complete"}
            >
              {task.completed && <Check size={16} />}
            </button>
            
            <div className="task-details">
              <p className="task-text">{task.text}</p>
              {task.pomodorosCompleted > 0 && (
                <div className="task-pomodoro-count">
                  <Clock size={14} />
                  <span>{task.pomodorosCompleted}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="task-actions">
            {!task.completed && (
              <>
                <button 
                  className="task-action-button edit"
                  onClick={handleEdit}
                  aria-label="Edit task"
                >
                  <Edit size={18} />
                </button>
                
                <button 
                  className="task-action-button timer"
                  onClick={() => onTimerStart(task.id)}
                  aria-label="Start timer for this task"
                >
                  <Clock size={18} />
                </button>
              </>
            )}
            
            <button 
              className="task-action-button delete"
              onClick={() => deleteTask(task.id)}
              aria-label="Delete task"
            >
              <Trash size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem;