
TON Mixer - это децентрализованный сервис для обеспечения приватности транзакций в сети TON. Проект позволяет пользователям смешивать свои TON, чтобы скрыть источник происхождения средств, используя смарт-контракт и три пула с разными параметрами. 
Архитектура проекта 

На основе предложенной feature-based архитектуры и текущей структуры проекта, я создам обновленную схему Mixton v2.3.1 с учетом всех компонентов и их взаимосвязей.

# 🏗️ Обновленная схема проекта Mixton v2.3.1 (Feature-Based Architecture)

## 📊 Общая структура проекта

```
src/
├── app/                          # Конфигурация приложения
│   ├── config/
│   │   └── tonConfig.ts          # Конфигурация TON
│   └── AuthContext.tsx           # Контекст аутентификации
├── assets/                       # Статические ресурсы
│   └── react.svg
├── components/                   # Общие компоненты (устаревшие, перенесены в features)
├── context/                      # Глобальные контексты
│   ├── MixerContext.tsx         # Контекст миксера
│   └── index.ts
├── features/                     # Feature-based модули
│   ├── admin/                   # Административная панель
│   │   ├── components/          # Компоненты админки
│   │   │   ├── AdminPanelLayout.tsx
│   │   │   ├── AnalyticsPanel.tsx
│   │   │   ├── ContractSettings.tsx
│   │   │   ├── ContractSettingsComponent.tsx
│   │   │   ├── SecuritySettingsComponent.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   ├── TransactionTable.tsx
│   │   │   └── AdminTransactionDetails.tsx
│   │   ├── hooks/               # Хуки админки
│   │   │   ├── useAdminAuth.ts
│   │   │   ├── useContractManagement.ts
│   │   │   ├── useUserManagement.ts
│   │   │   └── useAdminTabs.ts
│   │   ├── services/            # Сервисы админки
│   │   │   ├── adminService.ts
│   │   │   └── securityService.ts
│   │   ├── types/               # Типы админки
│   │   │   └── admin.types.ts
│   │   ├── utils/               # Утилиты админки
│   │   │   ├── adminUtils.ts
│   │   │   └── adminTabsUtils.ts
│   │   └── index.ts             # Индексный файл
│   ├── auth/                     # Аутентификация
│   │   ├── components/
│   │   │   ├── ConnectWalletModal.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useWalletAuth.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   └── walletAuthService.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   ├── utils/
│   │   │   └── authUtils.ts
│   │   └── index.ts
│   ├── dashboard/                # Дашборд пользователя
│   │   ├── components/
│   │   │   ├── PoolsModule.tsx
│   │   │   ├── QueueModule.tsx
│   │   │   ├── SettingsModule.tsx
│   │   │   ├── StatsModule.tsx
│   │   │   └── TransactionsModule.tsx
│   │   ├── hooks/
│   │   │   ├── useDashboardStats.ts
│   │   │   ├── usePoolsData.ts
│   │   │   ├── useQueueManagement.ts
│   │   │   └── useTransactionHistory.ts
│   │   ├── services/
│   │   │   ├── dashboardService.ts
│   │   │   └── queueService.ts
│   │   ├── types/
│   │   │   └── dashboard.types.ts
│   │   ├── utils/
│   │   │   ├── dashboardUtils.ts
│   │   │   └── transactionUtils.ts
│   │   └── index.ts
│   ├── home/                     # Главная страница
│   │   ├── components/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── StatsOverviewSection.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── PoolSelectionSection.tsx
│   │   │   ├── PoolCard.tsx
│   │   │   ├── RecentTransactionsSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── MissionSection.tsx
│   │   ├── hooks/
│   │   │   └── useHomeData.ts
│   │   ├── services/
│   │   │   └── homeService.ts
│   │   ├── types/
│   │   │   └── home.types.ts
│   │   ├── utils/
│   │   │   └── homeUtils.ts
│   │   └── index.ts
│   ├── mixer/                    # Миксер транзакций
│   │   ├── components/
│   │   │   ├── MixConfirmationModal.tsx
│   │   │   ├── MixForm.tsx
│   │   │   ├── QuickMixForm.tsx
│   │   │   └── TransactionStatus.tsx
│   │   ├── hooks/
│   │   │   ├── useMixer.ts
│   │   │   ├── usePoolSelection.ts
│   │   │   └── useTransaction.ts
│   │   ├── services/
│   │   │   ├── mixerService.ts
│   │   │   ├── poolService.ts
│   │   │   └── transactionService.ts
│   │   ├── types/
│   │   │   └── mixer.types.ts
│   │   ├── utils/
│   │   │   ├── poolUtils.ts
│   │   │   ├── validationUtils.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── shared/                   # Общие компоненты и утилиты
│       ├── components/
│       │   ├── ErrorBoundary.tsx
│       │   ├── ErrorBoundaryWrapper.tsx
│       │   ├── ErrorTest.tsx
│       │   ├── ProviderTester.tsx
│       │   ├── TonConnectErrorBoundary.tsx
│       │   ├── TonConnectProvider.tsx
│       │   └── ui/                    # UI компоненты
│       │       ├── cards/
│       │       │   ├── NeonCard.tsx
│       │       │   ├── MixPoolCard.tsx
│       │       │   └── PoolCard.tsx
│       │       ├── loaders/
│       │       │   ├── LoadingSpinner.tsx
│       │       │   └── TransactionLoader.tsx
│       │       ├── buttons/
│       │       │   ├── MixButton.tsx
│       │       │   └── TonConnectButton.tsx
│       │       ├── modals/
│       │       │   └── ConfirmationModal.tsx
│       │       ├── typography/
│       │       │   └── NeonText.tsx
│       │       └── layout/
│       │           ├── Footer.tsx
│       │           ├── MainLayout.tsx
│       │           └── Navbar.tsx
│       ├── hooks/
│       │   ├── useLocalStorage.ts
│       │   ├── useTonConnect.ts
│       │   └── useErrorHandler.ts
│       ├── services/
│       │   ├── contract/
│       │   │   ├── wrappers/
│       │   │   │   └── Mixton.ts
│       │   │   ├── MixerContractService.ts
│       │   │   ├── constants.ts
│       │   │   ├── types.ts
│       │   │   └── index.ts
│       │   ├── storageService.ts
│       │   ├── tonApiService.ts
│       │   ├── tonService.ts
│       │   └── index.ts
│       ├── types/
│       │   ├── common.types.ts
│       │   ├── ton.d.ts
│       │   └── index.ts
│       ├── utils/
│       │   ├── errorHandling.ts
│       │   ├── formatUtils.ts
│       │   ├── validationUtils.ts
│       │   └── index.ts
│       ├── constants/
│       │   └── contractConstants.ts
│       └── index.ts
├── hooks/                        # Глобальные хуки
│   └── useMixFormLogic.ts
├── pages/                        # Страницы приложения
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── AdminPanel.tsx
│   ├── About.tsx
│   ├── NotFound.tsx
│   └── Unauthorized.tsx
├── routes/                       # Конфигурация роутинга
│   ├── AppRoutes.tsx
│   ├── ProtectedRoutes.tsx
│   └── PublicRoutes.tsx
├── styles/                       # Стили
│   ├── global.css
│   ├── neon.css
│   └── theme.ts
├── utils/                        # Глобальные утилиты
│   └── errorHandling.ts
├── App.css
├── App.tsx
├── index.css
├── main.tsx
├── polyfills.ts
├── vite-env.d.ts
└── README.md
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