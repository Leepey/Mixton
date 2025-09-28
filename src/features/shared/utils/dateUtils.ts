export const dateUtils = {
  // ��������� ������� ��������� �����
  now(): number {
    return Math.floor(Date.now() / 1000);
  },

  // ����������� ���� � timestamp
  toTimestamp(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  },

  // ����������� timestamp � ����
  fromTimestamp(timestamp: number): Date {
    return new Date(timestamp * 1000);
  },

  // ���������� ���� � ����
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  // ���������� ����� � ����
  addHours(date: Date, hours: number): Date {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  },

  // ��������� ������� � ����
  daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  },
};
