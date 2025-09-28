export const tonApiService = {
  // Получение баланса адреса
  async getBalance(address: string): Promise<number> {
    try {
      const response = await fetch(https://toncenter.com/api/v2/getAddressBalance?address=\&api_key=\);
      const data = await response.json();
      return data.result / 1000000000; // Конвертация из nanoTON в TON
    } catch (error) {
      throw new Error('Failed to get balance');
    }
  },

  // Получение информации о транзакциях
  async getTransactions(address: string, limit: number = 10) {
    try {
      const response = await fetch(https://toncenter.com/api/v2/getTransactions?address=\&limit=\&api_key=\);
      const data = await response.json();
      return data.result;
    } catch (error) {
      throw new Error('Failed to get transactions');
    }
  },

  // Отправка транзакции
  async sendTransaction boc: string) {
    try {
      const response = await fetch('https://toncenter.com/api/v2/sendBoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boc: boc,
          api_key: process.env.REACT_APP_TON_API_KEY,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to send transaction');
    }
  },
};
