import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToggleButton from '@mui/material/ToggleButton';
import { IconMapPin, IconPlus, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import type { Direccion, DireccionTipo, AddressExtra } from '@/shared/types/tercero';

const TIPOS_DIRECCION: DireccionTipo[] = ['Fiscal', 'Comercial', 'Correspondencia', 'Otro'];
const PAISES = ['Colombia', 'Perú', 'México', 'Argentina'];
const DEPARTAMENTOS = ['Cundinamarca', 'Antioquia', 'Valle'];
const CIUDADES = ['Bogotá', 'Medellín', 'Cali'];
const VIAS = ['Calle (Cll.)', 'Carrera (Kr.)', 'Avenida (Av.)', 'Diagonal (Dg.)', 'Transversal (Tv.)'];
const LETRAS = ['A', 'B', 'C', 'D', 'E'];
const SECTORES = ['Norte', 'Sur', 'Este / Oriente', 'Oeste / Occidente'];

interface DireccionesCardProps {
  direcciones: Direccion[];
  onDireccionesChange: (dirs: Direccion[]) => void;
  onDirtyChange?: (dirty: boolean) => void;
  mode?: 'creation' | 'edit';
  skeletonCount?: number;
  disableAutoForm?: boolean;
  ocrAddedIds?: string[];
}

interface DireccionForm {
  tipo: DireccionTipo;
  pais: string;
  departamento: string;
  ciudad: string;
  via: string;
  num1: string;
  num1Extras: AddressExtra[];
  num2: string;
  num2Extras: AddressExtra[];
  num3: string;
  complemento: string;
  showComplemento: boolean;
}

const EMPTY_FORM: DireccionForm = {
  tipo: 'Fiscal',
  pais: '',
  departamento: '',
  ciudad: '',
  via: '',
  num1: '',
  num1Extras: [],
  num2: '',
  num2Extras: [],
  num3: '',
  complemento: '',
  showComplemento: false,
};

type FormMode = { kind: 'new' } | { kind: 'edit'; id: string };

interface EliminarDialogState {
  dirId: string;
  label: string;
  isPreferida: boolean;
  otras: Direccion[];
}

interface ExtrasMenuState {
  anchor: HTMLElement;
  target: 'num1' | 'num2';
  afterExtraId?: string;
}

const hoverPlusGroup = {
  display: 'flex',
  alignItems: 'center',
  '& .plus-btn': { display: 'none' },
  '&:hover .plus-btn': { display: 'inline-flex' },
};

const OCR_ROW_SX = {
  animation: 'ocrDirReveal 0.4s ease-out',
  '@keyframes ocrDirReveal': {
    from: { opacity: 0, transform: 'translateX(-6px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
} as const;

export function DireccionesCard({ direcciones, onDireccionesChange, onDirtyChange, mode = 'edit', skeletonCount = 0, disableAutoForm = false, ocrAddedIds = [] }: DireccionesCardProps) {
  const [form, setForm] = useState<DireccionForm | null>(
    !disableAutoForm && direcciones.length === 0 ? EMPTY_FORM : null
  );
  const [formMode, setFormMode] = useState<FormMode>({ kind: 'new' });
  const [savedOpen, setSavedOpen] = useState(false);
  const [eliminarSnackOpen, setEliminarSnackOpen] = useState(false);
  const [eliminarDialog, setEliminarDialog] = useState<EliminarDialogState | null>(null);
  const [nuevaPreferidaId, setNuevaPreferidaId] = useState('');
  const [extrasMenu, setExtrasMenu] = useState<ExtrasMenuState | null>(null);

  const isFormOpen = form !== null;
  const editingId = isFormOpen && formMode.kind === 'edit' ? formMode.id : null;

  useEffect(() => {
    onDirtyChange?.(isFormOpen);
  }, [isFormOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => {
    setFormMode({ kind: 'new' });
    setForm(EMPTY_FORM);
  };

  const openEdit = (dir: Direccion) => {
    setFormMode({ kind: 'edit', id: dir.id });
    setForm({
      tipo: dir.tipo,
      pais: dir.pais,
      departamento: dir.departamento ?? '',
      ciudad: dir.ciudad ?? '',
      via: dir.viaPrincipal,
      num1: dir.num1,
      num1Extras: dir.num1Extras ?? [],
      num2: dir.num2,
      num2Extras: dir.num2Extras ?? [],
      num3: dir.num3,
      complemento: dir.complemento ?? '',
      showComplemento: !!dir.complemento,
    });
  };

  const handleCancelar = () => setForm(null);

  const handleConfirm = () => {
    if (!form) return;
    const base = {
      tipo: form.tipo,
      pais: form.pais,
      departamento: form.departamento,
      ciudad: form.ciudad,
      viaPrincipal: form.via,
      num1: form.num1,
      num1Extras: form.num1Extras.length > 0 ? form.num1Extras : undefined,
      num2: form.num2,
      num2Extras: form.num2Extras.length > 0 ? form.num2Extras : undefined,
      num3: form.num3,
      complemento: form.complemento || undefined,
    };
    if (formMode.kind === 'new') {
      onDireccionesChange([
        ...direcciones,
        { id: Date.now().toString(), ...base, esPreferida: direcciones.length === 0 },
      ]);
    } else {
      onDireccionesChange(
        direcciones.map((d) => (d.id === formMode.id ? { ...d, ...base } : d))
      );
      setSavedOpen(true);
    }
    setForm(null);
  };

  const handleEliminar = (dir: Direccion) => {
    const otras = direcciones.filter((d) => d.id !== dir.id);
    setEliminarDialog({
      dirId: dir.id,
      label: formatAddress(dir),
      isPreferida: dir.esPreferida,
      otras,
    });
    setNuevaPreferidaId(otras.length > 0 ? otras[0].id : '');
  };

  const handleEliminarConfirm = () => {
    if (!eliminarDialog) return;
    const { dirId, isPreferida, otras } = eliminarDialog;
    let updated = direcciones.filter((d) => d.id !== dirId);
    if (isPreferida && otras.length > 0) {
      updated = updated.map((d) =>
        d.id === nuevaPreferidaId ? { ...d, esPreferida: true } : { ...d, esPreferida: false }
      );
    }
    onDireccionesChange(updated);
    setEliminarDialog(null);
    setEliminarSnackOpen(true);
  };

  const handleEliminarCancel = () => setEliminarDialog(null);

  const handleExtrasMenuOpen = (
    e: React.MouseEvent<HTMLElement>,
    target: 'num1' | 'num2',
    afterExtraId?: string
  ) => {
    setExtrasMenu({ anchor: e.currentTarget, target, afterExtraId });
  };

  const handleExtrasMenuClose = () => setExtrasMenu(null);

  const handleAddExtra = (type: 'letra' | 'sector') => {
    if (!extrasMenu || !form) return;
    const { target, afterExtraId } = extrasMenu;
    const key = target === 'num1' ? 'num1Extras' : 'num2Extras';
    const current = form[key];
    const newExtra: AddressExtra = { id: Date.now().toString(), type, value: '' };
    let updated: AddressExtra[];
    if (afterExtraId) {
      const idx = current.findIndex((e) => e.id === afterExtraId);
      updated = [...current.slice(0, idx + 1), newExtra, ...current.slice(idx + 1)];
    } else {
      updated = [...current, newExtra];
    }
    setForm((f) => (f ? { ...f, [key]: updated } : f));
    handleExtrasMenuClose();
  };

  const handleRemoveExtra = (target: 'num1' | 'num2', id: string) => {
    const key = target === 'num1' ? 'num1Extras' : 'num2Extras';
    setForm((f) =>
      f ? { ...f, [key]: (f[key] as AddressExtra[]).filter((e) => e.id !== id) } : f
    );
  };

  const handleExtraChange = (target: 'num1' | 'num2', id: string, value: string) => {
    const key = target === 'num1' ? 'num1Extras' : 'num2Extras';
    setForm((f) =>
      f ? { ...f, [key]: (f[key] as AddressExtra[]).map((e) => (e.id === id ? { ...e, value } : e)) } : f
    );
  };

  const formatAddress = (dir: Direccion) => {
    const num1Part = dir.num1 + (dir.num1Extras ?? []).map((e) => ` ${e.value}`).join('');
    const num2Part = dir.num2 + (dir.num2Extras ?? []).map((e) => ` ${e.value}`).join('');
    return `${dir.viaPrincipal} #${num1Part}-${num2Part}${dir.complemento ? ` ${dir.complemento}` : ''}`;
  };

  const renderForm = (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {formMode.kind === 'new' && direcciones.length > 0 && (
        <Typography variant="subtitle2">Nueva dirección</Typography>
      )}

      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Tipo de dirección <Box component="span" sx={{ color: 'error.main' }}>*</Box>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {TIPOS_DIRECCION.map((tipo) => (
          <ToggleButton
            key={tipo}
            value={tipo}
            selected={form?.tipo === tipo}
            onChange={() => setForm((f) => (f ? { ...f, tipo } : f))}
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
            <Typography variant="caption">{tipo}</Typography>
          </ToggleButton>
        ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControl sx={{ flex: 1 }} size="small" required>
          <InputLabel>País</InputLabel>
          <Select value={form?.pais ?? ''} label="País" onChange={(e) => setForm((f) => (f ? { ...f, pais: e.target.value } : f))}>
            {PAISES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1 }} size="small">
          <InputLabel>Departamento</InputLabel>
          <Select value={form?.departamento ?? ''} label="Departamento" onChange={(e) => setForm((f) => (f ? { ...f, departamento: e.target.value } : f))}>
            {DEPARTAMENTOS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1 }} size="small">
          <InputLabel>Ciudad</InputLabel>
          <Select value={form?.ciudad ?? ''} label="Ciudad" onChange={(e) => setForm((f) => (f ? { ...f, ciudad: e.target.value } : f))}>
            {CIUDADES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {/* Fila única de dirección — sin salto de línea forzado */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl sx={{ flex: '1 1 110px', minWidth: 110 }} size="small" required>
          <InputLabel>Vía principal</InputLabel>
          <Select value={form?.via ?? ''} label="Vía principal" onChange={(e) => setForm((f) => (f ? { ...f, via: e.target.value } : f))}>
            {VIAS.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </FormControl>

        {/* Num1 */}
        <Box sx={hoverPlusGroup}>
          <TextField
            label="Num."
            required
            size="small"
            sx={{ width: 72 }}
            value={form?.num1 ?? ''}
            onChange={(e) => setForm((f) => (f ? { ...f, num1: e.target.value } : f))}
          />
          <IconButton
            className="plus-btn"
            size="small"
            onClick={(e) => handleExtrasMenuOpen(e, 'num1')}
            sx={{ color: 'text.secondary', p: '2px' }}
          >
            <IconPlus size={14} />
          </IconButton>
        </Box>

        {/* Extras de Num1 inline */}
        {form?.num1Extras.map((extra) => (
          <Box
            key={extra.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& .extra-btn': { display: 'none' },
              '&:hover .extra-btn': { display: 'inline-flex' },
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              {extra.type === 'letra' ? (
                <FormControl size="small" sx={{ width: 80 }}>
                  <InputLabel>Letra</InputLabel>
                  <Select
                    value={extra.value}
                    label="Letra"
                    onChange={(e) => handleExtraChange('num1', extra.id, e.target.value)}
                  >
                    {LETRAS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                  </Select>
                </FormControl>
              ) : (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sector</InputLabel>
                  <Select
                    value={extra.value}
                    label="Sector"
                    onChange={(e) => handleExtraChange('num1', extra.id, e.target.value)}
                  >
                    {SECTORES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              )}
              <IconButton
                className="extra-btn"
                size="small"
                onClick={() => handleRemoveExtra('num1', extra.id)}
                sx={{ position: 'absolute', top: '50%', right: 32, transform: 'translateY(-50%)', p: 0, width: 16, height: 16, color: 'text.secondary', zIndex: 1 }}
              >
                <IconX size={12} />
              </IconButton>
            </Box>
            <IconButton
              className="extra-btn"
              size="small"
              onClick={(e) => handleExtrasMenuOpen(e, 'num1', extra.id)}
              sx={{ color: 'text.secondary', p: '2px' }}
            >
              <IconPlus size={14} />
            </IconButton>
          </Box>
        ))}

        <Typography variant="body2" color="text.secondary">#</Typography>

        {/* Num2 */}
        <Box sx={hoverPlusGroup}>
          <TextField
            label="Num."
            required
            size="small"
            sx={{ width: 72 }}
            value={form?.num2 ?? ''}
            onChange={(e) => setForm((f) => (f ? { ...f, num2: e.target.value } : f))}
          />
          <IconButton
            className="plus-btn"
            size="small"
            onClick={(e) => handleExtrasMenuOpen(e, 'num2')}
            sx={{ color: 'text.secondary', p: '2px' }}
          >
            <IconPlus size={14} />
          </IconButton>
        </Box>

        {/* Extras de Num2 inline */}
        {form?.num2Extras.map((extra) => (
          <Box
            key={extra.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& .extra-btn': { display: 'none' },
              '&:hover .extra-btn': { display: 'inline-flex' },
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              {extra.type === 'letra' ? (
                <FormControl size="small" sx={{ width: 80 }}>
                  <InputLabel>Letra</InputLabel>
                  <Select
                    value={extra.value}
                    label="Letra"
                    onChange={(e) => handleExtraChange('num2', extra.id, e.target.value)}
                  >
                    {LETRAS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                  </Select>
                </FormControl>
              ) : (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sector</InputLabel>
                  <Select
                    value={extra.value}
                    label="Sector"
                    onChange={(e) => handleExtraChange('num2', extra.id, e.target.value)}
                  >
                    {SECTORES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              )}
              <IconButton
                className="extra-btn"
                size="small"
                onClick={() => handleRemoveExtra('num2', extra.id)}
                sx={{ position: 'absolute', top: '50%', right: 32, transform: 'translateY(-50%)', p: 0, width: 16, height: 16, color: 'text.secondary', zIndex: 1 }}
              >
                <IconX size={12} />
              </IconButton>
            </Box>
            <IconButton
              className="extra-btn"
              size="small"
              onClick={(e) => handleExtrasMenuOpen(e, 'num2', extra.id)}
              sx={{ color: 'text.secondary', p: '2px' }}
            >
              <IconPlus size={14} />
            </IconButton>
          </Box>
        ))}

        <Typography variant="body2" color="text.secondary">-</Typography>

        {/* Num3 — sin extras */}
        <TextField
          label="Num."
          required
          size="small"
          sx={{ width: 72 }}
          value={form?.num3 ?? ''}
          onChange={(e) => setForm((f) => (f ? { ...f, num3: e.target.value } : f))}
        />
      </Box>

      {/* Menú para agregar extras */}
      <Menu
        anchorEl={extrasMenu?.anchor}
        open={Boolean(extrasMenu)}
        onClose={handleExtrasMenuClose}
        slotProps={{ paper: { sx: { borderRadius: 1, minWidth: 180 } } }}
      >
        <MenuItem onClick={() => handleAddExtra('letra')}>
          <Typography variant="body2">Letra (A, B, C, D...)</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleAddExtra('sector')}>
          <Typography variant="body2">Sector (Sur, Norte...)</Typography>
        </MenuItem>
      </Menu>

      {/* Complemento */}
      {form?.showComplemento ? (
        <TextField
          label="Complemento"
          fullWidth
          size="small"
          value={form.complemento}
          onChange={(e) => setForm((f) => (f ? { ...f, complemento: e.target.value } : f))}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  edge="end"
                  onClick={() => setForm((f) => f ? { ...f, showComplemento: false, complemento: '' } : f)}
                >
                  <IconX size={14} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <Button
          size="small"
          startIcon={<IconPlus size={14} />}
          onClick={() => setForm((f) => (f ? { ...f, showComplemento: true } : f))}
          sx={{ color: 'text.secondary', alignSelf: 'flex-start' }}
        >
          Agregar complemento
        </Button>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="text" size="small" onClick={handleCancelar}>
          Cancelar
        </Button>
        <Button variant="outlined" size="small" onClick={handleConfirm}>
          {formMode.kind === 'edit' ? 'Guardar' : 'Agregar'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: isFormOpen && mode === 'edit' ? 'primary.main' : 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Inner wrapper: header + grey box con gap 12px */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 32 }}>
            <Box sx={{ color: 'text.secondary', display: 'flex' }}>
              <IconMapPin size={18} />
            </Box>
            <Typography variant="subtitle2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Dirección
            </Typography>
          </Box>

          {/* grey.50 — borderRadius 4px (var(--0,5)) — DENTRO del padding blanco */}
          <Box sx={{ bgcolor: 'grey.50', borderRadius: 1, overflow: 'hidden' }}>
            {direcciones.map((dir) => {
              if (editingId === dir.id) {
                return <Box key={dir.id}>{renderForm}</Box>;
              }
              const isOcrRow = ocrAddedIds.includes(dir.id);
              return (
                <Box
                  key={dir.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.5,
                    ...(isOcrRow && OCR_ROW_SX),
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                      <Typography variant="subtitle2">
                        {formatAddress(dir)}
                      </Typography>
                      {dir.esPreferida && (
                        <Chip label="Principal" size="small" color="primary" variant="filled" />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {dir.ciudad}, {dir.pais} - {dir.num3}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                    <IconButton size="small" sx={{ color: 'primary.main' }} onClick={() => openEdit(dir)}>
                      <IconPencil size={14} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEliminar(dir)} sx={{ color: 'text.secondary' }}>
                      <IconTrash size={14} />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}

            {/* Skeleton rows — OCR loading */}
            {skeletonCount > 0 && Array.from({ length: skeletonCount }).map((_, i) => (
              <Box key={`skeleton-d-${i}`} sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="55%" height={20} animation="wave" />
                  <Skeleton variant="text" width="40%" height={16} animation="wave" sx={{ mt: 0.5 }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Skeleton variant="circular" width={28} height={28} animation="wave" />
                  <Skeleton variant="circular" width={28} height={28} animation="wave" />
                </Box>
              </Box>
            ))}

            {formMode.kind === 'new' && form && renderForm}
          </Box>
        </Box>

        {/* Agregar dirección — fuera del inner wrapper, siempre visible */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            size="small"
            startIcon={<IconPlus size={14} />}
            onClick={!isFormOpen && skeletonCount === 0 ? openNew : undefined}
            sx={{
              color: isFormOpen || skeletonCount > 0 ? 'action.disabled' : 'primary.main',
              pointerEvents: isFormOpen || skeletonCount > 0 ? 'none' : 'auto',
            }}
          >
            Agregar dirección
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={savedOpen}
        autoHideDuration={3000}
        onClose={() => setSavedOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSavedOpen(false)} severity="success">
          Información guardada
        </Alert>
      </Snackbar>

      <Snackbar
        open={eliminarSnackOpen}
        autoHideDuration={3000}
        onClose={() => setEliminarSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setEliminarSnackOpen(false)} severity="success">
          Dirección eliminada
        </Alert>
      </Snackbar>

      {/* Dialog de confirmación eliminar dirección */}
      <Dialog
        open={Boolean(eliminarDialog)}
        onClose={handleEliminarCancel}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 2 } } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" component="span">
            Eliminar &ldquo;{eliminarDialog?.label}&rdquo;
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {eliminarDialog?.isPreferida && eliminarDialog.otras.length > 0 ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Para poder realizar la acción debes designar otra dirección como preferida
              </Typography>
              <RadioGroup
                value={nuevaPreferidaId}
                onChange={(e) => setNuevaPreferidaId(e.target.value)}
              >
                {eliminarDialog.otras.map((d) => (
                  <FormControlLabel
                    key={d.id}
                    value={d.id}
                    control={<Radio size="small" />}
                    label={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {d.tipo}
                        </Typography>
                        <Typography variant="body2">{formatAddress(d)}</Typography>
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {eliminarDialog?.isPreferida
                ? 'Esta acción hará que no puedas usar el tercero hasta agregar otra dirección preferida.'
                : '¿Confirmas que deseas eliminar esta dirección?'}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="text" size="small" onClick={handleEliminarCancel}>
            Cancelar
          </Button>
          <Button variant="contained" size="small" disableElevation onClick={handleEliminarConfirm}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
