import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { IconArrowLeft, IconPlus } from '@tabler/icons-react';
import { slideDown } from '@/shared/ui/animations';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function PageHeader({ title, onBack, actionLabel, onAction }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.5,
        px: 2,
        minHeight: 56,
        ...slideDown,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {onBack && (
          <IconButton size="small" onClick={onBack}>
            <IconArrowLeft size={16} />
          </IconButton>
        )}
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Schibsted Grotesk", "IBM Plex Sans", sans-serif',
          }}
        >
          {title}
        </Typography>
      </Box>

      {actionLabel && onAction && (
        <Button
          variant="contained"
          size="medium"
          startIcon={<IconPlus size={16} />}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
