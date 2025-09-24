// src/components/transactions/TransactionDetails.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Link,
} from '@mui/material';
import type { MixTransaction } from '../../types/mixer';
import { formatTimestamp, formatAddress } from '../../utils/formatUtils';

interface TransactionDetailsProps {
  open: boolean;
  onClose: () => void;
  transaction: MixTransaction | null;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ 
  open, 
  onClose, 
  transaction 
}) => {
  if (!transaction) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'failed': return 'error';
      default: return 'warning';
    }
  };

  // Функция для создания ссылки на эксплорер TON
  const getExplorerLink = (hash: string) => {
    return `https://tonscan.org/tx/${hash}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: '1.5rem', 
        fontWeight: 700,
        background: 'linear-gradient(to right, #00d4fe, #4facfe)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Transaction Details
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Transaction Information
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {transaction.id}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip 
                    label={transaction.status}
                    color={getStatusColor(transaction.status)}
                    size="small"
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body1">
                    {formatTimestamp(transaction.timestamp)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Amount Details
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {transaction.amount} TON
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Pool ID
                  </Typography>
                  <Typography variant="body1">
                    {transaction.poolId}
                  </Typography>
                </Box>
                {transaction.inputAddress && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Sender Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {formatAddress(transaction.inputAddress)}
                    </Typography>
                  </Box>
                )}
                {transaction.outputAddress && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Recipient Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {formatAddress(transaction.outputAddress)}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Блок с дополнительной информацией */}
          <Grid size={{ xs: 12 }}>
            <Card sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
                
                {/* Хеш транзакции */}
                {transaction.txHash && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Transaction Hash
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontFamily: 'monospace', 
                        wordBreak: 'break-all',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      {transaction.txHash}
                      <Link 
                        href={getExplorerLink(transaction.txHash)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ 
                          fontSize: '0.875rem',
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        View in Explorer
                      </Link>
                    </Typography>
                  </Box>
                )}
                
                {/* Заметка */}
                {transaction.note && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Note
                    </Typography>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      {transaction.note}
                    </Typography>
                  </Box>
                )}
                
                {/* Если нет дополнительной информации */}
                {!transaction.txHash && !transaction.note && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      No additional information available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetails;