// src/features/shared/components/layout/Footer.tsx
import React, { type ReactElement } from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  GitHub,
  Twitter,
  Telegram,
  Description,
  Language,
  Security,
  Speed,
  Code,
  Mail
} from '@mui/icons-material';

export interface FooterProps {
  showNewsletter?: boolean;
  socialLinks?: {
    github?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    docs?: string;
  };
  navigationLinks?: {
    product?: Array<{ label: string; href: string }>;
    resources?: Array<{ label: string; href: string }>;
    legal?: Array<{ label: string; href: string }>;
  };
  companyName?: string;
  companyDescription?: string;
  copyrightText?: string;
}

const Footer: React.FC<FooterProps> = ({
  showNewsletter = true,
  socialLinks = {
    github: 'https://github.com/Leepey/Mixton',
    twitter: 'https://twitter.com/tonmixer',
    telegram: 'https://t.me/tonmixer',
    discord: 'https://discord.gg/tonmixer',
    docs: 'https://docs.tonmixer.ton'
  },
  navigationLinks = {
    product: [
      { label: 'Features', href: '/#features' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Security', href: '/#security' },
      { label: 'Pricing', href: '/#pricing' }
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Blog', href: '/blog' },
      { label: 'Support', href: '/support' }
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Compliance', href: '/compliance' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  companyName = 'TON Mixer',
  companyDescription = 'Secure and anonymous TON transactions. Mix your coins with other transactions to enhance privacy.',
  copyrightText = `© ${new Date().getFullYear()} TON Mixer. All rights reserved. This service is for educational purposes only. Use responsibly and in compliance with local laws.`
}) => {
  const theme = useTheme();

  const handleSocialLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const footerSections = [
    {
      title: 'Product',
      icon: <Speed />,
      links: navigationLinks.product
    },
    {
      title: 'Resources',
      icon: <Description />,
      links: navigationLinks.resources
    },
    {
      title: 'Legal',
      icon: <Security />,
      links: navigationLinks.legal
    }
  ];

  const socialIcons = [
    { icon: <GitHub />, label: 'GitHub', url: socialLinks.github },
    { icon: <Twitter />, label: 'Twitter', url: socialLinks.twitter },
    { icon: <Telegram />, label: 'Telegram', url: socialLinks.telegram },
    { icon: <Code />, label: 'Docs', url: socialLinks.docs },
    { icon: <Mail />, label: 'Contact', url: '/contact' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'rgba(20, 20, 20, 0.7)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        py: 6,
        mt: 'auto',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.secondary.main, 0.3)}, ${alpha(theme.palette.primary.main, 0.3)})`,
          animation: 'shimmer 3s infinite',
          '@keyframes shimmer': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' }
          }
        }
      }}
    >
      <Container maxWidth="lg">
        {/* Logo and Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                    }}
                  >
                    <Box 
                      component="span" 
                      sx={{ 
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '18px'
                      }}
                    >
                      T
                    </Box>
                  </Box>
                </motion.div>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '1.5rem'
                  }}
                >
                  {companyName}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 3,
                  lineHeight: 1.6,
                  maxWidth: '90%'
                }}
              >
                {companyDescription}
              </Typography>
              
              {/* Social Links */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                {socialIcons.map((social, index) => (
                  <motion.div
                    key={social.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.1,
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <IconButton 
                      color="primary" 
                      aria-label={social.label}
                      onClick={() => handleSocialLinkClick(social.url)}
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': { 
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </motion.div>
                ))}
              </Box>
            </Grid>

            {/* Footer Sections */}
            {footerSections.map((section, sectionIndex) => (
              <Grid size={{ xs: 6, md: 2.4 }} key={section.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + sectionIndex * 0.1 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Box sx={{ 
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {section.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: theme.palette.text.primary
                      }}
                    >
                      {section.title}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {section.links?.map((link, linkIndex) => (
                      <motion.div
                        key={link.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + sectionIndex * 0.1 + linkIndex * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <Link 
                          href={link.href} 
                          color="text.secondary" 
                          underline="hover"
                          sx={{
                            textDecoration: 'none',
                            color: alpha(theme.palette.text.secondary, 0.8),
                            fontSize: '0.95rem',
                            transition: 'color 0.2s ease',
                            '&:hover': {
                              color: theme.palette.primary.main,
                              textDecoration: 'underline',
                              textDecorationThickness: '1px',
                              textUnderlineOffset: '2px'
                            }
                          }}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
            ))}

            {/* Newsletter Section */}
            {showNewsletter && (
              <Grid size={{ xs: 12, md: 3 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Stay Updated
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Subscribe to our newsletter for the latest updates and features.
                  </Typography>
                  <Box
                    component="form"
                    sx={{
                      display: 'flex',
                      gap: 1,
                      mb: 2
                    }}
                  >
                    <input
                      type="email"
                      placeholder="Your email address"
                      style={{
                        flex: 1,
                        padding: '10px 15px',
                        borderRadius: '8px',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        backgroundColor: alpha(theme.palette.background.paper, 0.1),
                        color: theme.palette.text.primary,
                        fontSize: '0.9rem',
                        outline: 'none',
                        '&:focus': {
                          borderColor: theme.palette.primary.main,
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                        }
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`
                      }}
                    >
                      Subscribe
                    </motion.button>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    We respect your privacy. Unsubscribe at any time.
                  </Typography>
                </motion.div>
              </Grid>
            )}
          </Grid>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1), my: 3 }} />
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              {copyrightText}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Built with
              </Typography>
              <Language sx={{ color: theme.palette.primary.main, fontSize: 16 }} />
              <Typography variant="caption" color="text.secondary">
                on TON Blockchain
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;