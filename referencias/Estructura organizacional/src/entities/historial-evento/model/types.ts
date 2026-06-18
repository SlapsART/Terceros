export type TipoEvento = 'eliminacion' | 'asignacion' | 'actualizacion' | 'activacion';

export interface DetalleBullet {
  label?: string;
  valor: string;
  valorAnterior?: string;
  chip?: string;
}

export interface HistorialEvento {
  id: string;
  fecha: string;
  hora: string;
  tipo: TipoEvento;
  titulo: string;
  detalles?: DetalleBullet[];
  motivo?: string;
}
