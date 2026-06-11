import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { IconFileText } from '@tabler/icons-react';
import { slideUp } from '@/shared/ui/animations';

export type OcrTerceroStatus = 'ready' | 'error';

export interface OcrTerceroItem {
  id: string;
  status: OcrTerceroStatus;
}

interface OcrTercerosSidebarProps {
  items: OcrTerceroItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function OcrTercerosSidebar({ items, selectedId, onSelect }: OcrTercerosSidebarProps) {
  return (
    <Box
      sx={{
        bgcolor: 'rgba(255,255,255,0.2)',
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        height: '100%',
        overflow: 'hidden',
        ...slideUp,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          pt: 1.5,
          pb: 1,
          borderRadius: '8px 8px 0 0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Box sx={{ color: 'text.primary', display: 'flex' }}>
            <IconFileText size={16} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Creación de terceros
          </Typography>
        </Box>
      </Box>

      {/* Item list */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          px: 2,
          py: 1,
          overflow: 'auto',
        }}
      >
        {items.map((item) => (
          <Box
            key={item.id}
            onClick={() => item.status !== 'error' && onSelect(item.id)}
            sx={{
              bgcolor: item.id === selectedId ? 'rgba(47,67,208,0.08)' : 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'grey.200',
              borderRadius: '4px 4px 0 0',
              px: 1.5,
              py: 1,
              cursor: item.status !== 'error' ? 'pointer' : 'default',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              {item.id}
            </Typography>

            {item.status === 'ready' && (
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Extraído
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ·
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Listo para crear
                </Typography>
              </Box>
            )}

            {item.status === 'error' && (
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  Error
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ·
                </Typography>
                <Link
                  component="button"
                  variant="body2"
                  onClick={(e) => e.stopPropagation()}
                  sx={{ color: 'primary.main', textDecoration: 'underline' }}
                >
                  Reintentar
                </Link>
                <Typography variant="body2" color="text.secondary">
                  ·
                </Typography>
                <Link
                  component="button"
                  variant="body2"
                  onClick={(e) => e.stopPropagation()}
                  sx={{ color: 'primary.main', textDecoration: 'underline' }}
                >
                  Cargar de nuevo
                </Link>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
