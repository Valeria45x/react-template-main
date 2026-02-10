import { useState } from "react";

function AddTaskInput({ onAdd }) {
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState("media"); // Estado para prioridad

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue, priority); // Pasar la prioridad al padre
      setInputValue(""); // Limpiar input
      setPriority("media"); // Reset a prioridad media
    }
  };

  const handleKeyDown = (e) => {
    // Permitir tecla Enter para añadir tarea (como haría un formulario)
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex gap-2 mb-2">
        {/* onChange: Se dispara cada vez que el usuario escribe
            e = objeto evento (contiene info sobre lo que pasó)
            e.target = el elemento DOM que disparó el evento (este input)
            e.target.value = el texto actual escrito en el input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="¿Qué necesitas hacer?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAdd}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Añadir
        </button>
      </div>

      {/* Selector de prioridad */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600 font-medium">Prioridad:</span>
        <div className="flex gap-2">
          {["baja", "media", "alta"].map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`px-3 py-1 rounded-full transition-all ${
                priority === p
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddTaskInput;
