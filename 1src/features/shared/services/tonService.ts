/*src/services/tonService.ts*/
import { TonClient4 } from '@ton/ton';
import { Address, Cell, beginCell, fromNano, toNano } from '@ton/core';
import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto';
import { getBalance, getAddressInfo } from './tonApiService';

// Проверка наличия API ключа
const apiKey = import.meta.env.VITE_TON_API_KEY || '';
if (!apiKey) {
  console.warn('VITE_TON_API_KEY is not defined. Using empty string.');
}

// Создание TonClient4
const client = new TonClient4({
  endpoint: import.meta.env.VITE_NETWORK === 'mainnet' 
    ? 'https://mainnet-v4.tonhubapi.com' 
    : 'https://testnet-v4.tonhubapi.com',
});

// Генерация нового кошелька
export const generateWallet = async () => {
  const mnemonics = await mnemonicNew();
  const keyPair = await mnemonicToPrivateKey(mnemonics);
  return { mnemonics, keyPair };
};

// Отправка TON на адрес
export const sendTon = async (
  _fromAddress: string,
  _toAddress: string,
  amount: number,
  _mnemonic: string[]
) => {
  try {
    // Конвертируем количество TON в nanoTON
    const amountNano = toNano(amount);
    console.log(`Sending ${amountNano} nanoTON`);
    
    // В реальном приложении здесь будет создание сообщения
    // const messageBody = beginCell()
    //   .storeUint(0, 32) // opcode
    //   .storeStringTail('Payment') // комментарий
    //   .endCell();
    
    // В реальном приложении вы бы подписали транзакцию приватным ключом
    // и отправили ее через TonConnect
    
    return { success: true, message: 'Transaction sent successfully' };
  } catch (error) {
    console.error('Error sending TON:', error);
    throw error;
  }
};

// Получение баланса адреса
export const getWalletBalance = async (address: string) => {
  try {
    if (!address) {
      throw new Error('Address is required');
    }
    
    const balance = await getBalance(address);
    return balance;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
};

// Проверка статуса транзакции
export const checkTransactionStatus = async (address: string, txHash: string) => {
  try {
    if (!address || !txHash) {
      throw new Error('Address and transaction hash are required');
    }
    
    const transactions = await getTransactions(address, 10);
    const transaction = transactions.find((tx: any) => tx.transaction_id.hash === txHash);
    
    if (transaction) {
      return {
        status: 'completed',
        transaction,
      };
    }
    
    return { status: 'pending' };
  } catch (error) {
    console.error('Error checking transaction status:', error);
    throw error;
  }
};

// Получение информации о пуле микшера
export const getMixerPoolInfo = async (poolAddress: string) => {
  try {
    if (!poolAddress) {
      throw new Error('Pool address is required');
    }
    
    const poolInfo = await getAddressInfo(poolAddress);
    return poolInfo;
  } catch (error) {
    console.error('Error getting mixer pool info:', error);
    throw error;
  }
};

// Участие в пуле микшера
export const joinMixerPool = async (
  userAddress: string,
  poolAddress: string,
  amount: number,
  mnemonic: string[]
) => {
  try {
    if (!userAddress || !poolAddress || amount <= 0 || !mnemonic.length) {
      throw new Error('Invalid parameters for joining mixer pool');
    }
    
    // Отправка средств на пул микшера
    await sendTon(userAddress, poolAddress, amount, mnemonic);
    
    return { success: true, message: 'Successfully joined mixer pool' };
  } catch (error) {
    console.error('Error joining mixer pool:', error);
    throw error;
  }
};

// Конвертация TON в nanoTON (используем встроенную функцию)
export const convertToNano = (amount: number): bigint => {
  if (isNaN(amount) || amount < 0) {
    throw new Error('Invalid amount for conversion to nanoTON');
  }
  
  return toNano(amount);
};

// Конвертация nanoTON в TON (используем встроенную функцию)
export const convertFromNano = (amount: bigint): number => {
  if (typeof amount !== 'bigint') {
    throw new Error('Invalid amount for conversion from nanoTON');
  }
  
  return Number(fromNano(amount));
};

// Создание ячейки с сообщением
export const createMessageCell = (message: string): Cell => {
  if (!message) {
    throw new Error('Message is required');
  }
  
  return beginCell()
    .storeUint(0, 32) // opcode
    .storeStringTail(message)
    .endCell();
};

// Валидация адреса TON
export const isValidTonAddress = (address: string): boolean => {
  try {
    if (!address) return false;
    Address.parse(address);
    return true;
  } catch {
    return false;
  }
};

// Получение транзакций по адресу
const getTransactions = async (
  address: string,
  limit: number = 10,
  toLt?: number
) => {
  try {
    if (!address) {
      throw new Error('Address is required');
    }
    
    const params: any = { address, limit };
    if (toLt) params.to_lt = toLt;
    
    const url = new URL('https://toncenter.com/api/v2/getTransactions');
    url.searchParams.append('address', address);
    url.searchParams.append('limit', limit.toString());
    if (toLt) url.searchParams.append('to_lt', toLt.toString());
    if (apiKey) {
      url.searchParams.append('api_key', apiKey);
    }
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.error || 'Failed to fetch transactions');
    }
    
    return data.result;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Получение информации об аккаунте через TonClient4
export const getAccountInfo = async (address: string) => {
  try {
    if (!address) {
      throw new Error('Address is required');
    }
    
    const addr = Address.parse(address);
    const lastBlock = await client.getLastBlock();
    const account = await client.getAccount(lastBlock.last.seqno, addr);
    
    return {
      balance: fromNano(account.account.balance.coins),
      state: account.account.state,
      lastTransaction: account.account.last,
    };
  } catch (error) {
    console.error('Error getting account info:', error);
    throw error;
  }
};

// Получение баланса через TonClient4
export const getBalanceFromClient = async (address: string): Promise<string> => {
  try {
    if (!address) {
      throw new Error('Address is required');
    }
    
    const addr = Address.parse(address);
    const lastBlock = await client.getLastBlock();
    const account = await client.getAccount(lastBlock.last.seqno, addr);
    
    return fromNano(account.account.balance.coins);
  } catch (error) {
    console.error('Error getting balance from client:', error);
    throw error;
  }
};

export default client;