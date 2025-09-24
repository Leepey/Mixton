// src/features/admin/components/UserManagement.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  IconButton, 
  Button, 
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Badge,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Search, 
  MoreVert, 
  Block, 
  CheckCircle, 
  PersonOff,
  Refresh,
  Person,
  Shield,
  TrendingUp,
} from '@mui/icons-material';
import { useUserManagement } from '../hooks/useUserManagement';
import { formatAddress } from '../utils/adminUtils';
import type { AdminUser } from '../types/admin.types';

export const UserManagement: React.FC = () => {
  const { users, loading, updating, updateUserStatus, refreshUsers } = useUserManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    user: AdminUser | null;
    action: 'suspend' | 'activate' | 'ban';
  }>({ open: false, user: null, action: 'suspend' });
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin' | 'moderator'>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: AdminUser) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleStatusChange = (action: 'suspend' | 'activate' | 'ban') => {
    if (selectedUser) {
      setConfirmDialog({ open: true, user: selectedUser, action });
    }
    handleMenuClose();
  };

  const confirmStatusChange = async () => {
    if (confirmDialog.user) {
      const newStatus = 
        confirmDialog.action === 'suspend' ? 'suspended' :
        confirmDialog.action === 'activate' ? 'active' : 'banned';
      
      await updateUserStatus(confirmDialog.user.id, newStatus);
      setConfirmDialog({ open: false, user: null, action: 'suspend' });
    }
  };

  const getStatusColor = (status: AdminUser['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'warning';
      case 'banned': return 'error';
      default: return 'default';
    }
  };

  const getRoleColor = (role: AdminUser['role']) => {
    switch (role) {
      case 'admin': return 'error';
      case 'moderator': return 'info';
      case 'user': return 'default';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: AdminUser['role']) => {
    switch (role) {
      case 'admin': return <Shield />;
      case 'moderator': return <Person />;
      default: return <Person />;
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    banned: users.filter(u => u.status === 'banned').length,
    admins: users.filter(u => u.role === 'admin').length,
    moderators: users.filter(u => u.role === 'moderator').length,
    totalVolume: users.reduce((sum, user) => sum + user.totalVolume, 0),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          User Management
        </Typography>
        
        {/* Статистика пользователей */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card sx={{ background: 'linear-gradient(145deg, rgba(76, 175, 80, 0.1), rgba(0, 0, 0, 0.2))' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Person sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                <Typography variant="h6">{userStats.total}</Typography>
                <Typography variant="body2" color="text.secondary">Total Users</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card sx={{ background: 'linear-gradient(145deg, rgba(76, 175, 80, 0.1), rgba(0, 0, 0, 0.2))' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                <Typography variant="h6">{userStats.active}</Typography>
                <Typography variant="body2" color="text.secondary">Active</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card sx={{ background: 'linear-gradient(145deg, rgba(255, 152, 0, 0.1), rgba(0, 0, 0, 0.2))' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Block sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                <Typography variant="h6">{userStats.suspended}</Typography>
                <Typography variant="body2" color="text.secondary">Suspended</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card sx={{ background: 'linear-gradient(145deg, rgba(244, 67, 54, 0.1), rgba(0, 0, 0, 0.2))' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <PersonOff sx={{ fontSize: 40, color: '#F44336', mb: 1 }} />
                <Typography variant="h6">{userStats.banned}</Typography>
                <Typography variant="body2" color="text.secondary">Banned</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card sx={{ background: 'linear-gradient(145deg, rgba(33, 150, 243, 0.1), rgba(0, 0, 0, 0.2))' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Shield sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                <Typography variant="h6">{userStats.admins}</Typography>
                <Typography variant="body2" color="text.secondary">Admins</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card sx={{ background: 'linear-gradient(145deg, rgba(156, 39, 176, 0.1), rgba(0, 0, 0, 0.2))' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: '#9C27B0', mb: 1 }} />
                <Typography variant="h6">{userStats.totalVolume.toFixed(0)}</Typography>
                <Typography variant="body2" color="text.secondary">Total Volume</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Панель поиска и фильтров */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
              <MenuItem value="banned">Banned</MenuItem>
            </TextField>
            
            <TextField
              select
              label="Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="moderator">Moderator</MenuItem>
            </TextField>
          </Box>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={refreshUsers}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Paper 
        elevation={0}
        sx={{
          borderRadius: '16px',
          background: `linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.2))`,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Transactions</TableCell>
                <TableCell>Volume (TON)</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Refresh sx={{ animation: 'spin 1s linear infinite', mr: 2 }} />
                      Loading users...
                    </Box>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Person sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" color="text.secondary">
                        No users found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search or filters
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id}
                    sx={{ 
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            <Box sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: user.status === 'active' ? '#4CAF50' : 
                                             user.status === 'suspended' ? '#FF9800' : '#F44336',
                              border: '2px solid white',
                            }}
                          />
                          }
                        >
                          <Box sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: `linear-gradient(45deg, ${user.role === 'admin' ? '#F44336' : user.role === 'moderator' ? '#2196F3' : '#9E9E9E'}, ${user.role === 'admin' ? '#FF5722' : user.role === 'moderator' ? '#03A9F4' : '#BDBDBD'})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                          }}>
                            {getRoleIcon(user.role)}
                          </Box>
                        </Badge>
                        <Box>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                            {formatAddress(user.address, 8)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        size="small"
                        icon={getRoleIcon(user.role)}
                        color={getRoleColor(user.role) as any}
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status} 
                        size="small"
                        color={getStatusColor(user.status) as any}
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.totalTransactions.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.totalVolume.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, user)}
                        disabled={updating}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: '8px',
            minWidth: 200,
          }
        }}
      >
        {selectedUser?.status === 'active' && (
          <MenuItem onClick={() => handleStatusChange('suspend')} sx={{ color: '#FF9800' }}>
            <Block sx={{ mr: 1 }} /> Suspend User
          </MenuItem>
        )}
        {selectedUser?.status === 'suspended' && (
          <MenuItem onClick={() => handleStatusChange('activate')} sx={{ color: '#4CAF50' }}>
            <CheckCircle sx={{ mr: 1 }} /> Activate User
          </MenuItem>
        )}
        <MenuItem onClick={() => handleStatusChange('ban')} sx={{ color: '#F44336' }}>
          <PersonOff sx={{ mr: 1 }} /> Ban User
        </MenuItem>
      </Menu>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, user: null, action: 'suspend' })}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: '16px',
            minWidth: 400,
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          Confirm {confirmDialog.action} action
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to {confirmDialog.action} this user?
          </Alert>
          {confirmDialog.user && (
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>User:</strong> {formatAddress(confirmDialog.user.address)}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Current Status:</strong> {confirmDialog.user.status}
              </Typography>
              <Typography variant="body2">
                <strong>Role:</strong> {confirmDialog.user.role}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setConfirmDialog({ open: false, user: null, action: 'suspend' })}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmStatusChange} 
            color="primary" 
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};