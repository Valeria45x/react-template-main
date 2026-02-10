// Componente para mostrar el estado de las tareas
// Props:
// - tasks: array de tareas
function StatusBar({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;

  return (
    <div className="mt-6 text-center text-sm text-gray-600">
      Total: {total} tareas | Completadas: {completed}
    </div>
  );
}

export default StatusBar;
