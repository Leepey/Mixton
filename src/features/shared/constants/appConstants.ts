export const APP_CONFIG = {
  NAME: 'Mixton',
  VERSION: '2.3.1',
  DESCRIPTION: 'Decentralized TON mixer with enhanced privacy',
  
  // ��������
  TIMEOUTS: {
    API_REQUEST: 30000, // 30 ������
    TRANSACTION: 60000, // 60 ������
    MIXING: 300000, // 5 �����
  },
  
  // ������
  LIMITS: {
    MIN_MIX_AMOUNT: 0.1, // ����������� ����� ��� ������������ � TON
    MAX_MIX_AMOUNT: 1000, // ������������ ����� ��� ������������ � TON
    MAX_HISTORY_ITEMS: 100, // ������������ ���������� ��������� � �������
  },
  
  // ��������
  FEES: {
    MIXING_FEE: 0.001, // �������� �� ������������ � TON
    MINER_FEE: 0.0001, // �������� ������� � TON
  },
};
