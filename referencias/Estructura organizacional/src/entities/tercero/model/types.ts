export interface Tercero {
  id: string;
  nombre: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  email?: string;
  telefono?: string;
  estado: 'Activo' | 'Inactivo';
  fechaCreacion: Date;
  fechaModificacion: Date;
}
