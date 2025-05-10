import React, { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { Plus } from 'lucide-react';
import './AddTaskForm.css';

function AddTaskForm() {
  const { addTask } = useTaskContext();
  const [taskText, setTaskText] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      addTask(taskText);
      setTaskText('');
    }
  };
  
  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="add-task-input"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Add a new task..."
        aria-label="Add a new task"
      />
      <button 
        type="submit" 
        className="add-task-button"
        disabled={!taskText.trim()}
        aria-label="Add task"
      >
        <Plus size={20} />
      </button>
    </form>
  );
}

export default AddTaskForm;