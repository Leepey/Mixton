// features/admin/components/TransactionTable.tsx
import React, { useState } from 'react';
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
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
  const [filterStatus, setFilterStatus] = useState<string>('all');
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

  // Получение отсортированных и отфильтрованных транзакций
  const getSortedAndFilteredTransactions = () => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = 
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.inputAddress && transaction.inputAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.outputAddresses && transaction.outputAddresses.some(addr => 
          addr.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      
      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

  const sortedAndFilteredTransactions = getSortedAndFilteredTransactions();
  
  // Пагинация
  const paginatedTransactions = sortedAndFilteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
  const SortableTableCell: React.FC<{
    children: React.ReactNode;
    sortKey: keyof Transaction;
  }> = ({ children, sortKey }) => {
    const isSorted = sortConfig?.key === sortKey;
    const direction = isSorted ? sortConfig.direction : undefined;

    return (
      <TableCell 
        onClick={() => handleSort(sortKey)}
        sx={{ 
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': { backgroundColor: alpha(theme.palette.action.hover, 0.05) },
          fontWeight: isSorted ? 600 : 'inherit'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {children}
          {isSorted && (
            <Typography variant="caption" color="text.secondary">
              {direction === 'asc' ? '↑' : '↓'}
            </Typography>
          )}
        </Box>
      </TableCell>
    );
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Loading transactions...</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Панель управления */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
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
          startIcon={<FilterList />}
          onClick={handleFilterMenuOpen}
          sx={{ 
            borderRadius: '8px',
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
          }}
        >
          Filter
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
          sx={{ 
            borderRadius: '8px',
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
          }}
        >
          Export
        </Button>
        
        {onRefresh && (
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onRefresh}
            sx={{ 
              borderRadius: '8px',
              borderColor: alpha(theme.palette.primary.main, 0.5),
              color: theme.palette.primary.main,
            }}
          >
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            All Statuses
            {filterStatus === 'all' && <CheckCircle fontSize="small" color="success" />}
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleFilterStatusChange('completed')}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Completed
            {filterStatus === 'completed' && <CheckCircle fontSize="small" color="success" />}
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleFilterStatusChange('pending')}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Pending
            {filterStatus === 'pending' && <CheckCircle fontSize="small" color="success" />}
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleFilterStatusChange('failed')}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Failed
            {filterStatus === 'failed' && <CheckCircle fontSize="small" color="success" />}
          </Box>
        </MenuItem>
      </Menu>

      {/* Статистика */}
      <Box sx={{ mb: 3, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary">
          Total: {sortedAndFilteredTransactions.length} transactions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Showing: {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, sortedAndFilteredTransactions.length)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Filtered by: {filterStatus === 'all' ? 'All statuses' : filterStatus}
        </Typography>
      </Box>

      {/* Таблица транзакций */}
      <Paper 
        elevation={0}
        sx={{
          borderRadius: '16px',
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#FF5722', 0.2)}`,
          overflow: 'hidden'
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <SortableTableCell sortKey="id">ID</SortableTableCell>
                <SortableTableCell sortKey="amount">Amount</SortableTableCell>
                <SortableTableCell sortKey="fee">Fee</SortableTableCell>
                <TableCell>Status</TableCell>
                <SortableTableCell sortKey="pool">Pool</SortableTableCell>
                <SortableTableCell sortKey="timestamp">Time</SortableTableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx) => (
                  <TableRow 
                    key={tx.id}
                    sx={{ 
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.action.hover, 0.05)
                      }
                    }}
                  >
                    <TableCell>
                      <Tooltip title={tx.id}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {tx.id.substring(0, 8)}...
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {formatAmount(tx.amount)} TON
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {formatAmount(tx.fee)} TON
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TransactionStatusChip status={tx.status as 'completed' | 'pending' | 'failed'} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {tx.pool}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={new Date(tx.timestamp * 1000).toLocaleString()}>
                        <Typography variant="body2" color="text.secondary">
                          {formatTimeAgo(tx.timestamp * 1000)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewDetails(tx)}
                          sx={{ 
                            color: theme.palette.primary.main,
                            '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More Actions">
                        <IconButton 
                          size="small" 
                          sx={{ 
                            color: theme.palette.text.secondary,
                            '&:hover': { backgroundColor: alpha(theme.palette.action.hover, 0.1) }
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {transactions.length === 0 ? 'No transactions found' : 'No transactions match your filters'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Пагинация */}
        {sortedAndFilteredTransactions.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={sortedAndFilteredTransactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ 
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          />
        )}
      </Paper>

      {/* Диалог с деталями транзакции */}
      <AdminTransactionDetails 
        open={detailsOpen}
        onClose={handleCloseDetails}
        transaction={selectedTransaction}
      />
    </>
  );
};