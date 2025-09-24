npx create-vite@latest ton-mixer --template react-ts
cd ton-mixer
npm install @mui/material@7.1.0 @emotion/react @emotion/styled framer-motion lucide-react tonconnect-sdk
npm install -D @types/react@18.2.15 @types/react-dom@18.2.7 typescript@5.1.6 vite@4.4.9
npm install @mui/material @emotion/react @emotion/styled
npm install react-router-dom @types/react-router-dom --save
If you also use @mui/icons-material or @mui/lab, install them as well:

bash
npm install @mui/icons-material @mui/lab

Схема проекта TON Mixer 
Общее описание проекта 

TON Mixer - это децентрализованный сервис для обеспечения приватности транзакций в сети TON. Проект позволяет пользователям смешивать свои TON, чтобы скрыть источник происхождения средств, используя смарт-контракт и три пула с разными параметрами. 
Архитектура проекта 

На основе предложенной feature-based архитектуры и текущей структуры проекта, я создам обновленную схему Mixton v2.3.1 с учетом всех компонентов и их взаимосвязей.

# 🏗️ Обновленная схема проекта Mixton v2.3.1 (Feature-Based Architecture)

## 📊 Общая структура проекта

```
ton-mixer/
├── public/                          # Статические файлы
├── src/                             # Исходный код
│   ├── app/                         # Конфигурация и инициализация
│   ├── features/                    # Feature-based модули
│   │   ├── auth/                   # Аутентификация
│   │   ├── dashboard/               # Панель управления
│   │   ├── mixer/                   # Основной функционал микшера
│   │   ├── admin/                   # Админ-панель
│   │   └── shared/                  # Общие компоненты
│   ├── pages/                       # Страницы приложения
│   ├── routes/                      # Маршрутизация
│   ├── styles/                      # Стили
│   ├── App.tsx                      # Корневой компонент
│   └── main.tsx                     # Точка входа
└── конфигурационные файлы
```

## 🔍 Детальная схема архитектуры

### 📱 Структура страниц (Pages Layer)

```typescript
// pages/
├── Home.tsx                        # Главная страница
│   ├── Использует: MixForm, QuickMixForm
│   ├── Состояние: useMixing, usePoolSelection
│   └── Сервисы: mixerService, poolService
│
├── Dashboard.tsx                   # Панель управления
│   ├── Использует: StatsModule, QueueModule, PoolsModule, TransactionsModule
│   ├── Состояние: useDashboardStats, useQueueManagement
│   └── Сервисы: dashboardService, queueService
│
├── AdminPanel.tsx                  # Админ-панель
│   ├── Использует: UserManagement, ContractSettings, SecuritySettings
│   ├── Состояние: useAdminAuth, useContractManagement
│   └── Сервисы: adminService, securityService
│
├── About.tsx                       # О проекте
├── NotFound.tsx                    # 404 страница
└── Unauthorized.tsx                # Неавторизованный доступ
```

### 🧩 Feature-Based модули

#### 🔐 Модуль Auth (Аутентификация)

```typescript
// features/auth/
├── components/                     # Компоненты аутентификации
│   ├── LoginForm.tsx              # Форма входа
│   │   ├── Состояние: useAuth
│   │   ├── UI: NeonCard, MixButton
│   │   └── Логика: authService.login
│   │
│   ├── ConnectWalletModal.tsx     # Модальное окно подключения кошелька
│   │   ├── Состояние: useWalletAuth
│   │   ├── UI: Modal, TonConnectButton
│   │   └── Логика: walletAuthService.connectWallet
│   │
│   └── ProtectedRoute.tsx         # Защищенные маршруты
│       ├── Состояние: useAuth
│       ├── UI: Redirect
│       └── Логика: проверка isAuthenticated
│
├── hooks/                         # Хуки аутентификации
│   ├── useAuth.ts                 # Основной хук аутентификации
│   │   ├── Состояние: User, AuthState
│   │   ├── Эффекты: localStorage, проверка токена
│   │   └── Методы: login, logout, checkAuth
│   │
│   └── useWalletAuth.ts           # Хук для работы с кошельком
│       ├── Состояние: connected, wallet
│       ├── Эффекты: TonConnect
│       └── Методы: connect, disconnect, verify
│
├── services/                      # Сервисы аутентификации
│   ├── authService.ts             # Сервис аутентификации
│   │   ├── Методы: login, logout, checkAuth
│   │   ├── API: /auth/login, /auth/logout
│   │   └── Хранилище: localStorage, cookies
│   │
│   └── walletAuthService.ts       # Сервис работы с кошельком
│       ├── Методы: connectWallet, disconnectWallet, verifyWallet
│       ├── Интеграция: TonConnect
│       └── Валидация: адреса, подписи
│
├── types/                         # Типы аутентификации
│   └── auth.types.ts
│       ├── interface User { id, address, role, createdAt }
│       ├── interface AuthState { user, isLoading, isAuthenticated }
│       └── type UserRole = 'user' | 'admin'
│
├── utils/                         # Утилиты аутентификации
│   └── authUtils.ts
│       ├── validateAddress(address): boolean
│       ├── generateNonce(): string
│       └── hashPassword(password): string
│
└── index.ts                       # Экспорт модуля
    ├── Экспорт всех компонентов, хуков, сервисов, типов, утилит
    └── Реэкспорт для удобного импорта
```

#### 📊 Модуль Dashboard (Панель управления)

```typescript
// features/dashboard/
├── components/                     # Компоненты дашборда
│   ├── StatsModule.tsx            # Модуль статистики
│   │   ├── Состояние: useDashboardStats
│   │   ├── UI: NeonCard, графики
│   │   ├── Данные: totalDeposits, totalWithdrawn, activeUsers
│   │   └── Обновление: реальное время, polling
│   │
│   ├── QueueModule.tsx           # Модуль очереди
│   │   ├── Состояние: useQueueManagement
│   │   ├── UI: таблица очереди, кнопки управления
│   │   ├── Действия: processQueue, cancelItem
│   │   └── Данные: queueItems, processingStatus
│   │
│   ├── PoolsModule.tsx           # Модуль пулов
│   │   ├── Состояние: usePoolsData
│   │   ├── UI: MixPoolCard для каждого пула
│   │   ├── Данные: poolStats, utilization
│   │   └── Фильтрация: по типу пула, статусу
│   │
│   ├── TransactionsModule.tsx    # Модуль транзакций
│   │   ├── Состояние: useTransactionHistory
│   │   ├── UI: таблица транзакций, фильтры
│   │   ├── Данные: transactions, pagination
│   │   └── Действия: export, filter, search
│   │
│   └── SettingsModule.tsx        # Модуль настроек
│       ├── Состояние: useSettings
│       ├── UI: форма настроек, переключатели
│       ├── Данные: userSettings, preferences
│       └── Действия: saveSettings, resetSettings
│
├── hooks/                         # Хуки дашборда
│   ├── useDashboardStats.ts       # Хук статистики
│   │   ├── Запрос: useQuery(['dashboard-stats'])
│   │   ├── Данные: DashboardStats
│   │   ├── Кэширование: 5 минут
│   │   └── Обновление: автоматическое, ручное
│   │
│   ├── useQueueManagement.ts     # Хук управления очередью
│   │   ├── Состояние: queueItems, processing
│   │   ├── Методы: processQueue, cancelItem, prioritize
│   │   ├── WebSocket: real-time updates
│   │   └── Оптимизация: batch processing
│   │
│   └── usePoolsData.ts           # Хук данных пулов
│       ├── Запрос: useQuery(['pools-data'])
│       ├── Данные: PoolData[], utilization
│       ├── Фильтрация: по типу, статусу
│       └── Агрегация: статистика по пулам
│
├── services/                      # Сервисы дашборда
│   ├── dashboardService.ts        # Сервис дашборда
│   │   ├── Методы: getStats, getOverview
│   │   ├── API: /dashboard/stats, /dashboard/overview
│   │   ├── Кэширование: Redis, browser cache
│   │   └── Оптимизация: data aggregation
│   │
│   └── queueService.ts           # Сервис очереди
│       ├── Методы: getQueue, processQueue, cancelItem
│       ├── API: /queue/list, /queue/process
│       ├── WebSocket: /queue/updates
│       └── Безопасность: авторизация, валидация
│
├── types/                         # Типы дашборда
│   └── dashboard.types.ts
│       ├── interface DashboardStats { totalDeposits, totalWithdrawn, activeUsers }
│       ├── interface QueueItem { id, recipient, amount, status, priority }
│       ├── interface PoolData { id, name, utilization, stats }
│       └── type QueueStatus = 'pending' | 'processing' | 'completed'
│
├── utils/                         # Утилиты дашборда
│   └── dashboardUtils.ts
│       ├── formatCurrency(amount): string
│       ├── calculateUtilization(pool): number
│       ├── aggregateStats(data): Stats
│       └── exportToCSV(data): void
│
└── index.ts                       # Экспорт модуля
```

#### 🔄 Модуль Mixer (Основной функционал микшера)

```typescript
// features/mixer/
├── components/                     # Компоненты микшера
│   ├── MixForm.tsx                # Основная форма микширования
│   │   ├── Состояние: useMixing, usePoolSelection
│   │   ├── UI: NeonCard, поля ввода, выбор пула
│   │   ├── Валидация: amount, recipient, pool
│   │   └── Действия: submitMix, estimateFee
│   │
│   ├── QuickMixForm.tsx           # Быстрая форма микширования
│   │   ├── Состояние: useQuickMix
│   │   ├── UI: упрощенная форма, presets
│   │   ├── Логика: автоматический выбор пула
│   │   └── Действия: quickMix, presetMix
│   │
│   ├── MixConfirmationModal.tsx   # Модальное окно подтверждения
│   │   ├── Состояние: useConfirmation
│   │   ├── UI: детали транзакции, подтверждение
│   │   ├── Данные: amount, fee, recipient, delay
│   │   └── Действия: confirm, cancel
│   │
│   └── TransactionStatus.tsx      # Статус транзакции
│       ├── Состояние: useTransactionStatus
│       ├── UI: индикатор прогресса, детали
│       ├── Данные: transactionId, status, steps
│       └── Обновление: real-time, polling
│
├── hooks/                         # Хуки микшера
│   ├── useMixing.ts               # Основной хук микширования
│   │   ├── Состояние: mixingState, error, success
│   │   ├── Методы: mix, estimateFee, validate
│   │   ├── Контракт: MixerContractService
│   │   └── Оптимизация: debounce, retry
│   │
│   ├── useTransaction.ts          # Хук транзакций
│   │   ├── Состояние: transactions, loading
│   │   ├── Методы: getTransaction, monitorStatus
│   │   ├── Подписка: real-time updates
│   │   └── Кэширование: localStorage, query cache
│   │
│   └── usePoolSelection.ts        # Хук выбора пула
│       ├── Состояние: selectedPool, poolOptions
│       ├── Методы: selectPool, getPoolInfo
│       ├── Логика: автоматический выбор на основе amount
│       └── Валидация: min/max amount для пула
│
├── services/                      # Сервисы микшера
│   ├── mixerService.ts            # Сервис микшера
│   │   ├── Методы: mix, estimateFee, getHistory
│   │   ├── Контракт: взаимодействие со смарт-контрактом
│   │   ├── Оптимизация: batch operations
│   │   └── Безопасность: валидация, проверки
│   │
│   ├── transactionService.ts       # Сервис транзакций
│   │   ├── Методы: createTransaction, getStatus, getHistory
│   │   ├── Мониторинг: real-time status updates
│   │   ├── Хранилище: localStorage, database
│   │   └── Аналитика: статистика транзакций
│   │
│   └── poolService.ts             # Сервис пулов
│       ├── Методы: getPools, getPoolStats, updatePool
│       ├── Кэширование: pool data, statistics
│       ├── Обновление: automatic refresh
│       └── Аналитика: utilization, performance
│
├── types/                         # Типы микшера
│   └── mixer.types.ts
│       ├── interface MixRequest { amount, recipient, poolType, delay }
│       ├── interface Transaction { id, amount, status, timestamp }
│       ├── interface Pool { id, name, minAmount, maxAmount, fee }
│       └── type MixStatus = 'pending' | 'processing' | 'completed' | 'failed'
│
├── utils/                         # Утилиты микшера
│   ├── poolUtils.ts               # Утилиты пулов
│   │   ├── calculateFee(amount, poolType): number
│   │   ├── getOptimalPool(amount): Pool
│   │   ├── validatePoolLimits(amount, poolType): boolean
│   │   └── formatPoolName(poolType): string
│   │
│   └── validationUtils.ts         # Утилиты валидации
│       ├── validateAmount(amount): boolean
│       ├── validateAddress(address): boolean
│       ├── validateDelay(delay): boolean
│       └── sanitizeInput(input): string
│
└── index.ts                       # Экспорт модуля
```

#### 👥 Модуль Admin (Админ-панель)

```typescript
// features/admin/
├── components/                     # Компоненты админа
│   ├── UserManagement.tsx         # Управление пользователями
│   │   ├── Состояние: useUserManagement
│   │   ├── UI: таблица пользователей, CRUD операции
│   │   ├── Данные: users, permissions, roles
│   │   └── Действия: addUser, editUser, deleteUser, banUser
│   │
│   ├── ContractSettings.tsx       # Настройки контракта
│   │   ├── Состояние: useContractSettings
│   │   ├── UI: форма настроек, параметры контракта
│   │   ├── Данные: contractConfig, feeRates, limits
│   │   └── Действия: updateSettings, resetSettings
│   │
│   ├── SecuritySettings.tsx       # Настройки безопасности
│   │   ├── Состояние: useSecuritySettings
│   │   ├── UI: настройки безопасности, логи
│   │   ├── Данные: securityConfig, auditLogs
│   │   └── Действия: updateSecurity, viewLogs
│   │
│   └── AnalyticsPanel.tsx         # Панель аналитики
│       ├── Состояние: useAnalytics
│       ├── UI: графики, метрики, отчеты
│       ├── Данные: analyticsData, trends
│       └── Действия: exportReport, filterData
│
├── hooks/                         # Хуки админа
│   ├── useAdminAuth.ts            # Хук аутентификации админа
│   │   ├── Состояние: isAdmin, permissions
│   │   ├── Проверки: role-based access
│   │   ├── Методы: checkPermission, hasRole
│   │   └── Безопасность: session management
│   │
│   ├── useContractManagement.ts   # Хук управления контрактом
│   │   ├── Состояние: contractState, settings
│   │   ├── Методы: updateContract, getContractInfo
│   │   ├── Контракт: MixerContractService
│   │   └── Валидация: настроек, параметров
│   │
│   └── useUserManagement.ts        # Хук управления пользователями
│       ├── Состояние: users, loading, error
│       ├── Методы: getUsers, createUser, updateUser, deleteUser
│       ├── API: /admin/users, /admin/users/:id
│       └── Оптимизация: pagination, search, filter
│
├── services/                      # Сервисы админа
│   ├── adminService.ts            # Сервис админа
│   │   ├── Методы: getUsers, getSettings, updateSettings
│   │   ├── API: /admin/* endpoints
│   │   ├── Авторизация: admin-only endpoints
│   │   └── Логирование: admin actions
│   │
│   └── securityService.ts         # Сервис безопасности
│       ├── Методы: getSecurityLogs, updateSecurityConfig
│       ├── Мониторинг: suspicious activities
│       ├── Оповещения: security alerts
│       └── Аудит: action logging
│
├── types/                         # Типы админа
│   └── admin.types.ts
│       ├── interface User { id, address, role, permissions, status }
│       ├── interface ContractSettings { feeRates, limits, delays }
│       ├── interface SecurityConfig { twoFactor, auditLevel, ipRestriction }
│       └── type UserRole = 'admin' | 'moderator' | 'user'
│
├── utils/                         # Утилиты админа
│   └── adminUtils.ts
│       ├── hasPermission(user, permission): boolean
│       ├── validateContractSettings(settings): boolean
│       ├── formatSecurityLog(log): string
│       └── generateAdminReport(data): Report
│
└── index.ts                       # Экспорт модуля
```

#### 🔄 Модуль Shared (Общие компоненты)

```typescript
// features/shared/
├── components/                     # Общие компоненты
│   ├── layout/                    # Layout компоненты
│   │   ├── Navbar.tsx             # Навигационная панель
│   │   │   ├── Состояние: useAuth, useTonConnect
│   │   │   ├── UI: меню, логотип, профиль
│   │   │   ├── Навигация: маршруты, активные ссылки
│   │   │   └── Адаптивность: mobile/desktop
│   │   │
│   │   ├── Footer.tsx             # Подвал сайта
│   │   │   ├── UI: ссылки, копирайт, социальные сети
│   │   │   ├── Данные: navigationLinks, socialLinks
│   │   │   └── Локализация: многоязычность
│   │   │
│   │   └── MainLayout.tsx         # Основной layout
│   │       ├── Props: children, className
│   │       ├── Структура: Navbar + main + Footer
│   │       ├── Стили: контейнер, отступы
│   │       └── Контекст: тема, язык
│   │
│   ├── ui/                        # Базовые UI компоненты
│   │   ├── buttons/               # Кнопки
│   │   │   ├── TonConnectButton.tsx
│   │   │   │   ├── Состояние: useTonConnect
│   │   │   │   ├── UI: статус подключения, адрес
│   │   │   │   ├── Действия: connect, disconnect
│   │   │   │   └── Интеграция: TonConnect SDK
│   │   │   │
│   │   │   └── MixButton.tsx
│   │   │       ├── Props: variant, size, loading
│   │   │       ├── UI: неоновый стиль, анимации
│   │   │       ├── События: onClick, disabled
│   │   │       └── Доступность: ARIA labels
│   │   │
│   │   ├── cards/                 # Карточки
│   │   │   ├── NeonCard.tsx
│   │   │   │   ├── Props: title, children, glow
│   │   │   │   ├── UI: неоновое свечение, тени
│   │   │   │   ├── Анимации: hover, focus
│   │   │   │   └── Адаптивность: responsive
│   │   │   │
│   │   │   └── MixPoolCard.tsx
│   │   │       ├── Props: pool, onSelect
│   │   │       ├── Данные: pool info, stats
│   │   │       ├── UI: прогресс бар, метрики
│   │   │       └── Интерактивность: выбор, hover
│   │   │
│   │   ├── loaders/               # Индикаторы загрузки
│   │   │   └── TransactionLoader.tsx
│   │   │       ├── Props: message, progress
│   │   │       ├── UI: спиннер, текст прогресса
│   │   │       ├── Анимации: плавная, пульсирующая
│   │   │       └── Состояния: loading, success, error
│   │   │
│   │   ├── modals/                # Модальные окна
│   │   │   └── ConfirmationModal.tsx
│   │   │       ├── Props: open, title, message, onConfirm, onCancel
│   │   │       ├── UI: оверлей, анимации появления
│   │   │       ├── Управление: клавиатура, клик вне
│   │   │       └── Доступность: фокус, ARIA
│   │   │
│   │   └── typography/            # Типографика
│   │       └── NeonText.tsx
│   │           ├── Props: text, color, size
│   │           ├── UI: неоновый эффект, анимации
│   │           ├── Варианты: заголовок, подзаголовок, обычный
│   │           └── Кастомизация: цвет, интенсивность свечения
│   │
│   └── feedback/                  # Компоненты обратной связи
│       ├── Toast.tsx              # Уведомления
│       │   ├── Props: message, type, duration
│       │   ├── UI: анимации появления/исчезновения
│       │   ├── Управление: очередь, автоматическое закрытие
│       │   └── Типы: success, error, warning, info
│       │
│       └── Notification.tsx       # Системные уведомления
│           ├── Props: title, message, actions
│           ├── UI: панель уведомлений, иконки
│           ├── Управление: закрыть, отложить
│           └── Персистентность: localStorage
│
├── hooks/                         # Общие хуки
│   ├── useTonConnect.ts           # Хук TonConnect
│   │   ├── Состояние: connected, wallet, network
│   │   ├── Методы: connect, disconnect, sendTransaction
│   │   ├── Эффекты: инициализация, подписка на события
│   │   └── Интеграция: TonConnect SDK
│   │
│   ├── useLocalStorage.ts         # Хук localStorage
│   │   ├── Параметры: key, initialValue
│   │   ├── Возвращаемое: [value, setValue]
│   │   ├── Синхронизация: вкладки, обновления
│   │   └── Обработка ошибок: try/catch
│   │
│   └── useDebounce.ts             # Хук debounce
│       ├── Параметры: value, delay
│       ├── Возвращаемое: debouncedValue
│       ├── Оптимизация: таймер, очистка
│       └── Применение: поиск, фильтрация
│
├── services/                      # Общие сервисы
│   ├── tonApiService.ts           # TON API сервис
│   │   ├── Методы: getAccountInfo, getTransactions
│   │   ├── API: TON Center, TON API
│   │   ├── Кэширование: запросов, ответов
│   │   └── Обработка ошибок: retry, fallback
│   │
│   ├── tonService.ts              # Базовые TON операции
│   │   ├── Методы: sendTon, estimateFee, getBalance
│   │   ├── Интеграция: TON SDK, wallet
│   │   ├── Валидация: адресов, сумм
│   │   └── Безопасность: проверки, лимиты
│   │
│   ├── storageService.ts          # Сервис работы с localStorage
│   │   ├── Методы: set, get, remove, clear
│   │   ├── Сериализация: JSON, encryption
│   │   ├── Квоты: размер, количество записей
│   │   └── Очистка: устаревшие данные
│   │
│   └── contract/                  # Сервисы работы с контрактом
│       ├── MixerContractService.ts
│       │   ├── Методы: deposit, withdraw, getStats
│       │   ├── Контракт: Mixton v2.3.1
│       │   ├── Оптимизация: batch operations
│       │   └── Мониторинг: events, logs
│       │
│       └── wrappers/
│           └── Mixton.ts          # Обертка контракта
│               ├── Абстракция: высокоуровневый API
│               ├── Типизация: строгие типы для методов
│               ├── Удобство: упрощенные вызовы
│               └── Безопасность: валидация параметров
│
├── types/                         # Общие типы
│   ├── ton.d.ts                   # Типы TON
│   │   ├── Interface: Address, Cell, Transaction
│   │   ├── Enums: Network, OperationType
│   │   └── Утилиты: типы для TON SDK
│   │
│   └── common.types.ts            # Общие типы
│       ├── Interface: ApiResponse, PaginatedResponse
│       ├── Types: Status, Priority, Role
│       └── Утилиты: типы-помощники
│
├── utils/                         # Общие утилиты
│   ├── tonUtils.ts                # Утилиты TON
│   │   ├── Функции: formatAddress, parseAmount
│   │   ├── Конвертация: TON -> nanoTON, наоборот
│   │   ├── Валидация: адресов, хешей
│   │   └── Форматирование: отображение сумм
│   │
│   ├── formatUtils.ts             # Форматирование
│   │   ├── Функции: formatCurrency, formatDate
│   │   ├── Локализация: многоязычность
│   │   ├── Маски: телефон, адрес, сумма
│   │   └── Отображение: сокращенные формы
│   │
│   └── validation.ts             # Валидация
│       ├── Функции: validateEmail, validateRequired
│       ├── Схемы: Joi, Yup integration
│       ├── Ошибки: кастомные сообщения
│       └── Типы: ValidationResult, ValidationError
│
└── constants/                     # Константы
    ├── contractConstants.ts       # Константы контракта
    │   ├── Operations: OP_DEPOSIT, OP_WITHDRAW
    │   ├── Errors: коды ошибок
    │   ├── Limits: минимальные/максимальные значения
    │   └── Fees: комиссии по умолчанию
    │
    ├── poolConstants.ts           # Константы пулов
    │   ├── PoolTypes: Basic, Standard, Premium
    │   ├── Limits: для каждого типа пула
    │   ├── Fees: процентные комиссии
    │   └── Delays: временные интервалы
    │
    └── appConstants.ts            # Константы приложения
        ├── API: эндпоинты, таймауты
        ├── UI: размеры, цвета, анимации
        ├── Storage: ключи, квоты
        └── Environment: конфигурация окружения
```

### 🎨 Стили и темы

```typescript
// styles/
├── theme.ts                       # Тема MUI
│   ├── Палитра: неоновые цвета, градиенты
│   ├── Типографика: шрифты, размеры
│   ├── Компоненты: кастомные стили
│   └── Адаптивность: breakpoints
│
├── global.css                     # Глобальные стили
│   ├── Сброс: normalize, reset
│   ├── Базовые стили: body, html
│   ├── Утилиты: классы-помощники
│   └── Анимации: ключевые кадры
│
└── neon.css                       # Неоновые стили
    ├── Эффекты: свечение, тени
    ├── Анимации: пульс, мигание
    ├── Компоненты: неоновые элементы
    └── Темы: цветовые схемы
```

### 🛣️ Маршрутизация

```typescript
// routes/
├── AppRoutes.tsx                  # Основные маршруты
│   ├── Публичные: Home, About
│   ├── Защищенные: Dashboard, AdminPanel
│   ├── Redirect: аутентификация, авторизация
│   └── Layout: MainLayout для защищенных маршрутов
│
├── ProtectedRoutes.tsx            # Защищенные маршруты
│   ├── Компонент: ProtectedRoute
│   ├── Проверки: isAuthenticated, hasRole
│   ├── Redirect: на страницу входа
│   └── Загрузка: индикатор проверки
│
└── PublicRoutes.tsx               # Публичные маршруты
    ├── Компонент: PublicRoute
    ├── Логика: доступ без аутентификации
    ├── Redirect: на дашборд если авторизован
    └── Страницы: Home, About, Login
```

### ⚙️ Конфигурация приложения

```typescript
// app/
├── providers/                     # React провайдеры
│   ├── AuthProvider.tsx           # Провайдер аутентификации
│   │   ├── Состояние: AuthContext
│   │   ├── Методы: login, logout, checkAuth
│   │   ├── Эффекты: инициализация, проверка сессии
│   │   └── Хранилище: localStorage, cookies
│   │
│   ├── MixerProvider.tsx          # Провайдер микшера
│   │   ├── Состояние: MixerContext
│   │   ├── Методы: mix, getStats, monitor
│   │   ├── Подписка: real-time updates
│   │   └── Оптимизация: кэширование, debounce
│   │
│   └── TonConnectProvider.tsx     # Провайдер TonConnect
│       ├── Состояние: TonConnectContext
│       ├── Методы: connect, disconnect, sendTransaction
│       ├── Интеграция: TonConnect SDK
│       └── События: статус подключения, изменение сети
│
├── config/                        # Конфигурации
│   ├── tonConfig.ts               # Конфигурация TON
│   │   ├── Сеть: mainnet/testnet
│   │   ├── Эндпоинты: API, RPC
│   │   ├── Параметры: gas limits, fees
│   │   └── Контракты: адреса, ABI
│   │
│   ├── contractConfig.ts          # Конфигурация контракта
│   │   ├── Адрес: Mixton contract
│   │   ├── Операции: коды операций
│   │   ├── Параметры: комиссии, лимиты
│   │   └── Оракулы: источники данных
│   │
│   └── apiConfig.ts               # Конфигурация API
│       ├── Базовый URL: окружение
│       ├── Таймауты: запросы, повторные попытки
│       ├── Заголовки: авторизация, контент
│       └── Кэширование: стратегии, время жизни
│
└── init.ts                        # Инициализация приложения
    ├── Порядок: провайдеры, сервисы, конфигурация
    ├── Проверки: окружение, зависимости
    ├── Логирование: инициализация, ошибки
    └── Оптимизация: предварительная загрузка
```

## 🔄 Потоки данных и взаимодействия

### 🔄 Основные потоки данных

```
Пользовательский интерфейс (Pages)
    ↓
Feature-модули (features/*)
    ↓
React Context (app/providers/*)
    ↓
Сервисы (features/*/services/*)
    ↓
Контракт Mixton v2.3.1 (TON Blockchain)
```

### 🔄 Взаимодействие между модулями

```
Auth Module ← → Mixer Module
    ↓              ↓
Dashboard Module ← → Admin Module
    ↓              ↓
Shared Module (UI, Utils, Services)
```

### 🔄 Жизненный цикл микширования

```
1. Пользователь открывает MixForm (mixer/components/MixForm.tsx)
2. Хук useMixing (mixer/hooks/useMixing.ts) управляет состоянием
3. Сервис mixerService (mixer/services/mixerService.ts) взаимодействует с контрактом
4. Mixton Contract (features/shared/services/contract/Mixton.ts) обрабатывает транзакцию
5. TransactionStatus (mixer/components/TransactionStatus.tsx) показывает прогресс
6. Dashboard обновляется через useDashboardStats (dashboard/hooks/useDashboardStats.ts)
```

## 🎯 Ключевые преимущества архитектуры

1. **Модульность**: Каждый функциональный блок независим и самодостаточен
2. **Масштабируемость**: Легко добавлять новые фичи без изменения существующего кода
3. **Поддерживаемость**: Четкая организация кода по функциональным областям
4. **Переиспользуемость**: Общие компоненты в shared модуле
5. **Тестируемость**: Каждый модуль можно тестировать независимо
6. **Производительность**: Оптимизированные хуки, кэширование, real-time обновления
7. **Безопасность**: Проверки авторизации, валидация данных, безопасное хранение

Эта архитектура обеспечивает профессиональную структуру проекта, соответствующую лучшим практикам разработки React приложений, и готова к масштабированию и долгосрочной поддержке.
