import React from 'react';
function ResetAppButton({ onReset }) {
  const handleReset = () => {
    if (
      window.confirm(
        '⚠️ ¿Seguro que quieres eliminar todas las tareas? Esta acción no se puede deshacer.'
      )
    ) {
      onReset();
    }
  };

  return (
    <div className="mt-4 text-center">
      <button
        onClick={handleReset}
        className="text-sm text-gray-500 hover:text-red-600 underline transition-colors"
      >
        🗑️ Resetear aplicación (borrar todo)
      </button>
    </div>
  );
}

export default ResetAppButton;
