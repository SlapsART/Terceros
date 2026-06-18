import {
  Box,
  Chip,
  Collapse,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconArrowsMoveVertical,
  IconArrowsMinimize,
  IconChevronDown,
  IconChevronUp,
  IconHistory,
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import type { DetalleBullet, HistorialEvento, TipoEvento } from '@/entities/historial-evento';
import { useHistorialEventos } from '../hooks/useHistorialEventos';

const DRAWER_WIDTH = 440;

const TIPO_COLORS: Record<TipoEvento, string> = {
  eliminacion: 'error.main',
  asignacion: 'primary.main',
  actualizacion: 'info.main',
  activacion: 'success.main',
};

// Hex colors for rgba box-shadow (same color, concentric rings at lower opacity)
// eliminacion=#d14343, asignacion=#2f43d0, actualizacion=#2d9fc5, activacion=#8fc93a
const TIPO_SHADOWS: Record<TipoEvento, string> = {
  eliminacion: '0 0 0 3px rgba(209,67,67,0.38), 0 0 0 6px rgba(209,67,67,0.12)',
  asignacion:  '0 0 0 3px rgba(47,67,208,0.38),  0 0 0 6px rgba(47,67,208,0.12)',
  actualizacion: '0 0 0 3px rgba(45,159,197,0.38), 0 0 0 6px rgba(45,159,197,0.12)',
  activacion: '0 0 0 3px rgba(143,201,58,0.38), 0 0 0 6px rgba(143,201,58,0.12)',
};

const TIPO_LABELS: Record<TipoEvento, string> = {
  eliminacion: 'Eliminación',
  asignacion: 'Asignación',
  actualizacion: 'Actualización',
  activacion: 'Activación',
};

interface HistorialEventosDrawerProps {
  open: boolean;
  onClose: () => void;
  eventos: HistorialEvento[];
  totalEventos: number;
}

interface DetalleItemProps {
  detalle: DetalleBullet;
}

function DetalleItem({ detalle }: DetalleItemProps) {
  if (detalle.valorAnterior !== undefined) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 0.5, mb: 0.25, overflow: 'hidden' }}>
        <Typography variant="body2" color="text.secondary" component="span" sx={{ flexShrink: 0 }}>·</Typography>
        <Box
          component="span"
          sx={{
            px: 0.75,
            py: 0.125,
            borderRadius: 0.5,
            bgcolor: 'grey.100',
            fontSize: '0.8125rem',
            color: 'text.secondary',
            flexShrink: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {detalle.valorAnterior}
        </Box>
        <Typography variant="body2" color="text.secondary" component="span" sx={{ flexShrink: 0 }}>→</Typography>
        <Box
          component="span"
          sx={{
            px: 0.75,
            py: 0.125,
            borderRadius: 0.5,
            bgcolor: 'grey.100',
            fontSize: '0.8125rem',
            color: 'text.primary',
            flexShrink: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {detalle.valor}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.25 }}>
      <Typography variant="body2" color="text.secondary" component="span" sx={{ mr: 0.5, flexShrink: 0 }}>
        ·
      </Typography>
      <Box sx={{ minWidth: 0 }}>
        {detalle.label && (
          <Typography variant="body2" color="text.secondary" component="span">
            {detalle.label}:{' '}
          </Typography>
        )}
        <Typography variant="body2" component="span">
          {detalle.valor.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </Typography>
        {detalle.chip && (
          <Box sx={{ mt: 0.5 }}>
            <Chip
              label={detalle.chip}
              size="small"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

interface EventoItemProps {
  evento: HistorialEvento;
  isFirst: boolean;
  isLast: boolean;
  expanded: boolean;
  onToggle: () => void;
}

function EventoItem({ evento, isFirst, isLast, expanded, onToggle }: EventoItemProps) {
  const hasDetalles = !!(evento.detalles?.length || evento.motivo);

  return (
    <Box sx={{ display: 'flex', px: 2 }}>
      {/* Date / time column */}
      <Box sx={{ width: 72, flexShrink: 0, pr: 1, pt: 0.5, textAlign: 'right' }}>
        <Typography
          variant="caption"
          display="block"
          color="text.secondary"
          sx={{ lineHeight: '16px', whiteSpace: 'nowrap' }}
        >
          {evento.fecha}
        </Typography>
        <Typography
          variant="caption"
          display="block"
          color="text.secondary"
          sx={{ lineHeight: '16px', whiteSpace: 'nowrap' }}
        >
          {evento.hora}
        </Typography>
      </Box>

      {/* Timeline column: connectors + dot */}
      <Box sx={{ width: 24, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '1px', height: 10, bgcolor: isFirst ? 'transparent' : 'grey.400' }} />
        <Tooltip
          title={
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {TIPO_LABELS[evento.tipo]}
            </Typography>
          }
          placement="left"
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: 'background.paper',
                boxShadow: 8,
                px: 2,
                py: 1.5,
                borderRadius: 1,
                color: 'text.primary',
              },
            },
            arrow: { sx: { color: 'background.paper' } },
          }}
          arrow
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: TIPO_COLORS[evento.tipo],
              boxShadow: TIPO_SHADOWS[evento.tipo],
              flexShrink: 0,
              cursor: 'default',
            }}
          />
        </Tooltip>
        {!isLast && (
          <Box sx={{ width: '1px', flex: 1, minHeight: 8, bgcolor: 'grey.400' }} />
        )}
      </Box>

      {/* Content column */}
      <Box sx={{ flex: 1, pl: 1.5, pb: 2.5 }}>
        <Box
          onClick={hasDetalles ? onToggle : undefined}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            minHeight: 20,
            mb: 0.25,
            cursor: hasDetalles ? 'pointer' : 'default',
          }}
        >
          <Typography variant="subtitle1" sx={{ pt: 0.25, flex: 1 }}>
            {evento.titulo}
          </Typography>
          {hasDetalles && (
            <Box sx={{ flexShrink: 0, ml: 0.5, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
              {expanded
                ? <IconChevronUp size={16} />
                : <IconChevronDown size={16} />
              }
            </Box>
          )}
        </Box>

        <Collapse in={expanded} unmountOnExit>
          <Box sx={{ mt: 0.5, mb: 1 }}>
            {evento.detalles?.map((detalle, i) => (
              <DetalleItem key={i} detalle={detalle} />
            ))}
            {evento.motivo && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Motivo:
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {evento.motivo}
                </Typography>
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}

export function HistorialEventosDrawer({
  open,
  onClose,
  eventos,
  totalEventos,
}: HistorialEventosDrawerProps) {
  const {
    searchQuery,
    setSearchQuery,
    sortDescending,
    toggleSort,
    filteredEventos,
    isExpanded,
    toggleExpanded,
    allExpanded,
    toggleAllExpanded,
  } = useHistorialEventos(eventos);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      hideBackdrop
      ModalProps={{
        sx: { pointerEvents: 'none' },
      }}
      PaperProps={{
        elevation: 8,
        sx: {
          width: DRAWER_WIDTH,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          pointerEvents: 'auto',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', px: 2, pt: 1.5, pb: 1, bgcolor: 'grey.50' }}>
        <IconHistory size={18} style={{ color: 'inherit', flexShrink: 0, marginRight: 8, marginTop: 3, opacity: 0.6 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1">
            Historial de eventos
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total de eventos: {totalEventos}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ mt: -0.5 }}>
          <IconX size={16} />
        </IconButton>
      </Box>

      {/* Search */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <TextField
          fullWidth
          placeholder="Buscar evento"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconSearch size={16} style={{ opacity: 0.6 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Sort controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          pb: 1,
        }}
      >
        <Box
          component="button"
          onClick={toggleSort}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 0,
            color: 'primary.main',
          }}
        >
          <Typography variant="button" color="primary">
            {sortDescending ? 'Más recientes primero' : 'Más antiguos primero'}
          </Typography>
          {sortDescending
            ? <IconArrowNarrowUp size={14} />
            : <IconArrowNarrowDown size={14} />
          }
        </Box>

        <Box
          component="button"
          onClick={toggleAllExpanded}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 0,
            color: 'primary.main',
          }}
        >
          <Typography variant="button" color="primary">
            {allExpanded ? 'Colapsar todo' : 'Expandir todo'}
          </Typography>
          {allExpanded
            ? <IconArrowsMinimize size={14} />
            : <IconArrowsMoveVertical size={14} />
          }
        </Box>
      </Box>

      {/* Events list */}
      <Box sx={{ flex: 1, overflowY: 'auto', pt: 1 }}>
        {filteredEventos.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No se encontraron eventos
            </Typography>
          </Box>
        ) : (
          filteredEventos.map((evento, index) => (
            <EventoItem
              key={evento.id}
              evento={evento}
              isFirst={index === 0}
              isLast={index === filteredEventos.length - 1}
              expanded={isExpanded(evento.id)}
              onToggle={() => toggleExpanded(evento.id)}
            />
          ))
        )}
      </Box>
    </Drawer>
  );
}
