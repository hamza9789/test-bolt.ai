import React from 'react';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoProps {
  todo: Todo;
  onDelete: () => void;
  onToggleComplete: () => void;
}

const Todo: React.FC<TodoProps> = ({ todo, onDelete, onToggleComplete }) => {
  return (
    <li className="flex justify-between mb-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggleComplete}
          className="mr-2"
        />
        <span
          className={`${
            todo.completed ? 'line-through text-gray-400' : ''
          }`}
        >
          {todo.text}
        </span>
      </div>
      <button onClick={onDelete} className="ml-2 text-red-500 hover:text-red-700 focus:outline-none">
        Delete
      </button>
    </li>
  );
};

export default Todo;
