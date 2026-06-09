import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import {
  IconFileDollar,
  IconUser,
  IconId,
  IconBuildingBank,
  IconBox,
  IconReceipt,
  IconPencil,
} from '@tabler/icons-react';
import type { PerfilTributario } from '@/shared/types/tercero';

const REGIMENES = ['Ordinario', 'Simple', 'Gran contribuyente', 'Régimen especial'];

const ATRIBUTOS: [keyof PerfilTributario, string][] = [
  ['perteneceRegimenIVA', 'Pertenece régimen IVA'],
  ['esAutorretenedora', 'Es autorretenedora'],
  ['esAgenteRetenedorIVA', 'Es agente retenedor IVA'],
  ['esAutorretenedorRenta', 'Es autorretenedor renta'],
];

const ATRIBUTOS_RIGHT: [keyof PerfilTributario, string][] = [
  ['esGranContribuyente', 'Es gran contribuyente'],
  ['esExentoRetefuente', 'Es exento retefuente'],
];

interface PerfilTributarioCardProps {
  nombreRazonSocial?: string;
  identificacionTipo?: string;
  nit?: string;
  perfil?: PerfilTributario;
  isLoading?: boolean;
  onPerfilChange?: (p: PerfilTributario) => void;
  onDirtyChange?: (dirty: boolean) => void;
  initialEditing?: boolean;
  disableEditHighlight?: boolean;
}


export function PerfilTributarioCard({
  nombreRazonSocial,
  identificacionTipo,
  nit,
  perfil,
  isLoading,
  onPerfilChange,
  onDirtyChange,
  initialEditing = false,
  disableEditHighlight = false,
}: PerfilTributarioCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<PerfilTributario | undefined>(perfil);

  useEffect(() => {
    if (perfil && initialEditing && !editing) {
      setDraft(perfil);
      setEditing(true);
      onDirtyChange?.(true);
    }
  }, [perfil]); // eslint-disable-line react-hooks/exhaustive-deps

  const startEdit = () => {
    if (!perfil) return;
    setDraft(perfil);
    setEditing(true);
    onDirtyChange?.(true);
  };

  const handleSave = () => {
    if (!draft) return;
    onPerfilChange?.(draft);
    setEditing(false);
    onDirtyChange?.(false);
  };

  const handleCancel = () => {
    setDraft(perfil);
    setEditing(false);
    onDirtyChange?.(false);
  };

  const patchDraft = (patch: Partial<PerfilTributario>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
  };

  if (isLoading) {
    return (
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton variant="circular" width={18} height={18} animation="wave" />
          <Skeleton variant="text" width={140} height={22} animation="wave" />
        </Box>
        <Box sx={{ bgcolor: 'grey.100', borderRadius: 2, overflow: 'hidden', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={16} animation="wave" />
              <Skeleton variant="text" width="80%" height={20} animation="wave" sx={{ mt: 0.5 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="55%" height={16} animation="wave" />
              <Skeleton variant="text" width="75%" height={20} animation="wave" sx={{ mt: 0.5 }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="50%" height={16} animation="wave" />
              <Skeleton variant="text" width="65%" height={20} animation="wave" sx={{ mt: 0.5 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="55%" height={16} animation="wave" />
              <Skeleton variant="text" width="70%" height={20} animation="wave" sx={{ mt: 0.5 }} />
            </Box>
          </Box>
          <Box>
            <Skeleton variant="text" width="45%" height={16} animation="wave" />
            <Skeleton variant="text" width="85%" height={18} animation="wave" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="70%" height={18} animation="wave" sx={{ mt: 0.5 }} />
          </Box>
          <Box>
            <Skeleton variant="text" width="40%" height={16} animation="wave" />
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              <Skeleton variant="rounded" width={120} height={20} animation="wave" />
              <Skeleton variant="rounded" width={100} height={20} animation="wave" />
            </Box>
          </Box>
        </Box>
      </Paper>
    );
  }

  if (!perfil) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: editing && !disableEditHighlight ? 'primary.main' : 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        animation: 'ocrRevealPerfil 0.4s ease-out',
        '@keyframes ocrRevealPerfil': {
          from: { opacity: 0, transform: 'translateY(6px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Header — igual a ContactosCard */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 32 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ color: 'text.secondary', display: 'flex' }}>
            <IconFileDollar size={18} />
          </Box>
          <Typography variant="subtitle2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            Perfil tributario
          </Typography>
        </Box>
        {!editing && (
          <IconButton size="small" onClick={startEdit} sx={{ color: 'primary.main' }}>
            <IconPencil size={16} />
          </IconButton>
        )}
      </Box>

      {/* Grey box — igual a ContactosCard */}
      <Box sx={{ bgcolor: 'grey.100', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {editing && draft ? (
            /* ── EDIT MODE ── */
            <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Nombre / Razón social
                  </Typography>
                  <Typography variant="body2">{nombreRazonSocial}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Documento
                  </Typography>
                  <Typography variant="body2">
                    {identificacionTipo}: {nit}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl size="small" sx={{ flex: 1 }}>
                  <InputLabel>Tipo de persona</InputLabel>
                  <Select
                    value={draft.tipoPersona}
                    label="Tipo de persona"
                    onChange={(e) =>
                      patchDraft({ tipoPersona: e.target.value as PerfilTributario['tipoPersona'] })
                    }
                  >
                    <MenuItem value="Jurídica">Jurídica</MenuItem>
                    <MenuItem value="Natural">Natural</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ flex: 1 }}>
                  <InputLabel>Régimen tributario</InputLabel>
                  <Select
                    value={draft.regimenTributario}
                    label="Régimen tributario"
                    onChange={(e) => patchDraft({ regimenTributario: e.target.value })}
                  >
                    {REGIMENES.map((r) => (
                      <MenuItem key={r} value={r}>{r}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Atributos fiscales
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {([...ATRIBUTOS, ...ATRIBUTOS_RIGHT] as [keyof PerfilTributario, string][]).map(
                    ([key, label]) => (
                      <Box
                        key={key}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {label}
                        </Typography>
                        <Switch
                          size="small"
                          checked={draft[key] as boolean}
                          onChange={(e) => patchDraft({ [key]: e.target.checked })}
                        />
                      </Box>
                    )
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="text" size="small" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button variant="outlined" size="small" onClick={handleSave}>
                  Guardar
                </Button>
              </Box>
            </>
          ) : (
            /* ── VIEW MODE ── */
            <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FieldCol icon={<IconUser size={16} />} label="Nombre / Razón social" value={nombreRazonSocial ?? ''} />
                <FieldCol icon={<IconId size={16} />} label="Documento" value={`${identificacionTipo ?? ''}: ${nit ?? ''}`} />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FieldCol icon={<IconUser size={16} />} label="Tipo de persona" value={perfil.tipoPersona} />
                <FieldCol icon={<IconBuildingBank size={16} />} label="Régimen tributario" value={perfil.regimenTributario} />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Box sx={{ color: 'text.secondary', display: 'flex', pt: '2px', flexShrink: 0 }}>
                  <IconBox size={16} />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Actividad económica
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {perfil.actividadesEconomicas.map((act, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          color={act.esPrincipal ? 'text.primary' : 'text.secondary'}
                        >
                          {act.codigo} - {act.descripcion}
                        </Typography>
                        {act.esPrincipal && (
                          <Chip label="Principal" size="small" color="primary" variant="filled" />
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Box sx={{ color: 'text.secondary', display: 'flex', pt: '2px', flexShrink: 0 }}>
                  <IconReceipt size={16} />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Atributos fiscales
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {ATRIBUTOS.map(([key, label]) =>
                        perfil[key] ? (
                          <Typography key={key} variant="body2" color="text.secondary">
                            {label}
                          </Typography>
                        ) : null
                      )}
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {ATRIBUTOS_RIGHT.map(([key, label]) =>
                        perfil[key] ? (
                          <Typography key={key} variant="body2" color="text.secondary">
                            {label}
                          </Typography>
                        ) : null
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

function FieldCol({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box sx={{ flex: 1, display: 'flex', gap: 1, alignItems: 'flex-start', minWidth: 0 }}>
      <Box sx={{ color: 'text.secondary', display: 'flex', alignSelf: 'stretch', pt: '2px', flexShrink: 0 }}>
        {icon}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Box>
  );
}
