import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { IconUser, IconBuilding, IconAlertCircle } from '@tabler/icons-react';
import { slideUp } from '@/shared/ui/animations';
import type { TerceroTipo, TerceroRol } from '@/shared/types/tercero';
import type { DuplicadoInfo } from './InformacionTerceroCard';

export type { DuplicadoInfo };

const ROLES: TerceroRol[] = ['Proveedor', 'Empleado', 'Entidad financiera', 'Cliente', 'Otro'];
const ID_TYPES = ['NIT', 'Cédula de ciudadanía', 'Cédula de extranjería', 'RNC', 'RUT', 'Pasaporte'];
const PAISES = ['Colombia', 'México', 'Perú', 'Argentina', 'Chile', 'República dominicana'];

interface InformacionTerceroEditCardProps {
  nombre: string;
  tipo: TerceroTipo;
  identificacionTipo: string;
  identificacionNumero: string;
  pais: string;
  roles: TerceroRol[];
  duplicado?: DuplicadoInfo | null;
  onNombreChange: (v: string) => void;
  onTipoChange: (v: TerceroTipo) => void;
  onIdentificacionTipoChange: (v: string) => void;
  onIdentificacionNumeroChange: (v: string) => void;
  onPaisChange: (v: string) => void;
  onRolesChange: (v: TerceroRol[]) => void;
  onCancel: () => void;
  onSave: () => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {children}
    </Typography>
  );
}

export function InformacionTerceroEditCard({
  nombre,
  tipo,
  identificacionTipo,
  identificacionNumero,
  pais,
  roles,
  duplicado = null,
  onNombreChange,
  onTipoChange,
  onIdentificacionTipoChange,
  onIdentificacionNumeroChange,
  onPaisChange,
  onRolesChange,
  onCancel,
  onSave,
}: InformacionTerceroEditCardProps) {
  const isOrg = tipo === 'Organizacion';

  const toggleRole = (rol: TerceroRol) => {
    if (roles.includes(rol)) {
      onRolesChange(roles.filter((r) => r !== rol));
    } else {
      onRolesChange([...roles, rol]);
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        bgcolor: 'rgba(255,255,255,0.4)',
        border: '1px solid',
        borderColor: 'primary.main',
        borderRadius: 2,
        p: 2,
        boxShadow: '0px 6px 6px 0px rgba(34,0,255,0.04)',
        ...slideUp,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Nombre */}
        <Box>
          <FieldLabel>
            Nombre / Razón social{' '}
            <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={nombre}
            onChange={(e) => onNombreChange(e.target.value)}
          />
        </Box>

        {/* Tipo */}
        <Box>
          <FieldLabel>
            Tipo{' '}
            <Box component="span" sx={{ color: 'text.secondary' }}>*</Box>
          </FieldLabel>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box
              component="button"
              onClick={() => onTipoChange('Persona')}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 1,
                px: 0.5,
                border: '0.75px solid',
                borderColor: isOrg ? 'grey.200' : 'rgba(47,67,208,0.5)',
                borderRadius: 0.5,
                bgcolor: 'transparent',
                cursor: 'pointer',
                gap: 0.5,
              }}
            >
              <Box sx={{ color: isOrg ? 'text.primary' : 'primary.main', display: 'flex', p: 0.5 }}>
                <IconUser size={20} />
              </Box>
              <Typography
                variant="caption"
                sx={{ color: isOrg ? 'text.primary' : 'primary.main', letterSpacing: '0.4px' }}
              >
                Persona
              </Typography>
            </Box>

            <Box
              component="button"
              onClick={() => onTipoChange('Organizacion')}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 1,
                px: 0.5,
                border: '0.75px solid',
                borderColor: isOrg ? 'rgba(47,67,208,0.5)' : 'grey.200',
                borderRadius: 0.5,
                bgcolor: isOrg ? 'background.paper' : 'transparent',
                cursor: 'pointer',
                gap: 0.5,
              }}
            >
              <Box sx={{ color: isOrg ? 'primary.main' : 'text.primary', display: 'flex', p: 0.5 }}>
                <IconBuilding size={20} />
              </Box>
              <Typography
                variant="caption"
                sx={{ color: isOrg ? 'primary.main' : 'text.primary', letterSpacing: '0.4px' }}
              >
                Organización
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Duplicado detectado */}
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
        <Box>
          <FieldLabel>
            Identificación{' '}
            <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </FieldLabel>
          <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ width: 180 }}>
              <InputLabel sx={{ fontSize: '0.625rem' }}>Tipo</InputLabel>
              <Select
                value={identificacionTipo}
                label="Tipo"
                size="small"
                onChange={(e) => onIdentificacionTipoChange(e.target.value)}
                sx={{
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  bgcolor: 'grey.50',
                }}
              >
                {ID_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              label="Número"
              size="small"
              value={identificacionNumero}
              onChange={(e) => onIdentificacionNumeroChange(e.target.value)}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                },
              }}
            />
          </Box>
        </Box>

        {/* País */}
        <Box>
          <FieldLabel>
            País{' '}
            <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </FieldLabel>
          <FormControl fullWidth size="small">
            <InputLabel>País</InputLabel>
            <Select value={pais} label="País" onChange={(e) => onPaisChange(e.target.value)}>
              {PAISES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* Rol — Chips: primary filled = selected, outlined = not selected */}
        <Box>
          <FieldLabel>
            Rol{' '}
            <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </FieldLabel>
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

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 0.5 }}>
          <Button variant="text" size="small" color="primary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="outlined" size="small" color="primary" onClick={onSave}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
