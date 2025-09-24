// src/features/admin/components/SecuritySettingsComponent.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Grid,
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Alert,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Save, 
  Refresh,
  Security,
  Add,
  Delete,
  Block,
  CheckCircle,
} from '@mui/icons-material';
import { securityService } from '../services/securityService';
import type { SecuritySettings } from '../types/admin.types';
import { validateAdminAddress } from '../utils/adminUtils';

export const SecuritySettingsComponent: React.FC = () => {
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newBlacklistAddress, setNewBlacklistAddress] = useState('');
  const [newSignerAddress, setNewSignerAddress] = useState('');
  const [blacklistError, setBlacklistError] = useState('');
  const [signerError, setSignerError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'blacklist' | 'signer';
    action: 'add' | 'remove';
    address: string;
  }>({ open: false, type: 'blacklist', action: 'add', address: '' });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await securityService.getSecuritySettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch security settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: SecuritySettings) => {
    setUpdating(true);
    try {
      await securityService.updateSecuritySettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to update security settings:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleSetting = (field: keyof SecuritySettings) => {
    if (!settings) return;
    updateSettings({
      ...settings,
      [field]: !settings[field],
    });
  };

  const handleAddToBlacklist = () => {
    if (!validateAdminAddress(newBlacklistAddress)) {
      setBlacklistError('Invalid address format');
      return;
    }
    
    if (settings?.blacklist.includes(newBlacklistAddress)) {
      setBlacklistError('Address already in blacklist');
      return;
    }

    setConfirmDialog({
      open: true,
      type: 'blacklist',
      action: 'add',
      address: newBlacklistAddress,
    });
  };

  const handleRemoveFromBlacklist = (address: string) => {
    setConfirmDialog({
      open: true,
      type: 'blacklist',
      action: 'remove',
      address,
    });
  };

  const handleAddSigner = () => {
    if (!validateAdminAddress(newSignerAddress)) {
      setSignerError('Invalid address format');
      return;
    }
    
    if (settings?.signers.includes(newSignerAddress)) {
      setSignerError('Address already a signer');
      return;
    }

    setConfirmDialog({
      open: true,
      type: 'signer',
      action: 'add',
      address: newSignerAddress,
    });
  };

  const handleRemoveSigner = (address: string) => {
    setConfirmDialog({
      open: true,
      type: 'signer',
      action: 'remove',
      address,
    });
  };

  const confirmAction = async () => {
    if (!settings) return;

    try {
      if (confirmDialog.type === 'blacklist') {
        if (confirmDialog.action === 'add') {
          await securityService.addToBlacklist(confirmDialog.address);
          setSettings({
            ...settings,
            blacklist: [...settings.blacklist, confirmDialog.address],
          });
          setNewBlacklistAddress('');
        } else {
          await securityService.removeFromBlacklist(confirmDialog.address);
          setSettings({
            ...settings,
            blacklist: settings.blacklist.filter(addr => addr !== confirmDialog.address),
          });
        }
      } else {
        if (confirmDialog.action === 'add') {
          await securityService.addSigner(confirmDialog.address);
          setSettings({
            ...settings,
            signers: [...settings.signers, confirmDialog.address],
          });
          setNewSignerAddress('');
        } else {
          await securityService.removeSigner(confirmDialog.address);
          setSettings({
            ...settings,
            signers: settings.signers.filter(addr => addr !== confirmDialog.address),
          });
        }
      }
    } catch (error) {
      console.error('Failed to perform action:', error);
    } finally {
      setConfirmDialog({ open: false, type: 'blacklist', action: 'add', address: '' });
    }
  };

  React.useEffect(() => {
    fetchSettings();
  }, []);

  if (loading || !settings) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading security settings...</Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Security Settings
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchSettings}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => updateSettings(settings)}
            disabled={updating}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Security Options */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px',
              background: `linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.2))`,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardHeader 
              title="Security Options" 
              avatar={<Security />}
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Auto Process Transactions" 
                    secondary="Automatically process pending transactions"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.autoProcess}
                      onChange={() => handleToggleSetting('autoProcess')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Audit Logging" 
                    secondary="Log all administrative actions"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.auditLogging}
                      onChange={() => handleToggleSetting('auditLogging')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Required Signatures" 
                    secondary={`Currently requires ${settings.requiredSignatures} signatures`}
                  />
                  <Chip 
                    label={settings.requiredSignatures}
                    color="primary"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Max Retries" 
                    secondary="Maximum number of retry attempts"
                  />
                  <Chip 
                    label={settings.maxRetries}
                    color="secondary"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Blacklist */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px',
              background: `linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.2))`,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardHeader 
              title="Blacklist" 
              avatar={<Block />}
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Address to Blacklist"
                  value={newBlacklistAddress}
                  onChange={(e) => setNewBlacklistAddress(e.target.value)}
                  error={!!blacklistError}
                  helperText={blacklistError}
                  InputProps={{
                    endAdornment: (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleAddToBlacklist}
                        startIcon={<Add />}
                      >
                        Add
                      </Button>
                    ),
                  }}
                />
              </Box>
              
              <List>
                {settings.blacklist.map((address) => (
                  <ListItem key={address}>
                    <ListItemText 
                      primary={address}
                      primaryTypographyProps={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveFromBlacklist(address)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                {settings.blacklist.length === 0 && (
                  <ListItem>
                    <ListItemText 
                      primary="No addresses in blacklist"
                      secondary="Add addresses to block them from using the mixer"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Signers */}
        <Grid size={{ xs: 12 }}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px',
              background: `linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.2))`,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardHeader 
              title="Authorized Signers" 
              avatar={<CheckCircle />}
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Authorized Signer"
                  value={newSignerAddress}
                  onChange={(e) => setNewSignerAddress(e.target.value)}
                  error={!!signerError}
                  helperText={signerError}
                  InputProps={{
                    endAdornment: (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleAddSigner}
                        startIcon={<Add />}
                      >
                        Add
                      </Button>
                    ),
                  }}
                />
              </Box>
              
              <List>
                {settings.signers.map((address) => (
                  <ListItem key={address}>
                    <ListItemText 
                      primary={address}
                      primaryTypographyProps={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveSigner(address)}
                        disabled={settings.signers.length <= settings.requiredSignatures}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: 'blacklist', action: 'add', address: '' })}
      >
        <DialogTitle>
          Confirm {confirmDialog.action} action
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Are you sure you want to {confirmDialog.action} this address from {confirmDialog.type}?
          </Alert>
          <Typography variant="body2" sx={{ mt: 2, fontFamily: 'monospace' }}>
            {confirmDialog.address}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, type: 'blacklist', action: 'add', address: '' })}>
            Cancel
          </Button>
          <Button onClick={confirmAction} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}