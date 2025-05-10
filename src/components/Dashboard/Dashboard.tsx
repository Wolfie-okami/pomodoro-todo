import React from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useTimerContext } from '../../context/TimerContext';
import { CheckCircle, ListChecks, Timer } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const { tasks } = useTaskContext();
  const { state: timerState } = useTimerContext();
  
  // Calculate stats
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks.length / totalTasks) * 100) 
    : 0;
  
  // Get today's date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  
  // Filter for tasks completed today
  const tasksCompletedToday = completedTasks.filter(task => {
    if (!task.completedAt) return false;
    return task.completedAt.startsWith(today);
  });
  
  return (
    <div className="dashboard">
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon tasks">
            <ListChecks size={20} />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Tasks</h3>
            <p className="stat-value">{activeTasks.length}</p>
            <p className="stat-label">active</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Completed</h3>
            <p className="stat-value">{tasksCompletedToday.length}</p>
            <p className="stat-label">today</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pomodoros">
            <Timer size={20} />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Pomodoros</h3>
            <p className="stat-value">{timerState.pomodorosCompleted}</p>
            <p className="stat-label">completed</p>
          </div>
        </div>
      </div>
      
      <div className="progress-container">
        <div className="progress-header">
          <h3 className="progress-title">Today's Progress</h3>
          <p className="progress-percentage">{completionPercentage}%</p>
        </div>
        
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;