import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Notificacion, TipoNotificacion } from '@/shared/types/notificacion';

interface AgregarOpts {
  tipo?: TipoNotificacion;
  autoDismiss?: boolean;
  duracion?: number;
  onClick?: () => void;
  timestamp?: Date;
}

interface NotificacionesContextValue {
  notificaciones: Notificacion[];
  agregarNotificacion: (mensaje: string, opts?: AgregarOpts) => void;
  cerrarNotificacion: (id: string) => void;
  cerrarVarias: (ids: string[]) => void;
  cerrarTodas: () => void;
  panelAbierto: boolean;
  togglePanel: () => void;
}

const NotificacionesContext = createContext<NotificacionesContextValue | null>(null);

export function NotificacionesProvider({ children }: { children: ReactNode }) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const cerrarNotificacion = useCallback((id: string) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setNotificaciones(prev => prev.filter(n => n.id !== id));
  }, []);

  const agregarNotificacion = useCallback((mensaje: string, opts?: AgregarOpts) => {
    const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const nueva: Notificacion = {
      id,
      mensaje,
      timestamp: opts?.timestamp ?? new Date(),
      tipo: opts?.tipo ?? 'info',
      autoDismiss: opts?.autoDismiss ?? false,
      duracion: opts?.duracion ?? 8000,
      onClick: opts?.onClick,
    };
    const cutoff = Date.now() - 48 * 60 * 60 * 1000;
    setNotificaciones(prev => [nueva, ...prev.filter(n => n.timestamp.getTime() > cutoff)]);

    if (nueva.autoDismiss) {
      timers.current[id] = setTimeout(() => cerrarNotificacion(id), nueva.duracion);
    }
  }, [cerrarNotificacion]);

  const cerrarVarias = useCallback((ids: string[]) => {
    ids.forEach(id => { clearTimeout(timers.current[id]); delete timers.current[id]; });
    setNotificaciones(prev => prev.filter(n => !ids.includes(n.id)));
  }, []);

  const cerrarTodas = useCallback(() => {
    Object.values(timers.current).forEach(clearTimeout);
    timers.current = {};
    setNotificaciones([]);
    setPanelAbierto(false);
  }, []);

  const togglePanel = useCallback(() => setPanelAbierto(p => !p), []);

  return (
    <NotificacionesContext.Provider value={{
      notificaciones, agregarNotificacion, cerrarNotificacion, cerrarVarias, cerrarTodas, panelAbierto, togglePanel,
    }}>
      {children}
    </NotificacionesContext.Provider>
  );
}

export function useNotificacionesContext(): NotificacionesContextValue {
  const ctx = useContext(NotificacionesContext);
  if (!ctx) throw new Error('useNotificaciones debe usarse dentro de NotificacionesProvider');
  return ctx;
}
