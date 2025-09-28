export const mathUtils = {
  // ����������� TON � nanoTON
  tonToNano(ton: number): bigint {
    return BigInt(Math.floor(ton * 1000000000));
  },

  // ����������� nanoTON � TON
  nanoToTon(nano: bigint | number): number {
    const nanoValue = typeof nano === 'bigint' ? nano : BigInt(nano);
    return Number(nanoValue) / 1000000000;
  },

  // ������ ��������
  percentage(value: number, total: number): number {
    if (total === 0) return 0;
    return (value / total) * 100;
  },

  // ��������� ���������� ����� � ���������
  randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // ���������� �� N ������ ����� �������
  round(num: number, decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  },
};
