// features/admin/components/AdminTransactionDetails.tsx
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Chip,
  Divider,
  Paper,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { 
  CheckCircle, 
  HourglassEmpty, 
  Warning,
  CopyAll,
  Close,
  OpenInNew
} from '@mui/icons-material';
import type { Transaction } from '../types/admin.types';
import { getTransactionStatusColor } from '../utils/adminUtils';
import { formatAmount, formatTimeAgo, formatAddress } from '../../shared/utils/formatUtils';

interface AdminTransactionDetailsProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

// Функция для безопасного получения цвета чипа
const getChipColor = (color: string): "default" | "primary" | "secondary" | "success" | "error" | "info" | "warning" => {
  const validColors = ["default", "primary", "secondary", "success", "error", "info", "warning"] as const;
  return validColors.includes(color as any) ? color as any : "default";
};

export const AdminTransactionDetails: React.FC<AdminTransactionDetailsProps> = ({ 
  open, 
  onClose, 
  transaction 
}) => {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusIcon = {
    completed: <CheckCircle />,
    pending: <HourglassEmpty />,
    failed: <Warning />
  }[transaction.status];

  const openInExplorer = (address: string) => {
    window.open(`https://tonscan.org/address/${address}`, '_blank');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Transaction Details
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Paper 
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '12px',
            mb: 3,
            background: alpha(theme.palette.background.paper, 0.5)
          }}
        >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Transaction ID
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {transaction.id}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => handleCopy(transaction.id)}
                  color={copied ? 'success' : 'default'}
                >
                  <CopyAll fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Status
              </Typography>
              <Chip 
                label={transaction.status} 
                size="small"
                icon={statusIcon}
                color={getChipColor(getTransactionStatusColor(transaction.status))}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Amount
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {formatAmount(transaction.amount)} TON
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Fee
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {formatAmount(transaction.fee)} TON
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Pool
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {transaction.pool}
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Timestamp
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {new Date(transaction.timestamp * 1000).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatTimeAgo(transaction.timestamp * 1000)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        
        {transaction.inputAddress && (
          <Paper 
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '12px',
              mb: 3,
              background: alpha(theme.palette.background.paper, 0.5)
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Input Address
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', flex: 1 }}>
                {transaction.inputAddress}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => transaction.inputAddress && handleCopy(transaction.inputAddress)}
                color={copied ? 'success' : 'default'}
              >
                <CopyAll fontSize="small" />
              </IconButton>
              <Tooltip title="View in Explorer">
                <IconButton 
                  size="small" 
                  onClick={() => transaction.inputAddress && openInExplorer(transaction.inputAddress)}
                >
                  <OpenInNew fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        )}
        
        {transaction.outputAddresses && transaction.outputAddresses.length > 0 && (
          <Paper 
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '12px',
              background: alpha(theme.palette.background.paper, 0.5)
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Output Addresses ({transaction.outputAddresses.length})
            </Typography>
            {transaction.outputAddresses.map((address, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', flex: 1 }}>
                    {address}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopy(address)}
                    color={copied ? 'success' : 'default'}
                  >
                    <CopyAll fontSize="small" />
                  </IconButton>
                  <Tooltip title="View in Explorer">
                    <IconButton 
                      size="small" 
                      onClick={() => openInExplorer(address)}
                    >
                      <OpenInNew fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Paper>
        )}
        
        {transaction.note && (
          <Paper 
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '12px',
              background: alpha(theme.palette.background.paper, 0.5)
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Note
            </Typography>
            <Typography variant="body1">
              {transaction.note}
            </Typography>
          </Paper>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: '8px',
            background: `linear-gradient(45deg, #FF5722, #FFC107)`,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};