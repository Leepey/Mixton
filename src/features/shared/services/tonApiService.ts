// src/services/tonApiService.ts
// Получение баланса адреса
export const getBalance = async (address: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://toncenter.com/api/v2/getAddressBalance?address=${address}&api_key=${import.meta.env.VITE_TON_API_KEY}`
    );
    const data = await response.json();
    
    if (data.ok) {
      // Конвертируем из nanoTON в TON
      return (Number(data.result) / 1e9).toString();
    }
    
    throw new Error(data.error || 'Failed to get balance');
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};

// Получение информации об адресе
export const getAddressInfo = async (address: string) => {
  try {
    const response = await fetch(
      `https://toncenter.com/api/v2/getAddressInformation?address=${address}&api_key=${import.meta.env.VITE_TON_API_KEY}`
    );
    const data = await response.json();
    
    if (data.ok) {
      return data.result;
    }
    
    throw new Error(data.error || 'Failed to get address info');
  } catch (error) {
    console.error('Error fetching address info:', error);
    throw error;
  }
};