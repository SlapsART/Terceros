export type TipoNotificacion = 'info' | 'success' | 'warning' | 'error';

export interface Notificacion {
  id: string;
  mensaje: string;
  timestamp: Date;
  tipo: TipoNotificacion;
  autoDismiss: boolean;
  duracion: number;
  onClick?: () => void;
}
