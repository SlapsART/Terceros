import { memo, useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Tooltip, IconButton } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import { IconArrowRight, IconCircleCheck, IconX } from '@tabler/icons-react';
import { useNotificacionesContext } from '../context/NotificacionesContext';
import type { Notificacion } from '@/shared/types/notificacion';
import sincoLogoUrl from '@/shared/assets/sinco-logo.svg';

const CARD_WIDTH = 320;
const BORDER_RADIUS = '50px';
const CARD_HEIGHT = 40;
const GHOST_PEEK = 8;

function agruparPorFecha(items: Notificacion[]) {
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  const mismoDia = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const grupos: { label: string; items: typeof items }[] = [];
  const hoyItems = items.filter(n => mismoDia(n.timestamp, hoy));
  const ayerItems = items.filter(n => mismoDia(n.timestamp, ayer));
  grupos.push({ label: 'Hoy', items: hoyItems });
  if (ayerItems.length) grupos.push({ label: 'Ayer', items: ayerItems });
  return grupos;
}

const EASE_STD    = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
const EASE_OUT    = 'cubic-bezier(0.0, 0.0, 0.2, 1)';
const EASE_SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const enterSlide = keyframes`
  0%   { opacity: 0; transform: translateX(56px) scale(0.9);  }
  50%  { opacity: 1; transform: translateX(-9px) scale(1.02); }
  70%  { transform: translateX(4px)  scale(0.999); }
  85%  { transform: translateX(-2px) scale(1);    }
  100% { opacity: 1; transform: translateX(0)    scale(1);    }
`;

const enterPanel = keyframes`
  from { opacity: 0; transform: translateY(-10px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)     scale(1);    }
`;

const enterPanelCard = keyframes`
  from { opacity: 0; transform: translateY(-6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

const clearedPill = keyframes`
  0%   { opacity: 0; transform: translateX(56px) scale(0.9);   }
  11%  { opacity: 1; transform: translateX(-9px) scale(1.02);  }
  15%  { opacity: 1; transform: translateX(4px)  scale(0.999); }
  18%  { opacity: 1; transform: translateX(-2px) scale(1);     }
  22%  { opacity: 1; transform: translateX(0)    scale(1);     }
  86%  { opacity: 1; transform: translateX(0)    scale(1);     }
  93%  { opacity: 1; transform: translateX(-5px) scale(1.005); }
  100% { opacity: 0; transform: translateX(64px) scale(0.9);   }
`;

const exitCard = keyframes`
  0%   { opacity: 1; transform: translateX(0)    scale(1);    }
  100% { opacity: 0; transform: translateX(28px) scale(0.97); }
`;

const exitAll = keyframes`
  0%   { opacity: 1; transform: translateX(0)    scale(1);    }
  100% { opacity: 0; transform: translateX(24px) scale(0.97); }
`;

const exitPanel = keyframes`
  from { opacity: 1; transform: translateY(0)   scale(1);    }
  to   { opacity: 0; transform: translateY(-6px) scale(0.98); }
`;

const NotificacionCard = memo(function NotificacionCard({
  notificacion,
  onClose,
  inPanel = false,
  index = 0,
  exitingAll = false,
  exiting = false,
  fresh = false,
}: {
  notificacion: Notificacion;
  onClose: (id: string) => void;
  inPanel?: boolean;
  index?: number;
  exitingAll?: boolean;
  exiting?: boolean;
  fresh?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [completing, setCompleting] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (completing) return;
    setCompleting(true);
    timerRef.current = setTimeout(() => onClose(notificacion.id), 500);
  };

  const isExiting = exitingAll || exiting;

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'relative',
        width: '100%',
        animation: isExiting
          ? `${exitAll} 0.5s ${index * 0.06}s ${EASE_STD} both`
          : completing
            ? `${exitCard} 0.5s ${EASE_STD} forwards`
            : (inPanel && !fresh)
              ? `${enterPanelCard} 0.26s ${index * 0.045}s ${EASE_OUT} both`
              : `${enterSlide} 0.55s ${EASE_SPRING} both`,
      }}
    >
      <Tooltip title="Quitar" placement="top" disableInteractive arrow componentsProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -6] } }] } }}>
        <IconButton
          size="small"
          aria-label="Quitar"
          onClick={handleDismiss}
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            width: 20, height: 20,
            opacity: hovered && !completing && !isExiting ? 1 : 0,
            transition: `opacity 0.18s ${EASE_STD}`,
            bgcolor: 'background.paper',
            boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
            color: 'text.secondary',
            '&:hover': { bgcolor: 'grey.100', color: 'text.primary' },
          }}
        >
          <IconX size={12} />
        </IconButton>
      </Tooltip>

      <Box
        onClick={notificacion.onClick && !completing ? notificacion.onClick : undefined}
        sx={{
          px: 1.5, py: 1.25,
          border: '1px solid', borderColor: 'divider',
          borderRadius: BORDER_RADIUS,
          bgcolor: 'background.paper',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          width: '100%',
          display: 'flex', alignItems: 'center',
          cursor: notificacion.onClick && !completing ? 'pointer' : 'default',
          transition: `background-color 0.15s ${EASE_STD}, border-color 0.15s ${EASE_STD}`,
          '&:hover': {
            borderColor: 'text.disabled',
            ...(notificacion.onClick && !completing && { bgcolor: 'grey.50' }),
          },
        }}
      >
        <Typography variant="body2" color="text.secondary" noWrap sx={{ flex: 1 }}>
          {notificacion.mensaje}
        </Typography>

        {notificacion.onClick && (
          <Tooltip title="Abrir" placement="top" disableInteractive arrow componentsProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -6] } }] } }}>
            <Box
              component="button"
              type="button"
              aria-label="Abrir"
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); notificacion.onClick!(); }}
              sx={{
                flexShrink: 0,
                width: 16, height: 16, ml: 0.75,
                border: 'none', bgcolor: 'transparent',
                cursor: 'pointer', p: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: hovered && !completing ? 1 : 0,
                color: 'text.disabled',
                transition: `opacity 0.18s ${EASE_STD}, color 0.15s ${EASE_STD}`,
                '&:hover': { color: 'text.secondary' },
              }}
            >
              <IconArrowRight size={14} />
            </Box>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
});

export function NotificacionesWidget() {
  const { notificaciones, cerrarNotificacion, cerrarVarias, cerrarTodas, panelAbierto, togglePanel } =
    useNotificacionesContext();
  const [stackHovered, setStackHovered] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [revealedAt, setRevealedAt] = useState(0);
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevNotifsRef = useRef(notificaciones);

  useEffect(() => () => { if (clearTimerRef.current) clearTimeout(clearTimerRef.current); }, []);

  useEffect(() => {
    const prev = prevNotifsRef.current;
    prevNotifsRef.current = notificaciones;
    if (!panelAbierto) { setVisibleCount(4); setRevealedAt(0); return; }
    const newItems = notificaciones.filter(n => !prev.some(p => p.id === n.id));
    if (newItems.length === 0) return;
    const ids = newItems.map(n => n.id);
    setFreshIds(s => new Set([...s, ...ids]));
    setVisibleCount(vc => vc + newItems.length);
    const t = setTimeout(() => {
      setFreshIds(s => { const next = new Set(s); ids.forEach(id => next.delete(id)); return next; });
    }, 700);
    return () => clearTimeout(t);
  }, [notificaciones, panelAbierto]);

  const handleClearAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (clearingAll) return;
    setClearingAll(true);
    setStackHovered(false);
    const delay = notificaciones.length * 50 + 350;
    clearTimerRef.current = setTimeout(() => {
      cerrarTodas();
      setClearingAll(false);
      setCleared(true);
      setTimeout(() => setCleared(false), 2500);
    }, delay);
  };

  const handleBorrarGrupo = (ids: string[]) => {
    if (ids.some(id => exitingIds.has(id))) return;
    setExitingIds(prev => new Set([...prev, ...ids]));
    const delay = ids.length * 50 + 350;
    const isAll = ids.length === notificaciones.length;
    setTimeout(() => {
      cerrarVarias(ids);
      setExitingIds(prev => {
        const next = new Set(prev);
        ids.forEach(id => next.delete(id));
        return next;
      });
      if (isAll) {
        setCleared(true);
        setTimeout(() => setCleared(false), 2500);
      }
    }, delay);
  };

  const theme = useTheme();
  const bgDefault      = theme.palette.background.default;
  const textSecondary  = theme.palette.text.secondary;
  const commonWhite    = theme.palette.common.white;
  const successMain    = theme.palette.success.main;
  const acrylicBg      = alpha(bgDefault, 0.8);
  const acrylicBgSolid = alpha(bgDefault, 0.95);

  if (notificaciones.length === 0 && !cleared) return null;

  if (notificaciones.length === 0 && cleared) {
    return (
      <Box sx={{ position: 'fixed', top: 16, right: 24, zIndex: theme.zIndex.snackbar, width: CARD_WIDTH, filter: `drop-shadow(0 0 16px ${alpha(commonWhite, 0.9)}) drop-shadow(0 4px 12px rgba(2, 8, 31, 0.28))` }}>
        <Box sx={{
          px: 2, py: 1.25,
          border: '1px solid', borderColor: 'divider',
          borderRadius: BORDER_RADIUS,
          bgcolor: 'background.paper',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', gap: 1,
          animation: `${clearedPill} 2.5s ${EASE_OUT} forwards`,
        }}>
          <IconCircleCheck size={15} color={successMain} />
          <Typography variant="body2" color="text.secondary">Todo revisado</Typography>
        </Box>
      </Box>
    );
  }

  const newest = notificaciones[0];
  const stackCount = Math.min(notificaciones.length - 1, 2);
  const containerHeight = CARD_HEIGHT + stackCount * GHOST_PEEK;

  return (
    <Box sx={{ position: 'fixed', top: 16, right: 24, zIndex: theme.zIndex.snackbar, width: CARD_WIDTH, filter: `drop-shadow(0 0 16px ${alpha(commonWhite, 0.9)}) drop-shadow(0 4px 12px rgba(6, 5, 57, 0.2))` }}>
      {panelAbierto ? (
        <Box
          sx={{
            bgcolor: acrylicBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: `1px solid ${alpha(commonWhite, 0.6)}`,
            overflow: 'hidden',
            animation: clearingAll
              ? `${exitPanel} 0.4s ${EASE_STD} forwards`
              : `${enterPanel} 0.28s ${EASE_OUT} both`,
            pointerEvents: clearingAll ? 'none' : 'auto',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={sincoLogoUrl} height={15} alt="SINCO.IO" style={{ display: 'block' }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Button
                size="small"
                onClick={handleClearAll}
                sx={{ fontSize: '0.7rem', color: 'text.secondary', minWidth: 'auto', px: 1, py: 0.25, transition: `color 0.15s ${EASE_STD}`, '&:hover': { color: 'text.primary' } }}
              >
                Borrar todo
              </Button>
              <Tooltip title="Cerrar" placement="bottom" disableInteractive>
                <IconButton size="small" onClick={togglePanel} sx={{ color: 'text.disabled', width: 24, height: 24, transition: `color 0.15s ${EASE_STD}`, '&:hover': { color: 'text.secondary' } }}>
                  <IconX size={14} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ maxHeight: 480, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5, p: 1.5 }}>
            {(() => {
              const grupos = agruparPorFecha(notificaciones.slice(0, visibleCount));
              let globalIndex = 0;
              return grupos.map((grupo, gi) => (
                <Box key={grupo.label}>
                  <Box
                    onMouseEnter={() => setHoveredGroup(grupo.label)}
                    onMouseLeave={() => setHoveredGroup(null)}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5, pb: 0.5, pt: gi === 0 ? 0 : 1 }}
                  >
                    <Typography variant="caption" color="text.disabled">{grupo.label}</Typography>
                    {grupo.items.length > 0 && (
                      <Button
                        size="small"
                        onClick={() => handleBorrarGrupo(grupo.items.map(n => n.id))}
                        sx={{
                          fontSize: '0.7rem', color: 'text.disabled', minWidth: 'auto', px: 1, py: 0, lineHeight: 1.5,
                          opacity: hoveredGroup === grupo.label ? 1 : 0,
                          pointerEvents: hoveredGroup === grupo.label ? 'auto' : 'none',
                          transition: `opacity 0.15s ${EASE_STD}, color 0.15s ${EASE_STD}`,
                          '&:hover': { color: 'text.secondary' },
                        }}
                      >
                        Borrar
                      </Button>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {grupo.items.map(n => {
                      const animIdx = globalIndex - revealedAt;
                      globalIndex++;
                      return (
                        <NotificacionCard
                          key={n.id}
                          notificacion={n}
                          onClose={cerrarNotificacion}
                          inPanel
                          index={animIdx}
                          exitingAll={clearingAll}
                          exiting={exitingIds.has(n.id)}
                          fresh={freshIds.has(n.id)}
                        />
                      );
                    })}
                  </Box>
                </Box>
              ));
            })()}
          </Box>

          {notificaciones.length > visibleCount && (
            <Box sx={{ borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center', py: 0.5 }}>
              <Button
                size="small"
                onClick={() => {
                  setRevealedAt(visibleCount);
                  setVisibleCount(prev => Math.min(prev + 4, notificaciones.length));
                }}
                sx={{ fontSize: '0.7rem', color: 'text.secondary', minWidth: 'auto', px: 1.5, py: 0.25, transition: `color 0.15s ${EASE_STD}`, '&:hover': { color: 'text.primary' } }}
              >
                Ver más ({notificaciones.length - visibleCount})
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Box onMouseLeave={() => setStackHovered(false)} sx={{ cursor: notificaciones.length > 1 ? 'pointer' : 'default' }}>
          <Box
            onMouseEnter={() => notificaciones.length > 1 && setStackHovered(true)}
            sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.75, opacity: notificaciones.length > 1 && stackHovered ? 1 : 0, pointerEvents: notificaciones.length > 1 ? 'auto' : 'none', transition: `opacity 0.2s ${EASE_STD}` }}
          >
            <Box
              component="button"
              type="button"
              onClick={handleClearAll}
              sx={{
                pointerEvents: stackHovered ? 'auto' : 'none',
                px: 1.5, py: 0.375,
                bgcolor: acrylicBgSolid,
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid', borderColor: 'divider',
                borderRadius: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5,
                transition: `background-color 0.15s ${EASE_STD}`,
                '&:hover': { bgcolor: bgDefault },
              }}
            >
              <IconX size={10} color={textSecondary} />
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>Borrar todo</Typography>
            </Box>
          </Box>

          <Box
            onMouseEnter={() => setStackHovered(true)}
            onMouseLeave={() => setStackHovered(false)}
            sx={{ position: 'relative', height: containerHeight, transition: `height 0.25s ${EASE_STD}` }}
          >
            {stackCount >= 2 && (
              <Box onClick={togglePanel} sx={{ position: 'absolute', top: GHOST_PEEK * 2, left: '50%', transform: 'translateX(-50%)', width: '82%', height: CARD_HEIGHT, border: '1px solid', borderColor: 'divider', borderRadius: BORDER_RADIUS, bgcolor: 'background.paper', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', zIndex: 0, cursor: 'pointer', opacity: clearingAll ? 0 : 1, transition: `opacity 0.3s ${EASE_STD}` }} />
            )}
            {stackCount >= 1 && (
              <Box onClick={togglePanel} sx={{ position: 'absolute', top: GHOST_PEEK, left: '50%', transform: 'translateX(-50%)', width: '91%', height: CARD_HEIGHT, border: '1px solid', borderColor: 'divider', borderRadius: BORDER_RADIUS, bgcolor: 'background.paper', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', zIndex: 1, cursor: 'pointer', opacity: clearingAll ? 0 : 1, transition: `opacity 0.3s ${EASE_STD}` }} />
            )}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}>
              <NotificacionCard
                key={newest.id}
                notificacion={newest}
                onClose={cerrarNotificacion}
                exitingAll={clearingAll}
              />
            </Box>
          </Box>

          <Box
            onMouseEnter={() => setStackHovered(true)}
            onMouseLeave={() => setStackHovered(false)}
            onClick={notificaciones.length > 1 ? togglePanel : undefined}
            sx={{ display: 'flex', justifyContent: 'center', mt: 0.75, opacity: notificaciones.length > 1 && !clearingAll ? 1 : 0, pointerEvents: notificaciones.length > 1 ? 'auto' : 'none', transition: `opacity 0.3s ${EASE_STD}` }}
          >
            <Box sx={{ px: 1.5, py: 0.375, bgcolor: acrylicBgSolid, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid', borderColor: 'divider', borderRadius: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', cursor: 'pointer', transition: `background-color 0.15s ${EASE_STD}`, '&:hover': { bgcolor: bgDefault } }}>
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>+{notificaciones.length - 1} más</Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
