import { useState, useEffect } from 'react';

/**
 * Custom hook que sincroniza un valor con localStorage.
 *
 * ¿Por qué extraer esto a un hook?
 * - Reutilización: Podemos usar el mismo patrón para guardar cualquier dato (tareas, preferencias, tema, etc.)
 * - Separación de responsabilidades: La lógica de persistencia queda encapsulada
 * - Testabilidad: Más fácil de probar de forma aislada
 *
 * @param {string} key - Clave en localStorage donde se guardará el valor
 * @param {T} initialValue - Valor inicial si no hay nada guardado en localStorage
 * @returns {[T, (value: T | ((prev: T) => T)) => void]} - Array con el valor y la función para actualizarlo
 *
 * @example
 * const [tasks, setTasks] = useLocalStorage('tasks', []);
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 */
export function useLocalStorage(key, initialValue) {
  // ESTADO: Inicialización lazy (la función se ejecuta solo una vez)
  // Esto evita leer localStorage en cada render
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Intentar obtener el valor guardado en localStorage
      const item = window.localStorage.getItem(key);

      // Si existe, parsearlo de JSON a objeto/array
      // Si no existe, devolver el valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay error al parsear (JSON corrupto), usar valor inicial
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Función para actualizar el valor.
   * Acepta tanto un valor directo como una función (como setState normal).
   *
   * @param {T | ((prev: T) => T)} value - Nuevo valor o función que recibe el valor anterior
   *
   * @example
   * setValue([...tasks, newTask]); // Valor directo
   * setValue(prev => [...prev, newTask]); // Función (setter funcional)
   */
  const setValue = (value) => {
    try {
      // Permitir que value sea una función (como setState)
      // Si es función, la ejecutamos pasándole el valor actual
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Guardar en el estado de React
      setStoredValue(valueToStore);

      // Guardar en localStorage (convertir a JSON string)
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Manejar errores (ej: límite de almacenamiento excedido)
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Devolver el mismo formato que useState: [valor, setter]
  return [storedValue, setValue];
}
