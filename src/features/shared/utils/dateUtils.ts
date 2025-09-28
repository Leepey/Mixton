export const dateUtils = {
  // Получение текущей временной метки
  now(): number {
    return Math.floor(Date.now() / 1000);
  },

  // Конвертация даты в timestamp
  toTimestamp(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  },

  // Конвертация timestamp в дату
  fromTimestamp(timestamp: number): Date {
    return new Date(timestamp * 1000);
  },

  // Добавление дней к дате
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  // Добавление часов к дате
  addHours(date: Date, hours: number): Date {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  },

  // Получение разницы в днях
  daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  },
};
