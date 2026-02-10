import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import AddTaskInput from './components/AddTaskInput';
import ClearCompletedButton from './components/ClearCompletedButton';

// Orden de prioridades para ordenar tareas
const priorityOrder = { alta: 1, media: 2, baja: 3 };

// Función para obtener tareas iniciales desde localStorage
const getInitialTasks = () => {
  try {
    const savedTasks = localStorage.getItem('tasksStorage');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
  } catch (error) {
    console.error('Error al cargar tareas:', error);
  }
  // Tareas por defecto si no hay nada guardado
  return [
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
};

function App() {
  // ESTADO: La lista de tareas (inicialización lazy desde localStorage)
  const [tasks, setTasks] = useState(getInitialTasks);

  // EFECTO: Guardar tareas en localStorage cada vez que cambien
  useEffect(() => {
    try {
      localStorage.setItem('tasksStorage', JSON.stringify(tasks));
      console.log('✅ Tareas guardadas en localStorage:', tasks.length);
    } catch (error) {
      console.error('❌ Error al guardar tareas:', error);
    }
  }, [tasks]);

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

        <div className="mt-6 text-center text-sm text-gray-600">
          Total: {tasks.length} tareas | Completadas: {tasks.filter((t) => t.completed).length}
        </div>
      </div>
    </div>
  );
}

export default App;
