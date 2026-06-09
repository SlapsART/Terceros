import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
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
import InputAdornment from '@mui/material/InputAdornment';
import { IconAddressBook, IconPlus, IconPencil, IconX } from '@tabler/icons-react';
import type { Contacto, ContactoTipo } from '@/shared/types/tercero';
import { fadeIn } from '@/shared/ui/animations';

const TIPOS_CONTACTO: ContactoTipo[] = [
  'Representante legal',
  'Tesorero',
  'Comercial',
  'Técnico',
  'Contacto de facturación',
  'Contacto de notificaciones',
  'Otro',
];

const CODIGOS_PAIS = ['+57', '+1', '+52', '+51', '+54'];

interface ContactosCardProps {
  contactos: Contacto[];
  onContactosChange: (contactos: Contacto[]) => void;
  onTerceroAutoInactivar?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
  mode?: 'creation' | 'edit';
  skeletonCount?: number;
  disableAutoForm?: boolean;
  ocrAddedIds?: string[];
  onContactoActivado?: (updatedContactos: Contacto[]) => void;
  editOcrItems?: boolean;
}

interface ContactoForm {
  tipo: ContactoTipo | '';
  email: string;
  codigoPais: string;
  telefono: string;
  nombre: string;
  showNombre: boolean;
}

const EMPTY_FORM: ContactoForm = {
  tipo: '',
  email: '',
  codigoPais: '+57',
  telefono: '',
  nombre: '',
  showNombre: false,
};

type FormMode = { kind: 'new' } | { kind: 'edit'; id: string };

interface InactivarDialogState {
  contactoId: string;
  nombre: string;
  isPrincipal: boolean;
  otrosContactos: Contacto[];
}

const OCR_ROW_SX = {
  animation: 'ocrContactReveal 0.4s ease-out',
  '@keyframes ocrContactReveal': {
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

export function ContactosCard({
  contactos,
  onContactosChange,
  onTerceroAutoInactivar,
  onDirtyChange,
  mode = 'edit',
  skeletonCount = 0,
  disableAutoForm = false,
  ocrAddedIds = [],
  onContactoActivado,
  editOcrItems = false,
}: ContactosCardProps) {
  const [form, setForm] = useState<ContactoForm | null>(
    !disableAutoForm && contactos.length === 0 ? EMPTY_FORM : null
  );
  const [formMode, setFormMode] = useState<FormMode>({ kind: 'new' });
  const [savedOpen, setSavedOpen] = useState(false);
  const [inactivarSnackOpen, setInactivarSnackOpen] = useState(false);
  const [inactivarDialog, setInactivarDialog] = useState<InactivarDialogState | null>(null);
  const [nuevoPrincipalId, setNuevoPrincipalId] = useState('');

  // Multi-edit state for OCR items
  const [ocrEditForms, setOcrEditForms] = useState<Record<string, ContactoForm>>({});

  const isFormOpen = form !== null;
  const editingId = isFormOpen && formMode.kind === 'edit' ? formMode.id : null;

  useEffect(() => {
    onDirtyChange?.(isFormOpen);
  }, [isFormOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize edit forms for all OCR items when OCR finishes
  useEffect(() => {
    if (!editOcrItems || ocrAddedIds.length === 0) return;
    const init: Record<string, ContactoForm> = {};
    for (const c of contactos) {
      if (ocrAddedIds.includes(c.id)) {
        init[c.id] = {
          tipo: c.tipo,
          email: c.email,
          codigoPais: c.codigoPais,
          telefono: c.telefono,
          nombre: c.nombre ?? '',
          showNombre: !!c.nombre,
        };
      }
    }
    setOcrEditForms(init);
  }, [editOcrItems]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateOcrForm = (id: string, updater: (f: ContactoForm) => ContactoForm) => {
    setOcrEditForms((prev) => ({ ...prev, [id]: updater(prev[id]) }));
  };

  const handleOcrConfirm = (id: string) => {
    const f = ocrEditForms[id];
    if (!f) return;
    onContactosChange(
      contactos.map((c) =>
        c.id === id
          ? {
              ...c,
              tipo: (f.tipo || c.tipo) as ContactoTipo,
              email: f.email,
              codigoPais: f.codigoPais,
              telefono: f.telefono,
              nombre: f.nombre || undefined,
            }
          : c
      )
    );
    setOcrEditForms((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleOcrCancel = (id: string) => {
    onContactosChange(contactos.filter((c) => c.id !== id));
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

  const openEdit = (contacto: Contacto) => {
    setFormMode({ kind: 'edit', id: contacto.id });
    setForm({
      tipo: contacto.tipo,
      email: contacto.email,
      codigoPais: contacto.codigoPais,
      telefono: contacto.telefono,
      nombre: contacto.nombre ?? '',
      showNombre: !!contacto.nombre,
    });
  };

  const handleCancelar = () => setForm(null);

  const handleConfirm = () => {
    if (!form) return;
    if (formMode.kind === 'new') {
      const nuevo: Contacto = {
        id: Date.now().toString(),
        tipo: (form.tipo || 'Otro') as ContactoTipo,
        email: form.email,
        codigoPais: form.codigoPais,
        telefono: form.telefono,
        nombre: form.nombre || undefined,
        esPrincipal: contactos.length === 0,
        activo: true,
      };
      onContactosChange([...contactos, nuevo]);
    } else {
      onContactosChange(
        contactos.map((c) =>
          c.id === formMode.id
            ? {
                ...c,
                tipo: (form.tipo || c.tipo) as ContactoTipo,
                email: form.email,
                codigoPais: form.codigoPais,
                telefono: form.telefono,
                nombre: form.nombre || undefined,
              }
            : c
        )
      );
      setSavedOpen(true);
    }
    setForm(null);
  };

  const handleToggleActivo = (contacto: Contacto) => {
    if (contacto.activo) {
      const otros = contactos.filter((c) => c.id !== contacto.id && c.activo);
      setInactivarDialog({
        contactoId: contacto.id,
        nombre: contacto.nombre ?? contacto.tipo,
        isPrincipal: contacto.esPrincipal,
        otrosContactos: otros,
      });
      setNuevoPrincipalId(otros.length > 0 ? otros[0].id : '');
    } else {
      const updated = contactos.map((c) => (c.id === contacto.id ? { ...c, activo: true } : c));
      onContactosChange(updated);
      onContactoActivado?.(updated);
    }
  };

  const handleInactivarConfirm = () => {
    if (!inactivarDialog) return;
    const { contactoId, isPrincipal, otrosContactos } = inactivarDialog;
    const updated = contactos.map((c) => {
      if (c.id === contactoId) return { ...c, activo: false, esPrincipal: false };
      if (isPrincipal && otrosContactos.length > 0 && c.id === nuevoPrincipalId)
        return { ...c, esPrincipal: true };
      return c;
    });
    onContactosChange(updated);
    setInactivarDialog(null);
    setInactivarSnackOpen(true);
    const quedanActivos = updated.some((c) => c.activo);
    if (!quedanActivos) {
      onTerceroAutoInactivar?.();
    }
  };

  const handleInactivarCancel = () => setInactivarDialog(null);

  const selectTipo = (t: ContactoTipo) => {
    setForm((f) => (f ? { ...f, tipo: t } : f));
  };

  const renderOcrItemForm = (id: string) => {
    const f = ocrEditForms[id];
    if (!f) return null;
    return (
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, ...fadeIn }}>
        {/* Tipo de contacto */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Tipo de contacto{' '}
            <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {TIPOS_CONTACTO.map((t) => (
              <ToggleButton
                key={t}
                value={t}
                selected={f.tipo === t}
                onChange={() => updateOcrForm(id, (ff) => ({ ...ff, tipo: t }))}
                size="small"
                sx={TOGGLE_CHIP_SX}
              >
                <Typography variant="caption">{t}</Typography>
              </ToggleButton>
            ))}
          </Box>
        </Box>

        {/* Correo + teléfono */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            label="Correo electrónico"
            required
            size="small"
            sx={{ flex: 1 }}
            value={f.email}
            onChange={(e) => updateOcrForm(id, (ff) => ({ ...ff, email: e.target.value }))}
          />
          <FormControl size="small" sx={{ width: 88 }}>
            <Select
              value={f.codigoPais}
              onChange={(e) => updateOcrForm(id, (ff) => ({ ...ff, codigoPais: e.target.value }))}
            >
              {CODIGOS_PAIS.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Número"
            required
            size="small"
            sx={{ flex: 1 }}
            value={f.telefono}
            onChange={(e) => updateOcrForm(id, (ff) => ({ ...ff, telefono: e.target.value }))}
          />
        </Box>

        {/* Nombre */}
        {f.showNombre ? (
          <TextField
            label="Nombre"
            size="small"
            fullWidth
            value={f.nombre}
            onChange={(e) => updateOcrForm(id, (ff) => ({ ...ff, nombre: e.target.value }))}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    edge="end"
                    onClick={() => updateOcrForm(id, (ff) => ({ ...ff, showNombre: false, nombre: '' }))}
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
            onClick={() => updateOcrForm(id, (ff) => ({ ...ff, showNombre: true }))}
            sx={{ color: 'text.secondary', alignSelf: 'flex-start' }}
          >
            Agregar nombre
          </Button>
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

  const renderForm = (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, ...fadeIn }}>
      {formMode.kind === 'new' && contactos.length > 0 && (
        <Typography variant="subtitle2">Nuevo contacto</Typography>
      )}

      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Tipo de contacto{' '}
          <Box component="span" sx={{ color: 'error.main' }}>*</Box>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {TIPOS_CONTACTO.map((t) => (
            <ToggleButton
              key={t}
              value={t}
              selected={form?.tipo === t}
              onChange={() => selectTipo(t)}
              size="small"
              sx={TOGGLE_CHIP_SX}
            >
              <Typography variant="caption">{t}</Typography>
            </ToggleButton>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          label="Correo electrónico"
          required
          size="small"
          sx={{ flex: 1 }}
          value={form?.email ?? ''}
          onChange={(e) => setForm((f) => (f ? { ...f, email: e.target.value } : f))}
        />
        <FormControl size="small" sx={{ width: 88 }}>
          <Select
            value={form?.codigoPais ?? '+57'}
            onChange={(e) => setForm((f) => (f ? { ...f, codigoPais: e.target.value } : f))}
          >
            {CODIGOS_PAIS.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Número"
          required
          size="small"
          sx={{ flex: 1 }}
          value={form?.telefono ?? ''}
          onChange={(e) => setForm((f) => (f ? { ...f, telefono: e.target.value } : f))}
        />
      </Box>

      {formMode.kind === 'new' && (
        form?.showNombre ? (
          <TextField
            label="Nombre"
            size="small"
            fullWidth
            value={form.nombre}
            onChange={(e) => setForm((f) => (f ? { ...f, nombre: e.target.value } : f))}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    edge="end"
                    onClick={() => setForm((f) => f ? { ...f, showNombre: false, nombre: '' } : f)}
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
            onClick={() => setForm((f) => (f ? { ...f, showNombre: true } : f))}
            sx={{ color: 'text.secondary', alignSelf: 'flex-start' }}
          >
            Agregar nombre
          </Button>
        )
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
          border: isFormOpen && mode === 'edit' ? '2px solid' : '1px solid',
          borderColor: isFormOpen && mode === 'edit' ? 'primary.main' : 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 32 }}>
          <Box sx={{ color: 'text.secondary', display: 'flex' }}>
            <IconAddressBook size={18} />
          </Box>
          <Typography variant="subtitle2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            Contactos
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'grey.100', borderRadius: 2, overflow: 'hidden' }}>
          {contactos.map((contacto) => {
            if (editingId === contacto.id) {
              return <Box key={contacto.id}>{renderForm}</Box>;
            }
            if (editOcrItems && ocrEditForms[contacto.id]) {
              return <Box key={contacto.id}>{renderOcrItemForm(contacto.id)}</Box>;
            }
            const isOcrRow = ocrAddedIds.includes(contacto.id);
            return (
              <Box
                key={contacto.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.5,
                  ...(isOcrRow && OCR_ROW_SX),
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                    {contacto.nombre && (
                      <Typography
                        variant="subtitle2"
                        color={contacto.activo ? 'text.primary' : 'text.secondary'}
                      >
                        {contacto.nombre}
                      </Typography>
                    )}
                    {contacto.esPrincipal && contacto.activo && (
                      <Chip label="Principal" size="small" color="primary" variant="filled" />
                    )}
                    {!contacto.activo && (
                      <Chip label="Inactivo" size="small" color="default" variant="filled" />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {contacto.tipo} - {contacto.email} - {contacto.codigoPais} {contacto.telefono}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                  <IconButton size="small" sx={{ color: 'primary.main' }} onClick={() => openEdit(contacto)}>
                    <IconPencil size={16} />
                  </IconButton>
                  <Switch
                    size="small"
                    checked={contacto.activo}
                    onChange={() => handleToggleActivo(contacto)}
                  />
                </Box>
              </Box>
            );
          })}

          {skeletonCount > 0 && Array.from({ length: skeletonCount }).map((_, i) => (
            <Box key={`skeleton-c-${i}`} sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="45%" height={20} animation="wave" />
                <Skeleton variant="text" width="70%" height={16} animation="wave" sx={{ mt: 0.5 }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Skeleton variant="circular" width={28} height={28} animation="wave" />
                <Skeleton variant="rounded" width={36} height={20} animation="wave" sx={{ borderRadius: '10px', alignSelf: 'center' }} />
              </Box>
            </Box>
          ))}

          {formMode.kind === 'new' && form && renderForm}
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
            Agregar contacto
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
        open={inactivarSnackOpen}
        autoHideDuration={3000}
        onClose={() => setInactivarSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setInactivarSnackOpen(false)} severity="success">
          Contacto inactivado
        </Alert>
      </Snackbar>

      <Dialog
        open={Boolean(inactivarDialog)}
        onClose={handleInactivarCancel}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 2 } } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" component="span">
            Inactivar a &ldquo;{inactivarDialog?.nombre}&rdquo;
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {inactivarDialog?.isPrincipal && inactivarDialog.otrosContactos.length > 0 ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Para poder realizar la acción debes designar otro contacto como principal.
              </Typography>
              <RadioGroup
                value={nuevoPrincipalId}
                onChange={(e) => setNuevoPrincipalId(e.target.value)}
              >
                {inactivarDialog.otrosContactos.map((c) => (
                  <FormControlLabel
                    key={c.id}
                    value={c.id}
                    control={<Radio size="small" />}
                    label={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {c.tipo}
                        </Typography>
                        <Typography variant="body2">
                          {c.nombre ?? c.email}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {inactivarDialog?.isPrincipal
                ? 'Esta acción hará que no puedas usar el tercero hasta agregar otro contacto principal.'
                : '¿Confirmas que deseas inactivar este contacto?'}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="text" size="small" onClick={handleInactivarCancel}>
            Cancelar
          </Button>
          <Button variant="contained" size="small" disableElevation onClick={handleInactivarConfirm}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
