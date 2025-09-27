// features/shared/utils/safeUtils.ts

/**
 * Безопасно копирует текст в буфер обмена
 * @param text - Текст для копирования (может быть undefined)
 */
export const safeCopyToClipboard = async (text: string | undefined): Promise<void> => {
  if (!text) return;
  
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
  }
};

/**
 * Безопасно открывает URL в новой вкладке
 * @param url - URL для открытия (может быть undefined)
 */
export const safeOpenUrl = (url: string | undefined): void => {
  if (!url) return;
  
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Failed to open URL:', error);
  }
};

/**
 * Безопасно получает строковое значение
 * @param value - Значение (может быть undefined или null)
 * @param defaultValue - Значение по умолчанию
 * @returns Строковое значение или defaultValue
 */
export const safeString = (value: string | undefined | null, defaultValue: string = ''): string => {
  return value ?? defaultValue;
};

/**
 * Безопасно получает числовое значение
 * @param value - Значение (может быть undefined или null)
 * @param defaultValue - Значение по умолчанию
 * @returns Числовое значение или defaultValue
 */
export const safeNumber = (value: number | undefined | null, defaultValue: number = 0): number => {
  return value ?? defaultValue;
};

/**
 * Безопасно получает булево значение
 * @param value - Значение (может быть undefined или null)
 * @param defaultValue - Значение по умолчанию
 * @returns Булево значение или defaultValue
 */
export const safeBoolean = (value: boolean | undefined | null, defaultValue: boolean = false): boolean => {
  return value ?? defaultValue;
};

/**
 * Безопасно получает значение из массива
 * @param array - Массив (может быть undefined или null)
 * @param index - Индекс элемента
 * @param defaultValue - Значение по умолчанию
 * @returns Элемент массива или defaultValue
 */
export const safeArrayAccess = <T>(
  array: T[] | undefined | null, 
  index: number, 
  defaultValue: T
): T => {
  if (!array || index < 0 || index >= array.length) {
    return defaultValue;
  }
  return array[index];
};

/**
 * Безопасно вызывает функцию
 * @param fn - Функция для вызова (может быть undefined)
 * @param args - Аргументы функции
 * @returns Результат функции или undefined
 */
export const safeCall = <T extends (...args: any[]) => any>(
  fn: T | undefined, 
  ...args: Parameters<T>
): ReturnType<T> | undefined => {
  if (typeof fn !== 'function') {
    return undefined;
  }
  try {
    return fn(...args);
  } catch (error) {
    console.error('Error in safeCall:', error);
    return undefined;
  }
};

/**
 * Безопасно парсит JSON
 * @param jsonString - JSON строка (может быть undefined или null)
 * @param defaultValue - Значение по умолчанию
 * @returns Распарсенный объект или defaultValue
 */
export const safeJsonParse = <T>(
  jsonString: string | undefined | null, 
  defaultValue: T
): T => {
  if (!jsonString) {
    return defaultValue;
  }
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return defaultValue;
  }
};

/**
 * Безопасно преобразует в строку
 * @param value - Значение для преобразования
 * @returns Строковое представление
 */
export const safeToString = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (error) {
      return String(value);
    }
  }
  
  return String(value);
};

/**
 * Безопасно проверяет, является ли значение пустым
 * @param value - Значение для проверки
 * @returns true если значение пустое
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }
  
  return false;
};