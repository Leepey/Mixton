// src/features/admin/components/TransactionTable.tsx
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  TablePagination,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
  Chip,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material';
import {
  CheckCircle,
  HourglassEmpty,
  Warning,
  Visibility,
  Search,
  FilterList,
  Download,
  Refresh,
  MoreVert
} from '@mui/icons-material';
import type { Transaction } from '../types/admin.types';
import { TransactionStatusChip } from '../../shared/components/ui/TransactionStatusChip';
import { AdminTransactionDetails } from './AdminTransactionDetails';
import { formatTimeAgo, formatAmount } from '../../shared/utils/formatUtils';

interface TransactionTableProps {
  transactions: Transaction[];
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  loading = false, 
  onRefresh, 
  onExport 
}) => {
  const theme = useTheme();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' } | null>(null);

  // Обработчик просмотра деталей транзакции
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
  };

  // Закрытие диалога с деталями
  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedTransaction(null);
  };

  // Сортировка транзакций
  const handleSort = (key: keyof Transaction) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Получение отсортированных и отфильтрованных транзакций с использованием useMemo
  const sortedAndFilteredTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.inputAddress && transaction.inputAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.outputAddresses && transaction.outputAddresses.some(addr => addr.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        // Безопасное получение значений для сортировки
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // Обработка разных типов данных
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' 
            ? aValue - bValue
            : bValue - aValue;
        }
        
        // Для других типов сравниваем как строки
        const aStr = String(aValue || '');
        const bStr = String(bValue || '');
        return sortConfig.direction === 'asc' 
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return filtered;
  }, [transactions, searchTerm, filterStatus, sortConfig]);

  // Пагинация
  const paginatedTransactions = useMemo(() => {
    return sortedAndFilteredTransactions.slice(
      page * rowsPerPage, 
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedAndFilteredTransactions, page, rowsPerPage]);

  // Обработчик открытия меню фильтров
  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  // Обработчик закрытия меню фильтров
  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  // Обработчик изменения статуса фильтра
  const handleFilterStatusChange = (status: string) => {
    setFilterStatus(status);
    setFilterMenuAnchor(null);
    setPage(0);
  };

  // Обработчик изменения страницы
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Обработчик изменения количества строк на странице
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Обработчик экспорта данных
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      const csvContent = [
        ['ID', 'Amount', 'Fee', 'Status', 'Timestamp', 'Pool', 'Input Address', 'Output Addresses'].join(','),
        ...sortedAndFilteredTransactions.map(tx => [
          tx.id,
          tx.amount,
          tx.fee,
          tx.status,
          new Date(tx.timestamp * 1000).toLocaleString(),
          tx.pool,
          tx.inputAddress || '',
          tx.outputAddresses?.join(';') || ''
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Компонент сортируемой ячейки таблицы
  const SortableTableCell: React.FC<{ children: React.ReactNode; sortKey: keyof Transaction; }> = ({ 
    children, 
    sortKey 
  }) => {
    const isSorted = sortConfig?.key === sortKey;
    const direction = isSorted ? sortConfig.direction : undefined;

    return (
      <TableCell
        onClick={() => handleSort(sortKey)}
        sx={{ 
          cursor: 'pointer', 
          userSelect: 'none',
          '&:hover': { 
            backgroundColor: alpha(theme.palette.action.hover, 0.05) 
          },
          fontWeight: isSorted ? 600 : 'inherit'
        }}
      >
        {children}
        {isSorted && (
          <Box component="span" sx={{ ml: 1 }}>
            {direction === 'asc' ? '↑' : '↓'}
          </Box>
        )}
      </TableCell>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading transactions...</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Панель управления */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          variant="outlined"
          onClick={handleFilterMenuOpen}
          sx={{ 
            borderRadius: '8px', 
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
          }}
        >
          <FilterList sx={{ mr: 1 }} />
          Filter
        </Button>

        <Button
          variant="outlined"
          onClick={handleExport}
          sx={{ 
            borderRadius: '8px', 
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
          }}
        >
          <Download sx={{ mr: 1 }} />
          Export
        </Button>

        {onRefresh && (
          <Button
            variant="outlined"
            onClick={onRefresh}
            sx={{ 
              borderRadius: '8px', 
              borderColor: alpha(theme.palette.primary.main, 0.5),
              color: theme.palette.primary.main,
            }}
          >
            <Refresh sx={{ mr: 1 }} />
            Refresh
          </Button>
        )}
      </Box>

      {/* Меню фильтров */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterMenuClose}
      >
        <MenuItem onClick={() => handleFilterStatusChange('all')}>
          All Statuses
          {filterStatus === 'all' && ' ✓'}
        </MenuItem>
        <MenuItem onClick={() => handleFilterStatusChange('completed')}>
          Completed
          {filterStatus === 'completed' && ' ✓'}
        </MenuItem>
        <MenuItem onClick={() => handleFilterStatusChange('pending')}>
          Pending
          {filterStatus === 'pending' && ' ✓'}
        </MenuItem>
        <MenuItem onClick={() => handleFilterStatusChange('failed')}>
          Failed
          {filterStatus === 'failed' && ' ✓'}
        </MenuItem>
      </Menu>

      {/* Статистика */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Chip 
          label={`Total: ${sortedAndFilteredTransactions.length} transactions`} 
          color="primary" 
          variant="outlined" 
        />
        <Chip 
          label={`Showing: ${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, sortedAndFilteredTransactions.length)}`} 
          color="secondary" 
          variant="outlined" 
        />
        <Chip 
          label={`Filtered by: ${filterStatus === 'all' ? 'All statuses' : filterStatus}`} 
          color="info" 
          variant="outlined" 
        />
      </Box>

      {/* Таблица транзакций */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <SortableTableCell sortKey="id">ID</SortableTableCell>
              <SortableTableCell sortKey="amount">Amount</SortableTableCell>
              <SortableTableCell sortKey="fee">Fee</SortableTableCell>
              <SortableTableCell sortKey="status">Status</SortableTableCell>
              <SortableTableCell sortKey="pool">Pool</SortableTableCell>
              <SortableTableCell sortKey="timestamp">Time</SortableTableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => (
                <TableRow key={tx.id} hover>
                  <TableCell sx={{ fontFamily: 'monospace' }}>
                    {tx.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{formatAmount(tx.amount)} TON</TableCell>
                  <TableCell>{formatAmount(tx.fee)} TON</TableCell>
                  <TableCell>
                    <TransactionStatusChip status={tx.status} />
                  </TableCell>
                  <TableCell>{tx.pool}</TableCell>
                  <TableCell>{formatTimeAgo(tx.timestamp * 1000)}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewDetails(tx)}
                        sx={{ 
                          color: theme.palette.primary.main,
                          '&:hover': { 
                            backgroundColor: alpha(theme.palette.primary.main, 0.1) 
                          }
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    {transactions.length === 0 ? 'No transactions found' : 'No transactions match your filters'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Пагинация */}
      {sortedAndFilteredTransactions.length > 0 && (
        <TablePagination
          component={Box}
          count={sortedAndFilteredTransactions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{ 
            mt: 2, 
            '.MuiTablePagination-toolbar': { 
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.05)
            }
          }}
        />
      )}

      {/* Диалог с деталями транзакции */}
      <AdminTransactionDetails
        open={detailsOpen}
        onClose={handleCloseDetails}
        transaction={selectedTransaction}
      />
    </>
  );
};