// src/features/home/components/MissionSection.tsx
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
  type CardProps
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Security,
  Speed,
  VerifiedUser,
  PrivacyTip,
  Language,
  TrendingUp
} from '@mui/icons-material';
import { NeonText } from '../../shared/components/ui/typography/NeonText';

interface MissionValueProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const MissionValue: React.FC<MissionValueProps> = ({ icon, title, description }) => {
  const theme = useTheme();

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      sx={{
        height: '100%',
        background: alpha(theme.palette.background.paper, 0.05),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 10px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Box
          sx={{
            fontSize: '3rem',
            color: theme.palette.primary.main,
            mb: 2,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="h6"
          component="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const MissionSection: React.FC = () => {
  const theme = useTheme();

  // Ценности проекта
  const values = [
    {
      icon: <Security />,
      title: "Security First",
      description: "Military-grade encryption and advanced security protocols to protect your assets and privacy."
    },
    {
      icon: <PrivacyTip />,
      title: "Complete Privacy",
      description: "Zero-knowledge proofs and advanced mixing techniques ensure your transactions remain anonymous."
    },
    {
      icon: <Speed />,
      title: "Lightning Fast",
      description: "Optimized algorithms and TON's high-speed network ensure quick transaction processing."
    },
    {
      icon: <VerifiedUser />,
      title: "Trustworthy",
      description: "Open-source code, audited smart contracts, and transparent operations you can verify."
    },
    {
      icon: <Language />,
      title: "Global Access",
      description: "Available worldwide with no restrictions, supporting the global TON community."
    },
    {
      icon: <TrendingUp />,
      title: "Continuous Innovation",
      description: "Constantly evolving with the latest privacy technologies and user feedback."
    }
  ];

  return (
    <Box
      component="section"
      id="mission-section"
      sx={{
        py: 10,
        background: 'linear-gradient(180deg, #16213e 0%, #0f3460 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238BC34A' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }
      }}
    >
      <Container maxWidth="xl">
        {/* Заголовок секции */}
        <Box textAlign="center" mb={8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <NeonText
              variant="h2"
              component="h2"
              color={theme.palette.primary.main}
              sx={{ mb: 3 }}
            >
              Our Mission
            </NeonText>
            <Typography
              variant="h5"
              color="text.secondary"
              maxWidth={800}
              mx="auto"
              lineHeight={1.6}
            >
              We're building the future of financial privacy on the TON blockchain. 
              Our mission is to empower individuals with complete control over their 
              financial privacy while maintaining the highest standards of security 
              and transparency.
            </Typography>
          </motion.div>
        </Box>

        {/* Основное описание миссии */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          sx={{
            mb: 8,
            p: 4,
            borderRadius: 4,
            background: alpha(theme.palette.primary.main, 0.05),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{
                  color: theme.palette.primary.main,
                  mb: 3,
                }}
              >
                Why Mixton Exists
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                In an era where financial privacy is increasingly under threat, 
                Mixton stands as a beacon of hope for those who value their right 
                to financial sovereignty. We believe that everyone should have the 
                ability to transact privately and securely without compromising 
                on transparency or trust.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our advanced mixing technology, built on the robust TON blockchain, 
                ensures that your transactions remain completely confidential while 
                maintaining the integrity and security of the network.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component={motion.div}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                sx={{
                  height: 300,
                  background: `url("data:image/svg+xml,%3Csvg width='400' height='300' viewBox='0 0 400 300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%2316213e'/%3E%3Ccircle cx='200' cy='150' r='80' fill='none' stroke='%238BC34A' stroke-width='2' opacity='0.3'/%3E%3Ccircle cx='200' cy='150' r='60' fill='none' stroke='%232196F3' stroke-width='2' opacity='0.5'/%3E%3Ccircle cx='200' cy='150' r='40' fill='none' stroke='%238BC34A' stroke-width='2' opacity='0.7'/%3E%3Ccircle cx='200' cy='150' r='20' fill='%238BC34A' opacity='0.9'/%3E%3C/svg%3E")`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: 2,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Ценности проекта */}
        <Box mb={6}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <NeonText
              variant="h3"
              component="h2"
              color={theme.palette.secondary.main}
              sx={{ mb: 4, textAlign: 'center' }}
            >
              Our Core Values
            </NeonText>
          </motion.div>
          
          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={value.title}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <MissionValue
                    icon={value.icon}
                    title={value.title}
                    description={value.description}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Призыв к действию */}
        <Box textAlign="center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{
                color: theme.palette.primary.main,
                mb: 3,
              }}
            >
              Join Us in Building a Private Financial Future
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth={600} mx="auto">
              Whether you're a developer, privacy advocate, or someone who values 
              financial freedom, there's a place for you in the Mixton community.
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};