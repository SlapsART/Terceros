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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Skeleton from '@mui/material/Skeleton';
import {
  IconFileDollar,
  IconUser,
  IconId,
  IconBuildingBank,
  IconBox,
  IconReceipt,
  IconPencil,
  IconPaperclip,
  IconFlag,
} from '@tabler/icons-react';
import type { PerfilTributario, ActividadEconomica } from '@/shared/types/tercero';

const REGIMENES = ['Ordinario', 'Simple', 'Gran contribuyente', 'Régimen especial'];
const TIPOS_ID = ['NIT', 'Cédula', 'Pasaporte', 'Cédula extranjera', 'RUT'];
const PAISES = ['Colombia', 'México', 'Argentina', 'Chile', 'Perú', 'Ecuador', 'Venezuela', 'Brasil'];
const MAX_CHIPS_VISIBLE = 3;

const CIIU_OPTIONS: ActividadEconomica[] = [
  { codigo: '0111', descripcion: 'Cultivo de cereales', esPrincipal: false },
  { codigo: '1010', descripcion: 'Procesamiento y conservación de carne', esPrincipal: false },
  { codigo: '1345', descripcion: 'Manufactura textil', esPrincipal: false },
  { codigo: '4565', descripcion: 'Extracción de hidrocarburos y minería', esPrincipal: false },
  { codigo: '4723', descripcion: 'Transporte de alimentos', esPrincipal: false },
  { codigo: '6201', descripcion: 'Actividades de desarrollo de software', esPrincipal: false },
  { codigo: '7010', descripcion: 'Actividades de administración empresarial', esPrincipal: false },
  { codigo: '7020', descripcion: 'Actividades de consultoría de gestión empresarial', esPrincipal: false },
  { codigo: '7220', descripcion: 'Investigación y desarrollo', esPrincipal: false },
  { codigo: '8511', descripcion: 'Educación de instituciones superiores', esPrincipal: false },
  { codigo: '8984', descripcion: 'Elaboración de productos manufacturados', esPrincipal: false },
];

type BoolAtributoKey =
  | 'perteneceRegimenIVA'
  | 'esAutorretenedora'
  | 'esAgenteRetenedorIVA'
  | 'esAutorretenedorRenta'
  | 'esGranContribuyente'
  | 'esExentoRetefuente';

const ATRIBUTOS_LEFT: Array<[BoolAtributoKey, string]> = [
  ['perteneceRegimenIVA', 'Pertenece régimen IVA'],
  ['esAutorretenedora', 'Es autorretenedora'],
  ['esAgenteRetenedorIVA', 'Es agente retenedor IVA'],
  ['esAutorretenedorRenta', 'Es autorretenedor renta'],
];

const ATRIBUTOS_RIGHT: Array<[BoolAtributoKey, string]> = [
  ['esGranContribuyente', 'Es gran contribuyente'],
  ['esExentoRetefuente', 'Es exento retefuente'],
];

interface PerfilTributarioCardProps {
  nombreRazonSocial?: string;
  identificacionTipo?: string;
  identificacionNumero?: string;
  nit?: string;
  pais?: string;
  direccion?: string;
  direccionesOpciones?: string[];
  documentoRut?: string;
  perfil?: PerfilTributario;
  isLoading?: boolean;
  onPerfilChange?: (p: PerfilTributario) => void;
  onIdentificacionTipoChange?: (v: string) => void;
  onIdentificacionNumeroChange?: (v: string) => void;
  onPaisChange?: (v: string) => void;
  onDireccionChange?: (v: string) => void;
  onDirtyChange?: (dirty: boolean) => void;
  initialEditing?: boolean;
  disableEditHighlight?: boolean;
}

export function PerfilTributarioCard({
  nombreRazonSocial,
  identificacionTipo,
  nit,
  pais,
  direccion,
  direccionesOpciones = [],
  documentoRut,
  perfil,
  isLoading,
  onPerfilChange,
  onIdentificacionTipoChange,
  onIdentificacionNumeroChange,
  onPaisChange,
  onDireccionChange,
  onDirtyChange,
  initialEditing = false,
  disableEditHighlight = false,
}: PerfilTributarioCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<PerfilTributario | undefined>(perfil);

  const nitParts = (nit ?? '').split('-');
  const [draftTipoId, setDraftTipoId] = useState(identificacionTipo ?? '');
  const [draftNoId, setDraftNoId] = useState(nitParts[0] ?? '');
  const [draftDv, setDraftDv] = useState(nitParts.length > 1 ? (nitParts[1] ?? '') : '');
  const [draftPais, setDraftPais] = useState(pais ?? '');
  const [draftDireccion, setDraftDireccion] = useState(direccion ?? '');
  const [actividadInput, setActividadInput] = useState<ActividadEconomica | null>(null);
  const [actividadInputValue, setActividadInputValue] = useState('');

  useEffect(() => {
    if (perfil && initialEditing && !editing) {
      setDraft(perfil);
      setEditing(true);
      onDirtyChange?.(true);
    }
  }, [perfil]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetExtraFields = () => {
    const parts = (nit ?? '').split('-');
    setDraftTipoId(identificacionTipo ?? '');
    setDraftNoId(parts[0] ?? '');
    setDraftDv(parts.length > 1 ? (parts[1] ?? '') : '');
    setDraftPais(pais ?? '');
    setDraftDireccion(direccion ?? '');
    setActividadInput(null);
    setActividadInputValue('');
  };

  const startEdit = () => {
    if (!perfil) return;
    setDraft(perfil);
    resetExtraFields();
    setEditing(true);
    onDirtyChange?.(true);
  };

  const handleSave = () => {
    if (!draft) return;
    onPerfilChange?.(draft);
    onIdentificacionTipoChange?.(draftTipoId);
    onIdentificacionNumeroChange?.(draftNoId + draftDv);
    onPaisChange?.(draftPais);
    onDireccionChange?.(draftDireccion);
    setEditing(false);
    onDirtyChange?.(false);
  };

  const handleCancel = () => {
    setDraft(perfil);
    resetExtraFields();
    setEditing(false);
    onDirtyChange?.(false);
  };

  const patchDraft = (patch: Partial<PerfilTributario>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
  };

  const patchAtributo = (key: BoolAtributoKey, value: boolean) => {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  };

  const removeActividad = (index: number) => {
    setDraft((d) => {
      if (!d) return d;
      const updated = d.actividadesEconomicas.filter((_, i) => i !== index);
      return { ...d, actividadesEconomicas: updated };
    });
  };

  // Build the direction options ensuring current value is always present
  const dirOpciones = direccionesOpciones.length > 0
    ? direccionesOpciones
    : (draftDireccion ? [draftDireccion] : []);

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
      {/* Header */}
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

      {/* Body */}
      <Box sx={{ bgcolor: editing ? 'grey.50' : 'grey.100', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: editing ? 3 : 2 }}>
          {editing && draft ? (
            /* ── EDIT MODE ── */
            <>
              {/* ── Campos principales ── */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

                {/* Fila 1: Razón social */}
                <Box sx={{ height: '32px', display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                    {nombreRazonSocial}
                  </Typography>
                </Box>

                {/* Fila 2: Tipo + No Identificación + DV | RUT */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ flex: 1, display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <FormControl size="small" sx={{ width: '84px' }}>
                      <InputLabel sx={{ fontSize: '0.75rem' }}>*Tipo</InputLabel>
                      <Select
                        value={draftTipoId}
                        label="*Tipo"
                        onChange={(e) => setDraftTipoId(e.target.value)}
                        sx={{
                          height: '32px',
                          fontSize: '0.8125rem',
                          '& .MuiOutlinedInput-notchedOutline': { borderRadius: '4px 0 0 4px' },
                        }}
                      >
                        {TIPOS_ID.map((t) => (
                          <MenuItem key={t} value={t} sx={{ fontSize: '0.8125rem' }}>{t}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      size="small"
                      label="*No identificación"
                      value={draftNoId}
                      onChange={(e) => setDraftNoId(e.target.value)}
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': { height: '32px', fontSize: '0.8125rem' },
                        '& .MuiOutlinedInput-notchedOutline': { borderRadius: '0 4px 4px 0' },
                        '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mx: 0.75, flexShrink: 0 }}>-</Typography>
                    <TextField
                      size="small"
                      label="*DV"
                      value={draftDv}
                      onChange={(e) => setDraftDv(e.target.value)}
                      sx={{
                        width: '48px',
                        '& .MuiOutlinedInput-root': { height: '32px', fontSize: '0.8125rem' },
                        '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<IconPaperclip size={13} />}
                      sx={{
                        height: '32px',
                        width: '100%',
                        justifyContent: 'flex-start',
                        borderColor: 'grey.300',
                        color: 'primary.main',
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        px: 1.5,
                        overflow: 'hidden',
                        '&:hover': { borderColor: 'grey.400', bgcolor: 'primary.50' },
                      }}
                    >
                      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {documentoRut ?? `RUT-NIT${draftNoId}${draftDv ? '-' + draftDv : ''}.pdf`}
                      </Box>
                    </Button>
                  </Box>
                </Box>

                {/* Fila 3: Régimen | Tipo de persona */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel sx={{ fontSize: '0.75rem' }}>*Régimen Tributario</InputLabel>
                    <Select
                      value={draft.regimenTributario}
                      label="*Régimen Tributario"
                      onChange={(e) => patchDraft({ regimenTributario: e.target.value })}
                      sx={{ height: '32px', fontSize: '0.8125rem' }}
                    >
                      {REGIMENES.map((r) => (
                        <MenuItem key={r} value={r} sx={{ fontSize: '0.8125rem' }}>{r}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ fontSize: '0.625rem', color: 'text.primary', display: 'block', mb: '2px', lineHeight: 1.4 }}>
                      Tipo de persona{' '}
                      <Box component="span" sx={{ color: '#c63434' }}>*</Box>
                    </Typography>
                    <RadioGroup
                      row
                      value={draft.tipoPersona}
                      onChange={(e) =>
                        patchDraft({ tipoPersona: e.target.value as PerfilTributario['tipoPersona'] })
                      }
                      sx={{ gap: 0 }}
                    >
                      <FormControlLabel
                        value="Natural"
                        control={<Radio size="small" sx={{ p: '3px' }} />}
                        label={<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>Natural</Typography>}
                        sx={{ mr: 1.5 }}
                      />
                      <FormControlLabel
                        value="Jurídica"
                        control={<Radio size="small" sx={{ p: '3px' }} />}
                        label={<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>Jurídica</Typography>}
                        sx={{ mr: 0 }}
                      />
                    </RadioGroup>
                  </Box>
                </Box>

                {/* Fila 4: País | Dirección */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel sx={{ fontSize: '0.75rem' }}>*Selecciona un país</InputLabel>
                    <Select
                      value={draftPais}
                      label="*Selecciona un país"
                      onChange={(e) => setDraftPais(e.target.value)}
                      sx={{ height: '32px', fontSize: '0.8125rem' }}
                    >
                      {PAISES.map((p) => (
                        <MenuItem key={p} value={p} sx={{ fontSize: '0.8125rem' }}>{p}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel sx={{ fontSize: '0.75rem' }}>*Dirección</InputLabel>
                    <Select
                      value={draftDireccion}
                      label="*Dirección"
                      onChange={(e) => setDraftDireccion(e.target.value)}
                      sx={{ height: '32px', fontSize: '0.8125rem' }}
                    >
                      {dirOpciones.map((d) => (
                        <MenuItem key={d} value={d} sx={{ fontSize: '0.8125rem' }}>{d}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Fila 5: Actividad económica + chips */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Autocomplete<ActividadEconomica>
                    size="small"
                    options={CIIU_OPTIONS}
                    getOptionLabel={(opt) => `${opt.codigo}-${opt.descripcion}`}
                    value={actividadInput as ActividadEconomica}
                    inputValue={actividadInputValue}
                    onInputChange={(_, v) => setActividadInputValue(v)}
                    onChange={(_, newValue) => {
                      if (newValue) {
                        const exists = draft.actividadesEconomicas.some(
                          (a) => a.codigo === newValue.codigo && a.descripcion === newValue.descripcion
                        );
                        if (!exists) {
                          const esPrincipal = draft.actividadesEconomicas.length === 0;
                          patchDraft({
                            actividadesEconomicas: [
                              ...draft.actividadesEconomicas,
                              { ...newValue, esPrincipal },
                            ],
                          });
                        }
                      }
                      setActividadInput(null);
                      setActividadInputValue('');
                    }}
                    isOptionEqualToValue={(opt, val) =>
                      opt.codigo === val.codigo && opt.descripcion === val.descripcion
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="*Actividad económica (Cód. CIIU)"
                        size="small"
                        placeholder="Selecciona"
                        sx={{
                          '& .MuiOutlinedInput-root': { fontSize: '0.8125rem' },
                          '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                        }}
                      />
                    )}
                  />
                  {draft.actividadesEconomicas.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'nowrap', overflow: 'hidden' }}>
                      {draft.actividadesEconomicas.slice(0, MAX_CHIPS_VISIBLE).map((act, i) => (
                        <Chip
                          key={`${act.codigo}-${i}`}
                          icon={act.esPrincipal ? <IconFlag size={11} /> : undefined}
                          label={`${act.codigo}-${act.descripcion}`}
                          size="small"
                          onDelete={() => removeActividad(i)}
                          sx={{
                            maxWidth: 180,
                            flexShrink: 1,
                            ...(act.esPrincipal && {
                              '& .MuiChip-icon': { color: 'primary.main', ml: '6px', mr: '-2px' },
                            }),
                          }}
                        />
                      ))}
                      {draft.actividadesEconomicas.length > MAX_CHIPS_VISIBLE && (
                        <Typography
                          variant="body2"
                          color="primary.main"
                          sx={{ fontSize: '0.8125rem', fontWeight: 500, flexShrink: 0 }}
                        >
                          +{draft.actividadesEconomicas.length - MAX_CHIPS_VISIBLE}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>

              {/* ── Atributos fiscales (checkboxes) ── */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  Atributos fiscales
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {ATRIBUTOS_LEFT.map(([key, label]) => (
                      <FormControlLabel
                        key={key}
                        control={
                          <Checkbox
                            size="small"
                            checked={draft[key]}
                            onChange={(e) => patchAtributo(key, e.target.checked)}
                            sx={{ p: '4px' }}
                          />
                        }
                        label={
                          <Typography
                            variant="body2"
                            color={draft[key] ? 'text.primary' : 'text.secondary'}
                            sx={{ fontSize: '0.8125rem' }}
                          >
                            {label}
                          </Typography>
                        }
                        sx={{ mx: 0, px: 1.5, py: 1, borderRadius: '4px', '&:hover': { bgcolor: 'grey.100' } }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {ATRIBUTOS_RIGHT.map(([key, label]) => (
                      <FormControlLabel
                        key={key}
                        control={
                          <Checkbox
                            size="small"
                            checked={draft[key]}
                            onChange={(e) => patchAtributo(key, e.target.checked)}
                            sx={{ p: '4px' }}
                          />
                        }
                        label={
                          <Typography
                            variant="body2"
                            color={draft[key] ? 'text.primary' : 'text.secondary'}
                            sx={{ fontSize: '0.8125rem' }}
                          >
                            {label}
                          </Typography>
                        }
                        sx={{ mx: 0, px: 1.5, py: 1, borderRadius: '4px', '&:hover': { bgcolor: 'grey.100' } }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Guardar / Cancelar */}
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
                      {ATRIBUTOS_LEFT.map(([key, label]) =>
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
