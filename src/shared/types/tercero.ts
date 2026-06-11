export type TerceroTipo = 'Persona' | 'Organizacion' | 'Natural' | 'Juridico';
export type TerceroRol = 'Proveedor' | 'Empleado' | 'Cliente' | 'Entidad financiera' | 'Otro';
export type TerceroEstado = 'Activo' | 'Inactivo' | 'En registro';
export type ContactoTipo =
  | 'Representante legal'
  | 'Tesorero'
  | 'Comercial'
  | 'Técnico'
  | 'Contacto de facturación'
  | 'Contacto de notificaciones'
  | 'Otro';
export type DireccionTipo = 'Fiscal' | 'Comercial' | 'Correspondencia' | 'Otro';

export interface Contacto {
  id: string;
  nombre?: string;
  tipo: ContactoTipo;
  email: string;
  telefono: string;
  codigoPais: string;
  esPrincipal: boolean;
  activo: boolean;
  motivoInactivacion?: string;
}

export interface AddressExtra {
  id: string;
  type: 'letra' | 'sector';
  value: string;
}

export interface Direccion {
  id: string;
  tipo: DireccionTipo;
  pais: string;
  departamento?: string;
  ciudad?: string;
  viaPrincipal: string;
  num1: string;
  num1Extras?: AddressExtra[];
  num2: string;
  num2Extras?: AddressExtra[];
  num3: string;
  complemento?: string;
  esPreferida: boolean;
}

export interface ActividadEconomica {
  codigo: string;
  descripcion: string;
  esPrincipal: boolean;
}

export interface PerfilTributario {
  tipoPersona: 'Jurídica' | 'Natural';
  regimenTributario: string;
  actividadesEconomicas: ActividadEconomica[];
  perteneceRegimenIVA: boolean;
  esGranContribuyente: boolean;
  esAutorretenedora: boolean;
  esAgenteRetenedorIVA: boolean;
  esAutorretenedorRenta: boolean;
  esExentoRetefuente: boolean;
  vigenciasAtributos?: Record<string, { vigenciaInicial: string; vigenciaFinal: string }>;
}

export interface Tercero {
  id: string;
  nombre: string;
  nit: string;
  tipo: TerceroTipo;
  identificacionTipo: string;
  identificacionNumero: string;
  pais: string;
  roles: TerceroRol[];
  estado: TerceroEstado;
  motivoInactivacion?: string;
  documentoFuente?: string;
  contactos: Contacto[];
  direcciones: Direccion[];
  perfilTributario?: PerfilTributario;
}
