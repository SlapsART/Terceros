import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { IconEdit, IconHistory, IconUser, IconMapPin, IconBriefcase, IconPaperclip } from '@tabler/icons-react';
import type { Tercero } from '@/shared/types/tercero';
import { slideUp } from '@/shared/ui/animations';

type TabValue = 'contacto' | 'tributario' | 'bancario' | 'documentos';

const TABS: { value: TabValue; label: string }[] = [
  { value: 'contacto', label: 'Información de contacto' },
  { value: 'tributario', label: 'Perfil tributario' },
  { value: 'bancario', label: 'Cuentas bancarias' },
  { value: 'documentos', label: 'Documentos' },
];

interface TerceroPerfilCardProps {
  tercero: Tercero;
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
  onEdit: () => void;
  onHistorial?: () => void;
  onInactivar: () => void;
  onActivar: () => void;
  activo: boolean;
  tieneDireccionPreferida?: boolean;
  onViewDocument?: () => void;
}

export function TerceroPerfilCard({
  tercero,
  activeTab,
  onTabChange,
  onEdit,
  onHistorial,
  onInactivar,
  onActivar,
  activo,
  tieneDireccionPreferida = true,
  onViewDocument,
}: TerceroPerfilCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        minWidth: 320,
        maxWidth: 340,
        ...slideUp,
      }}
    >
      <Box sx={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
        <IconButton size="small" onClick={onEdit} sx={{ p: '3px', borderRadius: '50%' }}>
          <Box sx={{ color: 'primary.main', display: 'flex' }}><IconEdit size={16} /></Box>
        </IconButton>
        {onHistorial && (
          <IconButton size="small" onClick={onHistorial} sx={{ p: '3px', borderRadius: '50%' }}>
            <Box sx={{ color: 'text.secondary', display: 'flex' }}><IconHistory size={16} /></Box>
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          width: 80,
          height: 80,
          mb: 2,
          border: '2px dashed',
          borderColor: activo ? 'primary.200' : 'grey.300',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Avatar
          sx={{
            width: 60,
            height: 60,
            bgcolor: activo ? 'primary.main' : 'grey.400',
          }}
        >
          <IconUser size={24} color="white" />
        </Avatar>
      </Box>

      <Typography variant="h6" sx={{ textAlign: 'center', mb: 0.5 }}>
        {tercero.nombre}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        NIT: {tercero.nit}
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 2, width: '100%' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Box sx={{ color: 'text.secondary', display: 'flex' }}><IconUser size={14} /></Box>
            <Typography variant="caption" color="text.secondary">
              Tipo
            </Typography>
          </Box>
          <Typography variant="body2">
            {tercero.tipo === 'Organizacion' ? 'Organización' : 'Persona'}
          </Typography>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Box sx={{ color: 'text.secondary', display: 'flex' }}><IconMapPin size={14} /></Box>
            <Typography variant="caption" color="text.secondary">
              País
            </Typography>
          </Box>
          <Typography variant="body2">{tercero.pais}</Typography>
        </Box>
      </Box>

      <Box sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Box sx={{ color: 'text.secondary', display: 'flex' }}><IconBriefcase size={14} /></Box>
          <Typography variant="caption" color="text.secondary">
            Rol
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {tercero.roles.map((rol) => (
            <Chip
              key={rol}
              label={rol}
              size="small"
              color={activo ? 'primary' : 'default'}
              variant="filled"
            />
          ))}
        </Box>
      </Box>

      {tercero.documentoFuente && (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', width: '100%', mb: 1 }}>
          <Box sx={{ color: 'text.secondary', display: 'flex', pt: '2px', flexShrink: 0 }}>
            <IconPaperclip size={14} />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
              Documento fuente
            </Typography>
            <Link
              component="button"
              variant="body2"
              underline="always"
              onClick={onViewDocument}
              sx={{ cursor: onViewDocument ? 'pointer' : 'default', textAlign: 'left' }}
            >
              {tercero.documentoFuente}
            </Link>
          </Box>
        </Box>
      )}

      <Divider sx={{ width: '100%', mb: 1 }} />

      <List disablePadding sx={{ width: '100%' }}>
        {TABS.map((tab) => (
          <ListItem key={tab.value} disablePadding>
            <ListItemButton
              selected={activeTab === tab.value}
              onClick={() => onTabChange(tab.value)}
              sx={{
                borderRadius: 0.5,
                px: 1.5,
                py: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.50',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'primary.50' },
                },
              }}
            >
              <ListItemText
                primary={tab.label}
                slotProps={{
                  primary: {
                    variant: 'body2',
                    color: activeTab === tab.value ? 'primary' : 'text.primary',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ width: '100%', my: 1.5 }} />

      {activo ? (
        <Tooltip
          title={
            !tieneDireccionPreferida
              ? 'Sin dirección preferida registrada — agrega una para inactivar el tercero.'
              : ''
          }
          placement="top"
          disableHoverListener={tieneDireccionPreferida}
        >
          <span style={{ width: '100%' }}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={onInactivar}
              disabled={!tieneDireccionPreferida}
              sx={{ borderColor: 'error.main', color: 'error.main', '&:hover': { borderColor: 'error.dark', bgcolor: 'error.50' } }}
            >
              Inactivar tercero
            </Button>
          </span>
        </Tooltip>
      ) : (
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={onActivar}
          sx={{ borderColor: 'primary.main', color: 'primary.main' }}
        >
          Activar tercero
        </Button>
      )}
    </Paper>
  );
}
