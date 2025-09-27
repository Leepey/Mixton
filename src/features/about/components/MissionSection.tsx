import React from 'react';
import { Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import {
  GitHub as GitHubIcon,
  Telegram as TelegramIcon,
  Twitter as TwitterIcon,
  Language as LanguageIcon,
  FlashOn as FlashOnIcon, // Замена для Zap
  Public as PublicIcon // Замена для Globe
} from '@mui/icons-material';

// Интерфейс для пропсов компонента
interface SocialLinksProps {
  discordUrl?: string;
  githubUrl?: string;
  telegramUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
}

// Кастомная иконка Discord
const DiscordIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.844-.2762-3.68-.2762-5.4868 0-.1636-.3936-.4018-.8742-.6184-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0314.0561c2.0528 1.5074 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0411-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0408.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.522 6.0023-3.0294a.077.077 0 00.0313-.0556c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1828 0-2.1569-1.0857-2.1569-2.419 0-1.3332.955-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.955 2.4189-2.1569 2.4189zm7.9748 0c-1.1828 0-2.1569-1.0857-2.1569-2.419 0-1.3332.955-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
  </svg>
);

// Компонент с исправленными ошибками и типизацией
const SocialLinks: React.FC<SocialLinksProps> = ({ 
  discordUrl, 
  githubUrl, 
  telegramUrl, 
  twitterUrl, 
  websiteUrl 
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {/* Discord */}
      {discordUrl && (
        <Button
          variant="contained"
          href={discordUrl}
          target="_blank"
          startIcon={<DiscordIcon />}
          sx={{
            borderRadius: '8px',
            py: 1,
            background: `linear-gradient(45deg, #5865F2, #7289DA)`,
            justifyContent: 'flex-start',
            '&:hover': {
              background: `linear-gradient(45deg, #4752C4, #6278C4)`,
            }
          }}
        >
          Discord
        </Button>
      )}

      {/* GitHub */}
      {githubUrl && (
        <Button
          variant="contained"
          href={githubUrl}
          target="_blank"
          startIcon={<GitHubIcon />}
          sx={{
            borderRadius: '8px',
            py: 1,
            background: `linear-gradient(45deg, #333, #24292e)`,
            justifyContent: 'flex-start',
            '&:hover': {
              background: `linear-gradient(45deg, #24292e, #1a1e22)`,
            }
          }}
        >
          GitHub
        </Button>
      )}

      {/* Telegram */}
      {telegramUrl && (
        <Button
          variant="contained"
          href={telegramUrl}
          target="_blank"
          startIcon={<TelegramIcon />}
          sx={{
            borderRadius: '8px',
            py: 1,
            background: `linear-gradient(45deg, #0088CC, #0099E5)`,
            justifyContent: 'flex-start',
            '&:hover': {
              background: `linear-gradient(45deg, #0077BB, #0088CC)`,
            }
          }}
        >
          Telegram
        </Button>
      )}

      {/* Twitter */}
      {twitterUrl && (
        <Button
          variant="contained"
          href={twitterUrl}
          target="_blank"
          startIcon={<TwitterIcon />}
          sx={{
            borderRadius: '8px',
            py: 1,
            background: `linear-gradient(45deg, #1DA1F2, #1BA1E5)`,
            justifyContent: 'flex-start',
            '&:hover': {
              background: `linear-gradient(45deg, #0C85D0, #1DA1F2)`,
            }
          }}
        >
          Twitter
        </Button>
      )}

      {/* Website с заменой Globe на PublicIcon */}
      {websiteUrl && (
        <Button
          variant="contained"
          href={websiteUrl}
          target="_blank"
          startIcon={<PublicIcon />}
          sx={{
            borderRadius: '8px',
            py: 1,
            background: `linear-gradient(45deg, #8BC34A, #7CB342)`,
            justifyContent: 'flex-start',
            '&:hover': {
              background: `linear-gradient(45deg, #7CB342, #689F38)`,
            }
          }}
        >
          Website
        </Button>
      )}

      {/* Дополнительная кнопка с заменой Zap на FlashOnIcon */}
      <Button
        variant="contained"
        startIcon={<FlashOnIcon />}
        sx={{
          borderRadius: '8px',
          py: 1,
          background: `linear-gradient(45deg, #FF9800, #F57C00)`,
          justifyContent: 'flex-start',
          '&:hover': {
            background: `linear-gradient(45deg, #F57C00, #EF6C00)`,
          }
        }}
      >
        Quick Start
      </Button>
    </Box>
  );
};

export default SocialLinks;