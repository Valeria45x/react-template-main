import { useState, useCallback } from 'react';

/**
 * Custom hook para manejar estados booleanos de forma reutilizable.
 *
 * ¿Por qué este hook?
 * - Patrón muy común: mostrar/ocultar modales, menús, filtros, etc.
 * - Evita repetir la misma lógica en múltiples componentes
 * - Proporciona funciones específicas (toggle, setTrue, setFalse) más legibles que setValue(!value)
 *
 * @param {boolean} initialValue - Valor inicial (por defecto false)
 * @returns {[boolean, function, function, function]} - [valor, toggle, setTrue, setFalse]
 *
 * @example
 * const [isOpen, toggleOpen, open, close] = useToggle(false);
 * // toggleOpen() → cambia de true a false o viceversa
 * // open() → siempre pone true
 * // close() → siempre pone false
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  // useCallback asegura que las funciones no se recrean en cada render
  // Esto es útil si se pasan como props a componentes memoizados

  // Toggle: invierte el valor actual
  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  // setTrue: fuerza el valor a true
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  // setFalse: fuerza el valor a false
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
}
