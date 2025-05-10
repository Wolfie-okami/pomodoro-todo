import { useRef, useState } from 'react';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export function useDragAndDrop<T>(
  items: T[],
  onReorder: (sourceIndex: number, destinationIndex: number) => void
) {
  const [isDragging, setIsDragging] = useState(false);
  const dragItem = useRef<DragItem | null>(null);
  const dragNode = useRef<HTMLElement | null>(null);
  
  const handleDragStart = (e: React.DragEvent<HTMLElement>, index: number, id: string) => {
    dragNode.current = e.currentTarget;
    dragItem.current = { index, id, type: 'task' };
    
    setTimeout(() => {
      setIsDragging(true);
    }, 0);
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    
    // Add drag styling
    if (dragNode.current) {
      dragNode.current.classList.add('dragging');
    }
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    dragItem.current = null;
    
    // Remove drag styling
    if (dragNode.current) {
      dragNode.current.classList.remove('dragging');
      dragNode.current = null;
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    if (!dragItem.current) return;
    
    if (dragItem.current.index !== index) {
      e.currentTarget.classList.add('drag-over');
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.currentTarget.classList.remove('drag-over');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (!dragItem.current) return;
    
    if (dragItem.current.index !== index) {
      onReorder(dragItem.current.index, index);
    }
  };
  
  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}