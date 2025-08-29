import React, { useState } from 'react';
import { Todo } from './Todo';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDeleteTodo,
  onToggleComplete,
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  const filteredTodos =
    filter === 'all'
      ? todos
      : todos.filter((todo) => todo.completed === (filter === 'completed'));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Todo List</h2>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-md ${
            filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('incomplete')}
          className={`px-4 py-2 rounded-md ${
            filter === 'incomplete' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Incomplete
        </button>
      </div>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="flex justify-between mb-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggleComplete(todo.id)}
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
            <button
              onClick={() => onDeleteTodo(todo.id)}
              className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
