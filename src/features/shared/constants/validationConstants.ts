export const VALIDATION_CONFIG = {
  // ���������� ���������
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    TON_ADDRESS: /^EQ[A-Za-z0-9_-]{46}$/,
    TRANSACTION_HASH: /^[A-Za-z0-9]{64}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  },
  
  // �����
  LENGTHS: {
    USERNAME_MIN: 3,
    USERNAME_MAX: 20,
    PASSWORD_MIN: 8,
    PASSWORD_MAX: 128,
    ADDRESS_LENGTH: 48,
    TRANSACTION_HASH_LENGTH: 64,
  },
  
  // ��������� �� �������
  ERROR_MESSAGES: {
    INVALID_EMAIL: '�������� ������ email',
    INVALID_ADDRESS: '�������� ������ ������ TON',
    INVALID_PASSWORD: '������ ������ ��������� ������� 8 ��������, ������� ��������� �����, �������� ����� � �����',
    INVALID_AMOUNT: '�������� �����',
    INSUFFICIENT_BALANCE: '������������ �������',
    NETWORK_ERROR: '������ ����',
    UNKNOWN_ERROR: '����������� ������',
  },
};
