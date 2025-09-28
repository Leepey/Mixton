export const formatUtils = {
  // �������������� ����� TON
  formatTon(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return num.toFixed(9).replace(/\.?0+$/, '');
  },

  // �������������� ������
  formatAddress(address: string, length: number = 6): string {
    if (address.length <= length * 2 + 2) return address;
    return \...\;
  },

  // �������������� ����
  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // �������������� ����� � �������������
  formatNumber(num: number): string {
    return num.toLocaleString('ru-RU');
  },
};
