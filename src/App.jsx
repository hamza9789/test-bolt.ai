import React, { useEffect, useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'rt-todo-v1'

function TodoItem({ todo, onToggle, onDelete, onSaveEdit }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(todo.text)
  const inputRef = useRef(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  function save() {
    const trimmed = value.trim()
    if (!trimmed) return
    onSaveEdit(todo.id, trimmed)
    setEditing(false)
  }

  return (
    <li className="flex items-center justify-between gap-4 p-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <input
          id={`chk-${todo.id}`}
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5"
        />
        {!editing ? (
          <label htmlFor={`chk-${todo.id}`} className={`select-none \${todo.completed ? 'line-through text-gray-400' : ''}`}>
            {todo.text}
          </label>
        ) : (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
            className="border rounded px-2 py-1"
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        {!editing && (
          <button onClick={() => setEditing(true)} className="text-sm px-2 py-1 rounded hover:bg-gray-100">Edit</button>
        )}
        {editing && (
          <>
            <button onClick={save} className="text-sm px-2 py-1 rounded bg-blue-500 text-white">Save</button>
            <button onClick={() => { setEditing(false); setValue(todo.text) }} className="text-sm px-2 py-1 rounded">Cancel</button>
          </>
        )}
        <button onClick={() => onDelete(todo.id)} className="text-sm px-2 py-1 rounded hover:bg-red-50 text-red-600">Delete</button>
      </div>
    </li>
  )
}

export default function App() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setTodos(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function addTodo(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    const newTodo = { id: uuidv4(), text: trimmed, completed: false, createdAt: Date.now() }
    setTodos((t) => [newTodo, ...t])
    setText('')
  }

  function toggleTodo(id) {
    setTodos((t) => t.map(x => x.id === id ? { ...x, completed: !x.completed } : x))
  }

  function deleteTodo(id) {
    setTodos((t) => t.filter(x => x.id !== id))
  }

  function saveEdit(id, newText) {
    setTodos((t) => t.map(x => x.id === id ? { ...x, text: newText } : x))
  }

  function clearCompleted() {
    setTodos((t) => t.filter(x => !x.completed))
  }

  const filtered = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const remaining = todos.filter(t => !t.completed).length

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Todo App</h1>
        <form onSubmit={addTodo} className="flex gap-2 mb-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </form>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <div>{remaining} items left</div>
            <div className="flex gap-2">
              <button onClick={() => setFilter('all')} className={`px-2 py-1 rounded \${filter === 'all' ? 'bg-slate-200' : 'hover:bg-slate-100'}`}>All</button>
              <button onClick={() => setFilter('active')} className={`px-2 py-1 rounded \${filter === 'active' ? 'bg-slate-200' : 'hover:bg-slate-100'}`}>Active</button>
              <button onClick={() => setFilter('completed')} className={`px-2 py-1 rounded \${filter === 'completed' ? 'bg-slate-200' : 'hover:bg-slate-100'}`}>Completed</button>
            </div>
          </div>
          <ul className="border rounded divide-y bg-white">
            {filtered.length === 0 ? (
              <li className="p-4 text-center text-gray-400">No todos</li>
            ) : (
              filtered.map(todo => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} onSaveEdit={saveEdit} />
              ))
            )}
          </ul>
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="text-gray-600">Total: {todos.length}</div>
            <div className="flex items-center gap-3">
              <button onClick={clearCompleted} className="px-3 py-1 text-sm rounded hover:bg-red-50 text-red-600">Clear completed</button>
            </div>
          </div>
        </div>
        <footer className="text-xs text-center text-gray-400">Built with React + Tailwind — localStorage persistence</footer>
      </div>
    </div>
  )
}