import { useState } from 'react';
import TaskList from './components/TaskList';
import AddTaskInput from './components/AddTaskInput';
import ClearCompletedButton from './components/ClearCompletedButton';
import ResetAppButton from './components/ResetAppButton';
import StatusBar from './components/StatusBar';
import { useLocalStorage } from './hooks/useLocalStorage';

// Orden de prioridades para ordenar tareas
const priorityOrder = { alta: 1, media: 2, baja: 3 };

// Tareas por defecto si no hay nada guardado en localStorage
const defaultTasks = [
  {
    id: 1,
    text: 'Aprender fundamentos de React',
    completed: false,
    priority: 'alta',
  },
  {
    id: 2,
    text: 'Construir una app de tareas',
    completed: false,
    priority: 'media',
  },
];

function App() {
  // ESTADO: La lista de tareas con persistencia automática en localStorage
  // useLocalStorage encapsula toda la lógica de lectura/escritura a localStorage
  const [tasks, setTasks] = useLocalStorage('tasksStorage', defaultTasks);

  // FUNCIÓN: Añadir una nueva tarea con prioridad
  const addTask = (text, priority = 'media') => {
    const newTask = {
      id: Date.now(), // ID único simple
      text: text,
      completed: false,
      priority: priority, // Nueva propiedad de prioridad
    };
    setTasks([...tasks, newTask]); // Añadir a las tareas existentes
  };

  // FUNCIÓN: Eliminar una tarea
  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // FUNCIÓN: Alternar completado de tarea
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  // FUNCIÓN: Eliminar todas las tareas completadas
  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  // FUNCIÓN: Resetear la aplicación (borrar todo)
  // Al usar setTasks([]), useLocalStorage automáticamente actualiza localStorage
  const resetApp = () => {
    setTasks([]);
  };

  // Ordenar tareas por prioridad (alta primero)
  const sortedTasks = [...tasks].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
          📝 Mi lista de tareas
        </h1>

        <AddTaskInput onAdd={addTask} />

        <TaskList tasks={sortedTasks} onRemove={removeTask} onToggle={toggleTask} />

        <ClearCompletedButton
          count={tasks.filter((t) => t.completed).length}
          onClear={clearCompleted}
        />

        <StatusBar tasks={tasks} />

        <ResetAppButton onReset={resetApp} />
      </div>
    </div>
  );
}

export default App;
