export const mathUtils = {
  // Конвертация TON в nanoTON
  tonToNano(ton: number): bigint {
    return BigInt(Math.floor(ton * 1000000000));
  },

  // Конвертация nanoTON в TON
  nanoToTon(nano: bigint | number): number {
    const nanoValue = typeof nano === 'bigint' ? nano : BigInt(nano);
    return Number(nanoValue) / 1000000000;
  },

  // Расчет процента
  percentage(value: number, total: number): number {
    if (total === 0) return 0;
    return (value / total) * 100;
  },

  // Генерация случайного числа в диапазоне
  randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Округление до N знаков после запятой
  round(num: number, decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  },
};
