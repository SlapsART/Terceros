export type TipoEventoHistorial = 'eliminacion' | 'asignacion' | 'actualizacion' | 'activacion';

export interface DetalleEventoHistorial {
  label: string;
  valor: string;
}

export interface EventoHistorial {
  id: string;
  tipo: TipoEventoHistorial;
  titulo: string;
  fecha: string;
  hora: string;
  detalles?: DetalleEventoHistorial[];
  motivo?: string;
}
