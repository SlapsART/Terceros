import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import { IconBuilding, IconUser, IconPaperclip, IconAlertCircle } from '@tabler/icons-react';
import type { TerceroTipo, TerceroRol } from '@/shared/types/tercero';

export interface DuplicadoInfo {
  identificacionTipo: string;
  identificacionNumero: string;
  pais: string;
}

const ROLES: TerceroRol[] = ['Proveedor', 'Empleado', 'Entidad financiera', 'Cliente', 'Otro'];
const ID_TYPES = ['NIT', 'Cédula', 'Cédula extranjera', 'Pasaporte', 'RUT'];
const PAISES = ['Colombia', 'México', 'Perú', 'Argentina', 'Chile', 'República dominicana'];

interface InformacionTerceroCardProps {
  nombre: string;
  tipo: TerceroTipo;
  identificacionTipo: string;
  identificacionNumero: string;
  pais: string;
  roles: TerceroRol[];
  documentoFuente?: string;
  duplicado?: DuplicadoInfo | null;
  loadingFields?: string[];
  onViewDocument?: () => void;
  onNombreChange: (v: string) => void;
  onTipoChange: (v: TerceroTipo) => void;
  onIdentificacionTipoChange: (v: string) => void;
  onIdentificacionNumeroChange: (v: string) => void;
  onPaisChange: (v: string) => void;
  onRolesChange: (v: TerceroRol[]) => void;
}

const REVEAL_ANIMATION = {
  animation: 'ocrReveal 0.35s ease-out',
  '@keyframes ocrReveal': {
    from: { opacity: 0, transform: 'translateY(4px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
} as const;

export function InformacionTerceroCard({
  nombre,
  tipo,
  identificacionTipo,
  identificacionNumero,
  pais,
  roles,
  documentoFuente,
  duplicado = null,
  loadingFields = [],
  onViewDocument,
  onNombreChange,
  onTipoChange,
  onIdentificacionTipoChange,
  onIdentificacionNumeroChange,
  onPaisChange,
  onRolesChange,
}: InformacionTerceroCardProps) {
  const loading = (field: string) => loadingFields.includes(field);
  const toggleRole = (rol: TerceroRol) => {
    if (roles.includes(rol)) {
      onRolesChange(roles.filter((r) => r !== rol));
    } else {
      onRolesChange([...roles, rol]);
    }
  };

  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Nombre */}
        {loading('nombre') ? (
          <Skeleton variant="rounded" height={56} animation="wave" />
        ) : (
          <Box sx={REVEAL_ANIMATION}>
            <TextField
              label="Nombre / Razón social"
              required
              fullWidth
              value={nombre}
              onChange={(e) => onNombreChange(e.target.value)}
            />
          </Box>
        )}

        {/* Tipo */}
        {loading('tipo') ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Skeleton variant="text" width={60} height={20} animation="wave" />
            <Skeleton variant="rounded" height={68} animation="wave" />
          </Box>
        ) : (
          <Box sx={REVEAL_ANIMATION}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Tipo <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <ToggleButtonGroup
              value={tipo}
              exclusive
              fullWidth
              onChange={(_, v) => v && onTipoChange(v)}
            >
              <ToggleButton
                value="Persona"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  py: 1.5,
                  color: tipo === 'Persona' ? 'primary.main' : 'text.secondary',
                  '&.Mui-selected': { borderColor: 'primary.main', bgcolor: 'transparent' },
                }}
              >
                <IconUser size={20} />
                <Typography variant="body2">Persona</Typography>
              </ToggleButton>
              <ToggleButton
                value="Organizacion"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  py: 1.5,
                  color: tipo === 'Organizacion' ? 'primary.main' : 'text.secondary',
                  '&.Mui-selected': { borderColor: 'primary.main', bgcolor: 'transparent' },
                }}
              >
                <IconBuilding size={20} />
                <Typography variant="body2">Organización</Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {duplicado && (
          <Alert
            severity="error"
            icon={
              <Box
                sx={{
                  bgcolor: 'error.100',
                  borderRadius: '50%',
                  p: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconAlertCircle size={14} />
              </Box>
            }
            sx={{
              borderRadius: 1,
              py: 0.5,
              px: 2,
              '& .MuiAlert-icon': {
                p: 0,
                mr: 1,
                alignItems: 'flex-start',
                pt: '9px',
              },
              '& .MuiAlert-message': {
                p: 0,
                py: 1,
                overflow: 'visible',
              },
            }}
          >
            <Typography variant="subtitle2" sx={{ display: 'block' }}>
              Ya existe un tercero con la información diligenciada.
            </Typography>
            <Typography variant="caption" sx={{ letterSpacing: '0.4px', display: 'block' }}>
              {`Identificación: ${duplicado.identificacionTipo} - ${duplicado.identificacionNumero} · País: ${duplicado.pais}`}
            </Typography>
          </Alert>
        )}

        {/* Identificación */}
        {loading('identificacion') ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Skeleton variant="text" width={100} height={20} animation="wave" />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="rounded" width={180} height={56} animation="wave" />
              <Skeleton variant="rounded" sx={{ flex: 1 }} height={56} animation="wave" />
            </Box>
          </Box>
        ) : (
          <Box sx={REVEAL_ANIMATION}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Identificación <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={identificacionTipo}
                  label="Tipo"
                  onChange={(e) => onIdentificacionTipoChange(e.target.value)}
                >
                  {ID_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Número"
                required
                fullWidth
                value={identificacionNumero}
                onChange={(e) => onIdentificacionNumeroChange(e.target.value)}
              />
            </Box>
          </Box>
        )}

        {/* País */}
        {loading('pais') ? (
          <Skeleton variant="rounded" height={56} animation="wave" />
        ) : (
          <Box sx={REVEAL_ANIMATION}>
            <FormControl fullWidth required>
              <InputLabel>País</InputLabel>
              <Select value={pais} label="País" onChange={(e) => onPaisChange(e.target.value)}>
                {PAISES.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Roles */}
        {loading('roles') ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Skeleton variant="text" width={40} height={20} animation="wave" />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[78, 90, 130, 68, 52].map((w, i) => (
                <Skeleton key={i} variant="rounded" width={w} height={32} animation="wave" />
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={REVEAL_ANIMATION}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Rol <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {ROLES.map((rol) => (
                <ToggleButton
                  key={rol}
                  value={rol}
                  selected={roles.includes(rol)}
                  onChange={() => toggleRole(rol)}
                  size="small"
                  sx={{
                    borderRadius: '4px !important',
                    border: '0.75px solid !important',
                    borderColor: 'grey.200 !important',
                    height: 32,
                    minHeight: 32,
                    px: 1.5,
                    '&.Mui-selected': {
                      color: 'primary.main',
                      borderColor: 'rgba(83,35,222,0.5) !important',
                      backgroundColor: '#ffffff !important',
                      '&:hover': { backgroundColor: '#ffffff !important' },
                    },
                  }}
                >
                  <Typography variant="caption">{rol}</Typography>
                </ToggleButton>
              ))}
            </Box>
          </Box>
        )}

        {documentoFuente && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Documento fuente
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ color: 'primary.main', display: 'flex' }}><IconPaperclip size={14} /></Box>
              <Link
                component="button"
                variant="body2"
                underline="always"
                onClick={onViewDocument}
                sx={{ cursor: onViewDocument ? 'pointer' : 'default' }}
              >
                {documentoFuente}
              </Link>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
