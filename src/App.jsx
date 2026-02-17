import { useState } from 'react';
import TaskList from './components/TaskList';
import AddTaskInput from './components/AddTaskInput';
import ClearCompletedButton from './components/ClearCompletedButton';
import ResetAppButton from './components/ResetAppButton';
import StatusBar from './components/StatusBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import { useToggle } from './hooks/useToggle';

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

  // ESTADO: Término de búsqueda (cambia en cada tecla)
  const [searchTerm, setSearchTerm] = useState('');

  // DEBOUNCE: Versión "retrasada" del término de búsqueda
  // Solo se actualiza después de 300ms sin cambios (evita filtrar en cada tecla)
  const debouncedSearch = useDebounce(searchTerm, 300);

  // TOGGLE: Controla si ocultamos las tareas completadas
  // hideCompleted = true → no mostrar tareas marcadas como completadas
  const [hideCompleted, toggleHideCompleted] = useToggle(false);

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

  // FILTRAR: Tareas que coincidan con la búsqueda (usando el valor debounced)
  // Si hideCompleted es true, también excluimos las completadas
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(debouncedSearch.toLowerCase());
    const shouldShow = hideCompleted ? !task.completed : true;
    return matchesSearch && shouldShow;
  });

  // ORDENAR: Tareas filtradas por prioridad (alta primero)
  const sortedTasks = [...filteredTasks].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
          📝 Mi lista de tareas
        </h1>

        <AddTaskInput onAdd={addTask} />

        {/* Input de búsqueda */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar tareas..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none
                       focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
          />
          {/* Mostrar info de búsqueda si hay término */}
          {debouncedSearch && (
            <p className="text-sm text-gray-500 mt-1">
              Mostrando {filteredTasks.length} de {tasks.length} tareas
            </p>
          )}
        </div>

        {/* Toggle para ocultar/mostrar tareas completadas */}
        <div className="mb-4 flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hideCompleted}
              onChange={toggleHideCompleted}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Ocultar tareas completadas</span>
          </label>
          {hideCompleted && tasks.some((t) => t.completed) && (
            <span className="text-xs text-gray-500">
              ({tasks.filter((t) => t.completed).length} ocultas)
            </span>
          )}
        </div>

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
