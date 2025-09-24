// src/features/admin/components/AnalyticsPanel.tsx
import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress as MuiCircularProgress, // Импортируем с псевдонимом
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Refresh,
  TrendingUp,
  TrendingDown,
  AccountBalance,
  People,
  Paid,
  ShowChart,
  CalendarToday,
  Download,
  FilterList,
  ArrowUpward,
  ArrowDownward,
  Info,
} from '@mui/icons-material';
import { adminService } from '../services/adminService';
import type { AnalyticsData } from '../types/admin.types';

interface TimeRange {
  label: string;
  value: '7d' | '30d' | '90d' | '1y';
}

const timeRanges: TimeRange[] = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: '1 Year', value: '1y' },
];

export const AnalyticsPanel: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange['value']>('30d');
  const [activeTab, setActiveTab] = useState(0);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnalytics();
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!analytics) return [];
    
    const days = selectedTimeRange === '7d' ? 7 : 
                 selectedTimeRange === '30d' ? 30 : 
                 selectedTimeRange === '90d' ? 90 : 365;
    
    return analytics.transactionHistory.slice(0, days);
  }, [analytics, selectedTimeRange]);

  const calculateTrend = (data: number[]): { trend: 'up' | 'down' | 'stable'; percentage: number } => {
    if (data.length < 2) return { trend: 'stable', percentage: 0 };
    
    const recent = data.slice(0, Math.ceil(data.length / 2)).reduce((a, b) => a + b, 0);
    const older = data.slice(Math.ceil(data.length / 2)).reduce((a, b) => a + b, 0);
    
    if (older === 0) return { trend: 'up', percentage: 100 };
    
    const percentage = ((recent - older) / older) * 100;
    
    if (percentage > 1) return { trend: 'up', percentage };
    if (percentage < -1) return { trend: 'down', percentage: Math.abs(percentage) };
    return { trend: 'stable', percentage: 0 };
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage > 80) return 'error';
    if (percentage > 60) return 'warning';
    return 'success';
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  if (loading || !analytics) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Refresh sx={{ fontSize: 48, animation: 'spin 1s linear infinite', color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Loading analytics data...
        </Typography>
      </Box>
    );
  }

  const depositTrend = calculateTrend(analytics.transactionHistory.map(t => t.deposits));
  const withdrawalTrend = calculateTrend(analytics.transactionHistory.map(t => t.withdrawals));
  const volumeTrend = calculateTrend(analytics.transactionHistory.map(t => t.volume));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Analytics Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={selectedTimeRange}
                label="Time Range"
                onChange={(e) => setSelectedTimeRange(e.target.value as TimeRange['value'])}
              >
                {timeRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchAnalytics}
              disabled={loading}
            >
              Refresh
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Download />}
              disabled={loading}
            >
              Export
            </Button>
          </Box>
        </Box>

        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ 
            mb: 3,
            '& .MuiTab-root': {
              textTransform: 'none',
            }
          }}
        >
          <Tab label="Overview" />
          <Tab label="Transactions" />
          <Tab label="Pools" />
          <Tab label="Performance" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Key Metrics */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Card 
              elevation={0}
              sx={{
                borderRadius: '16px',
                background: `linear-gradient(145deg, rgba(33, 150, 243, 0.1), rgba(0, 0, 0, 0.2))`,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(33, 150, 243, 0.2)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <CardHeader 
                title="Total Deposits" 
                avatar={<AccountBalance />}
                titleTypographyProps={{ variant: 'h6' }}
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center', color: depositTrend.trend === 'up' ? 'success.main' : 'error.main' }}>
                    {depositTrend.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {depositTrend.percentage.toFixed(1)}%
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {analytics.totalDeposits.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total deposit transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card 
              elevation={0}
              sx={{
                borderRadius: '16px',
                background: `linear-gradient(145deg, rgba(76, 175, 80, 0.1), rgba(0, 0, 0, 0.2))`,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(76, 175, 80, 0.2)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <CardHeader 
                title="Total Withdrawn" 
                avatar={<Paid />}
                titleTypographyProps={{ variant: 'h6' }}
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center', color: withdrawalTrend.trend === 'up' ? 'success.main' : 'error.main' }}>
                    {withdrawalTrend.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {withdrawalTrend.percentage.toFixed(1)}%
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {analytics.totalWithdrawn.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total withdrawal transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card 
              elevation={0}
              sx={{
                borderRadius: '16px',
                background: `linear-gradient(145deg, rgba(156, 39, 176, 0.1), rgba(0, 0, 0, 0.2))`,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(156, 39, 176, 0.2)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <CardHeader 
                title="Active Users" 
                avatar={<People />}
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {analytics.activeUsers.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Users in the last 30 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card 
              elevation={0}
              sx={{
                borderRadius: '16px',
                background: `linear-gradient(145deg, rgba(255, 193, 7, 0.1), rgba(0, 0, 0, 0.2))`,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 193, 7, 0.2)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <CardHeader 
                title="Fees Collected" 
                avatar={<ShowChart />}
                titleTypographyProps={{ variant: 'h6' }}
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center', color: volumeTrend.trend === 'up' ? 'success.main' : 'error.main' }}>
                    {volumeTrend.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {volumeTrend.percentage.toFixed(1)}%
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {formatCurrency(analytics.feesCollected)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total fees collected
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Pool Utilization */}
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
                title="Pool Utilization" 
                titleTypographyProps={{ variant: 'h6' }}
                action={
                  <Tooltip title="Pool utilization shows how much of each pool's capacity is currently being used">
                    <IconButton size="small">
                      <Info />
                    </IconButton>
                  </Tooltip>
                }
              />
              <CardContent>
                <List>
                  {Object.entries(analytics.poolUtilization).map(([pool, utilization]) => (
                    <React.Fragment key={pool}>
                      <ListItem>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {pool.charAt(0).toUpperCase() + pool.slice(1)} Pool
                              </Typography>
                              <Chip 
                                label={`${utilization}%`}
                                color={getUtilizationColor(utilization) as any}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {utilization > 80 ? 'High utilization - consider expanding capacity' :
                                 utilization > 60 ? 'Moderate utilization' : 'Low utilization'}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <LinearProgress 
                        variant="determinate" 
                        value={utilization}
                        sx={{ 
                          mb: 2,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: 
                              utilization > 80 ? '#f44336' :
                              utilization > 60 ? '#ff9800' : '#4caf50',
                            borderRadius: 4,
                          }
                        }}
                      />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
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
                title="Recent Activity" 
                titleTypographyProps={{ variant: 'h6' }}
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Last {selectedTimeRange === '7d' ? '7' : selectedTimeRange === '30d' ? '30' : selectedTimeRange === '90d' ? '90' : '365'} days
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <List>
                  {filteredTransactions.slice(0, 5).map((transaction) => (
                    <React.Fragment key={transaction.date}>
                      <ListItem>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {new Date(transaction.date).toLocaleDateString()}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip 
                                  label={`${transaction.deposits} deposits`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                                <Chip 
                                  label={`${transaction.withdrawals} withdrawals`}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              Volume: {formatCurrency(transaction.volume)}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
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
            title="Transaction History" 
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Filter</InputLabel>
                  <Select
                    value="all"
                    label="Filter"
                  >
                    <MenuItem value="all">All Transactions</MenuItem>
                    <MenuItem value="deposits">Deposits Only</MenuItem>
                    <MenuItem value="withdrawals">Withdrawals Only</MenuItem>
                  </Select>
                </FormControl>
                <Button size="small" startIcon={<Download />}>
                  Export CSV
                </Button>
              </Box>
            }
          />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Deposits</TableCell>
                    <TableCell>Withdrawals</TableCell>
                    <TableCell>Volume (TON)</TableCell>
                    <TableCell>Avg Transaction</TableCell>
                    <TableCell>Trend</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.date}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={transaction.deposits}
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={transaction.withdrawals}
                          size="small"
                          color="secondary"
                        />
                      </TableCell>
                      <TableCell>
                        {transaction.volume.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {((transaction.volume) / (transaction.deposits + transaction.withdrawals)).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {transaction.deposits > transaction.withdrawals ? 
                          <TrendingUp color="success" /> : 
                          <TrendingDown color="error" />
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
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
                title="Pool Performance" 
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  {Object.entries(analytics.poolUtilization).map(([pool, utilization]) => (
                    <Grid size={{ xs: 12, md: 4 }} key={pool}>
                      <Paper 
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: '12px',
                          background: `linear-gradient(145deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.1))`,
                          border: `1px solid ${utilization > 80 ? 'rgba(244, 67, 54, 0.3)' : utilization > 60 ? 'rgba(255, 152, 0, 0.3)' : 'rgba(76, 175, 80, 0.3)'}`,
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          {pool.charAt(0).toUpperCase() + pool.slice(1)} Pool
                        </Typography>
                        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                          <MuiCircularProgress  // Используем стандартный компонент MUI
                            variant="determinate"
                            value={utilization}
                            size={80}
                            thickness={6}
                            sx={{
                              color: utilization > 80 ? '#f44336' : utilization > 60 ? '#ff9800' : '#4caf50',
                            }}
                          />
                          <Box
                            sx={{
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                              position: 'absolute',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                              {`${utilization}%`}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {utilization > 80 ? 'High utilization' :
                           utilization > 60 ? 'Moderate utilization' : 'Optimal utilization'}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
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
                title="Performance Metrics" 
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Average Transaction Time"
                      secondary="2.3 seconds"
                    />
                    <Chip label="Excellent" color="success" size="small" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Success Rate"
                      secondary="99.7%"
                    />
                    <Chip label="Excellent" color="success" size="small" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Gas Efficiency"
                      secondary="15% below average"
                    />
                    <Chip label="Good" color="info" size="small" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Pool Distribution"
                      secondary="Well balanced"
                    />
                    <Chip label="Optimal" color="success" size="small" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

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
                title="System Health" 
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Network Status"
                      secondary="All nodes operational"
                    />
                    <Chip label="Online" color="success" size="small" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Contract Health"
                      secondary="No issues detected"
                    />
                    <Chip label="Healthy" color="success" size="small" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Security Score"
                      secondary="95/100"
                    />
                    <Chip label="Excellent" color="success" size="small" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Last Audit"
                      secondary="3 days ago"
                    />
                    <Chip label="Recent" color="info" size="small" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </motion.div>
  );
};