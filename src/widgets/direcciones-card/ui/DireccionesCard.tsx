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
import { fadeIn } from '@/shared/ui/animations';

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
  editOcrItems?: boolean;
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
  itemId?: string; // set when menu belongs to an OCR item form
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

const TOGGLE_CHIP_SX = {
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
} as const;

export function DireccionesCard({
  direcciones,
  onDireccionesChange,
  onDirtyChange,
  mode = 'edit',
  skeletonCount = 0,
  disableAutoForm = false,
  ocrAddedIds = [],
  editOcrItems = false,
}: DireccionesCardProps) {
  const [form, setForm] = useState<DireccionForm | null>(
    !disableAutoForm && direcciones.length === 0 ? EMPTY_FORM : null
  );
  const [formMode, setFormMode] = useState<FormMode>({ kind: 'new' });
  const [savedOpen, setSavedOpen] = useState(false);
  const [eliminarSnackOpen, setEliminarSnackOpen] = useState(false);
  const [eliminarDialog, setEliminarDialog] = useState<EliminarDialogState | null>(null);
  const [nuevaPreferidaId, setNuevaPreferidaId] = useState('');
  const [extrasMenu, setExtrasMenu] = useState<ExtrasMenuState | null>(null);

  // Multi-edit state for OCR items
  const [ocrEditForms, setOcrEditForms] = useState<Record<string, DireccionForm>>({});

  const isFormOpen = form !== null;
  const editingId = isFormOpen && formMode.kind === 'edit' ? formMode.id : null;

  useEffect(() => {
    onDirtyChange?.(isFormOpen);
  }, [isFormOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize edit forms for all OCR items when OCR finishes
  useEffect(() => {
    if (!editOcrItems || ocrAddedIds.length === 0) return;
    const init: Record<string, DireccionForm> = {};
    for (const d of direcciones) {
      if (ocrAddedIds.includes(d.id)) {
        init[d.id] = {
          tipo: d.tipo,
          pais: d.pais,
          departamento: d.departamento ?? '',
          ciudad: d.ciudad ?? '',
          via: d.viaPrincipal,
          num1: d.num1,
          num1Extras: d.num1Extras ?? [],
          num2: d.num2,
          num2Extras: d.num2Extras ?? [],
          num3: d.num3,
          complemento: d.complemento ?? '',
          showComplemento: !!d.complemento,
        };
      }
    }
    setOcrEditForms(init);
  }, [editOcrItems]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateOcrForm = (id: string, updater: (f: DireccionForm) => DireccionForm) => {
    setOcrEditForms((prev) => ({ ...prev, [id]: updater(prev[id]) }));
  };

  const handleOcrConfirm = (id: string) => {
    const f = ocrEditForms[id];
    if (!f) return;
    onDireccionesChange(
      direcciones.map((d) =>
        d.id === id
          ? {
              ...d,
              tipo: f.tipo,
              pais: f.pais,
              departamento: f.departamento,
              ciudad: f.ciudad,
              viaPrincipal: f.via,
              num1: f.num1,
              num1Extras: f.num1Extras.length > 0 ? f.num1Extras : undefined,
              num2: f.num2,
              num2Extras: f.num2Extras.length > 0 ? f.num2Extras : undefined,
              num3: f.num3,
              complemento: f.complemento || undefined,
            }
          : d
      )
    );
    setOcrEditForms((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleOcrCancel = (id: string) => {
    onDireccionesChange(direcciones.filter((d) => d.id !== id));
    setOcrEditForms((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

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
    afterExtraId?: string,
    itemId?: string,
  ) => {
    setExtrasMenu({ anchor: e.currentTarget, target, afterExtraId, itemId });
  };

  const handleExtrasMenuClose = () => setExtrasMenu(null);

  const handleAddExtra = (type: 'letra' | 'sector') => {
    if (!extrasMenu) return;
    const { target, afterExtraId, itemId } = extrasMenu;
    const key = target === 'num1' ? 'num1Extras' : 'num2Extras';
    const newExtra: AddressExtra = { id: Date.now().toString(), type, value: '' };

    if (itemId) {
      // OCR form item
      updateOcrForm(itemId, (f) => {
        const current = f[key] as AddressExtra[];
        let updated: AddressExtra[];
        if (afterExtraId) {
          const idx = current.findIndex((e) => e.id === afterExtraId);
          updated = [...current.slice(0, idx + 1), newExtra, ...current.slice(idx + 1)];
        } else {
          updated = [...current, newExtra];
        }
        return { ...f, [key]: updated };
      });
    } else if (form) {
      const current = form[key] as AddressExtra[];
      let updated: AddressExtra[];
      if (afterExtraId) {
        const idx = current.findIndex((e) => e.id === afterExtraId);
        updated = [...current.slice(0, idx + 1), newExtra, ...current.slice(idx + 1)];
      } else {
        updated = [...current, newExtra];
      }
      setForm((f) => (f ? { ...f, [key]: updated } : f));
    }
    handleExtrasMenuClose();
  };

  const handleRemoveExtra = (target: 'num1' | 'num2', id: string, itemId?: string) => {
    const key = target === 'num1' ? 'num1Extras' : 'num2Extras';
    if (itemId) {
      updateOcrForm(itemId, (f) => ({
        ...f,
        [key]: (f[key] as AddressExtra[]).filter((e) => e.id !== id),
      }));
    } else {
      setForm((f) =>
        f ? { ...f, [key]: (f[key] as AddressExtra[]).filter((e) => e.id !== id) } : f
      );
    }
  };

  const handleExtraChange = (target: 'num1' | 'num2', id: string, value: string, itemId?: string) => {
    const key = target === 'num1' ? 'num1Extras' : 'num2Extras';
    if (itemId) {
      updateOcrForm(itemId, (f) => ({
        ...f,
        [key]: (f[key] as AddressExtra[]).map((e) => (e.id === id ? { ...e, value } : e)),
      }));
    } else {
      setForm((f) =>
        f ? { ...f, [key]: (f[key] as AddressExtra[]).map((e) => (e.id === id ? { ...e, value } : e)) } : f
      );
    }
  };

  const formatAddress = (dir: Direccion) => {
    const num1Part = dir.num1 + (dir.num1Extras ?? []).map((e) => ` ${e.value}`).join('');
    const num2Part = dir.num2 + (dir.num2Extras ?? []).map((e) => ` ${e.value}`).join('');
    return `${dir.viaPrincipal} #${num1Part}-${num2Part}${dir.complemento ? ` ${dir.complemento}` : ''}`;
  };

  const renderAddressFields = (
    f: DireccionForm,
    onChange: (updater: (prev: DireccionForm) => DireccionForm) => void,
    itemId?: string,
  ) => (
    <>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Tipo de dirección <Box component="span" sx={{ color: 'error.main' }}>*</Box>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {TIPOS_DIRECCION.map((tipo) => (
            <ToggleButton
              key={tipo}
              value={tipo}
              selected={f.tipo === tipo}
              onChange={() => onChange((ff) => ({ ...ff, tipo }))}
              size="small"
              sx={TOGGLE_CHIP_SX}
            >
              <Typography variant="caption">{tipo}</Typography>
            </ToggleButton>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControl sx={{ flex: 1 }} size="small" required>
          <InputLabel>País</InputLabel>
          <Select value={f.pais} label="País" onChange={(e) => onChange((ff) => ({ ...ff, pais: e.target.value }))}>
            {PAISES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1 }} size="small">
          <InputLabel>Departamento</InputLabel>
          <Select value={f.departamento} label="Departamento" onChange={(e) => onChange((ff) => ({ ...ff, departamento: e.target.value }))}>
            {DEPARTAMENTOS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1 }} size="small">
          <InputLabel>Ciudad</InputLabel>
          <Select value={f.ciudad} label="Ciudad" onChange={(e) => onChange((ff) => ({ ...ff, ciudad: e.target.value }))}>
            {CIUDADES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl sx={{ flex: '1 1 110px', minWidth: 110 }} size="small" required>
          <InputLabel>Vía principal</InputLabel>
          <Select value={f.via} label="Vía principal" onChange={(e) => onChange((ff) => ({ ...ff, via: e.target.value }))}>
            {VIAS.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </FormControl>

        <Box sx={hoverPlusGroup}>
          <TextField
            label="Num."
            required
            size="small"
            sx={{ width: 72 }}
            value={f.num1}
            onChange={(e) => onChange((ff) => ({ ...ff, num1: e.target.value }))}
          />
          <IconButton
            className="plus-btn"
            size="small"
            onClick={(e) => handleExtrasMenuOpen(e, 'num1', undefined, itemId)}
            sx={{ color: 'text.secondary', p: '2px' }}
          >
            <IconPlus size={14} />
          </IconButton>
        </Box>

        {f.num1Extras.map((extra) => (
          <Box
            key={extra.id}
            sx={{ display: 'flex', alignItems: 'center', '& .extra-btn': { display: 'none' }, '&:hover .extra-btn': { display: 'inline-flex' } }}
          >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              {extra.type === 'letra' ? (
                <FormControl size="small" sx={{ width: 80 }}>
                  <InputLabel>Letra</InputLabel>
                  <Select value={extra.value} label="Letra" onChange={(e) => handleExtraChange('num1', extra.id, e.target.value, itemId)}>
                    {LETRAS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                  </Select>
                </FormControl>
              ) : (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sector</InputLabel>
                  <Select value={extra.value} label="Sector" onChange={(e) => handleExtraChange('num1', extra.id, e.target.value, itemId)}>
                    {SECTORES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              )}
              <IconButton
                className="extra-btn"
                size="small"
                onClick={() => handleRemoveExtra('num1', extra.id, itemId)}
                sx={{ position: 'absolute', top: '50%', right: 32, transform: 'translateY(-50%)', p: 0, width: 16, height: 16, color: 'text.secondary', zIndex: 1 }}
              >
                <IconX size={12} />
              </IconButton>
            </Box>
            <IconButton
              className="extra-btn"
              size="small"
              onClick={(e) => handleExtrasMenuOpen(e, 'num1', extra.id, itemId)}
              sx={{ color: 'text.secondary', p: '2px' }}
            >
              <IconPlus size={14} />
            </IconButton>
          </Box>
        ))}

        <Typography variant="body2" color="text.secondary">#</Typography>

        <Box sx={hoverPlusGroup}>
          <TextField
            label="Num."
            required
            size="small"
            sx={{ width: 72 }}
            value={f.num2}
            onChange={(e) => onChange((ff) => ({ ...ff, num2: e.target.value }))}
          />
          <IconButton
            className="plus-btn"
            size="small"
            onClick={(e) => handleExtrasMenuOpen(e, 'num2', undefined, itemId)}
            sx={{ color: 'text.secondary', p: '2px' }}
          >
            <IconPlus size={14} />
          </IconButton>
        </Box>

        {f.num2Extras.map((extra) => (
          <Box
            key={extra.id}
            sx={{ display: 'flex', alignItems: 'center', '& .extra-btn': { display: 'none' }, '&:hover .extra-btn': { display: 'inline-flex' } }}
          >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              {extra.type === 'letra' ? (
                <FormControl size="small" sx={{ width: 80 }}>
                  <InputLabel>Letra</InputLabel>
                  <Select value={extra.value} label="Letra" onChange={(e) => handleExtraChange('num2', extra.id, e.target.value, itemId)}>
                    {LETRAS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                  </Select>
                </FormControl>
              ) : (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sector</InputLabel>
                  <Select value={extra.value} label="Sector" onChange={(e) => handleExtraChange('num2', extra.id, e.target.value, itemId)}>
                    {SECTORES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              )}
              <IconButton
                className="extra-btn"
                size="small"
                onClick={() => handleRemoveExtra('num2', extra.id, itemId)}
                sx={{ position: 'absolute', top: '50%', right: 32, transform: 'translateY(-50%)', p: 0, width: 16, height: 16, color: 'text.secondary', zIndex: 1 }}
              >
                <IconX size={12} />
              </IconButton>
            </Box>
            <IconButton
              className="extra-btn"
              size="small"
              onClick={(e) => handleExtrasMenuOpen(e, 'num2', extra.id, itemId)}
              sx={{ color: 'text.secondary', p: '2px' }}
            >
              <IconPlus size={14} />
            </IconButton>
          </Box>
        ))}

        <Typography variant="body2" color="text.secondary">-</Typography>

        <TextField
          label="Num."
          required
          size="small"
          sx={{ width: 72 }}
          value={f.num3}
          onChange={(e) => onChange((ff) => ({ ...ff, num3: e.target.value }))}
        />
      </Box>

      {f.showComplemento ? (
        <TextField
          label="Complemento"
          fullWidth
          size="small"
          value={f.complemento}
          onChange={(e) => onChange((ff) => ({ ...ff, complemento: e.target.value }))}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  edge="end"
                  onClick={() => onChange((ff) => ({ ...ff, showComplemento: false, complemento: '' }))}
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
          onClick={() => onChange((ff) => ({ ...ff, showComplemento: true }))}
          sx={{ color: 'text.secondary', alignSelf: 'flex-start' }}
        >
          Agregar complemento
        </Button>
      )}
    </>
  );

  const renderForm = (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, ...fadeIn }}>
      {formMode.kind === 'new' && direcciones.length > 0 && (
        <Typography variant="subtitle2">Nueva dirección</Typography>
      )}
      {form && renderAddressFields(form, (updater) => setForm((f) => f ? updater(f) : f))}
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

  const renderOcrItemForm = (id: string) => {
    const f = ocrEditForms[id];
    if (!f) return null;
    return (
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, ...fadeIn }}>
        {renderAddressFields(
          f,
          (updater) => updateOcrForm(id, updater),
          id,
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="text" size="small" onClick={() => handleOcrCancel(id)}>
            Cancelar
          </Button>
          <Button variant="outlined" size="small" onClick={() => handleOcrConfirm(id)}>
            Agregar
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          border: isFormOpen && mode === 'edit' ? '2px solid' : '1px solid',
          borderColor: isFormOpen && mode === 'edit' ? 'primary.main' : 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 32 }}>
            <Box sx={{ color: 'text.secondary', display: 'flex' }}>
              <IconMapPin size={18} />
            </Box>
            <Typography variant="subtitle2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Dirección
            </Typography>
          </Box>

          <Box sx={{ bgcolor: 'grey.100', borderRadius: 1, overflow: 'hidden' }}>
            {direcciones.map((dir) => {
              if (editingId === dir.id) {
                return <Box key={dir.id}>{renderForm}</Box>;
              }
              if (editOcrItems && ocrEditForms[dir.id]) {
                return <Box key={dir.id}>{renderOcrItemForm(dir.id)}</Box>;
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
                      <IconPencil size={16} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEliminar(dir)} sx={{ color: 'text.secondary' }}>
                      <IconTrash size={14} />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}

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

      {/* Shared extras menu */}
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
