import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { PageHeader } from '@/widgets/page-header';
import { TerceroPerfilCard } from '@/widgets/tercero-perfil';
import { OcrDocumentoViewer } from '@/shared/ui/OcrDocumentoViewer';
import { ContactosCard } from '@/widgets/contactos-card';
import { DireccionesCard } from '@/widgets/direcciones-card';
import { InformacionTerceroEditCard } from '@/widgets/informacion-tercero-card';
import { PerfilTributarioCard } from '@/widgets/perfil-tributario-card';
import { InactivarTerceroDialog } from '@/features/inactivar-tercero';
import { SalirSinGuardarDialog } from '@/features/salir-sin-guardar';
import { MOCK_TERCEROS } from '@/shared/mocks/terceros';
import type {
  Tercero,
  Contacto,
  Direccion,
  PerfilTributario,
  TerceroTipo,
  TerceroRol,
} from '@/shared/types/tercero';

interface CreationState {
  tercero?: Tercero;
  justCreated?: boolean;
  snackMessage?: string;
}

type TabValue = 'contacto' | 'tributario' | 'bancario' | 'documentos';
type PendingAction = { kind: 'tab'; tab: TabValue } | { kind: 'back' };

const DEFAULT_PERFIL: PerfilTributario = {
  tipoPersona: 'Jurídica',
  regimenTributario: 'Ordinario',
  actividadesEconomicas: [],
  perteneceRegimenIVA: false,
  esGranContribuyente: false,
  esAutorretenedora: false,
  esAgenteRetenedorIVA: false,
  esAutorretenedorRenta: false,
  esExentoRetefuente: false,
};

export function TerceroEdicionPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const creationState = (location.state ?? null) as CreationState | null;

  const tercero =
    creationState?.tercero ??
    MOCK_TERCEROS.find((t) => t.id === id) ??
    MOCK_TERCEROS[0];

  const [activeTab, setActiveTab] = useState<TabValue>('contacto');
  const [editingInfo, setEditingInfo] = useState(false);
  const [activo, setActivo] = useState(tercero.estado !== 'Inactivo');
  const [inactivarDialogOpen, setInactivarDialogOpen] = useState(false);
  const [estadoSnack, setEstadoSnack] = useState<string | null>(
    creationState?.justCreated ? (creationState.snackMessage ?? null) : null
  );
  const [salirDialogOpen, setSalirDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  // Dirty state: any right-panel widget in edit mode sets this to true
  const [isDirty, setIsDirty] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  const normalizedTipo: TerceroTipo =
    tercero.tipo === 'Natural' || tercero.tipo === 'Juridico' ? 'Persona' : tercero.tipo;

  const [nombre, setNombre] = useState(tercero.nombre);
  const [tipo, setTipo] = useState<TerceroTipo>(normalizedTipo);
  const [identificacionTipo, setIdentificacionTipo] = useState(tercero.identificacionTipo);
  const [identificacionNumero, setIdentificacionNumero] = useState(tercero.identificacionNumero);
  const [pais, setPais] = useState(tercero.pais);
  const [roles, setRoles] = useState<TerceroRol[]>(tercero.roles);
  const [contactos, setContactos] = useState<Contacto[]>(tercero.contactos);
  const [direcciones, setDirecciones] = useState<Direccion[]>(tercero.direcciones);
  const [perfilTributario, setPerfilTributario] = useState<PerfilTributario>(
    tercero.perfilTributario ?? DEFAULT_PERFIL
  );

  const terceroConDatos = { ...tercero, nombre, tipo, pais, roles, contactos, direcciones };

  // Intercepts any navigation when there's unsaved state in the right panel
  const requestNavigation = (action: PendingAction) => {
    if (isDirty) {
      setPendingAction(action);
      setSalirDialogOpen(true);
    } else {
      executeNavigation(action);
    }
  };

  const executeNavigation = (action: PendingAction) => {
    if (action.kind === 'tab') setActiveTab(action.tab);
    if (action.kind === 'back') navigate('/');
  };

  const handleSalirConfirm = () => {
    setIsDirty(false);
    setEditingInfo(false);
    setSalirDialogOpen(false);
    if (pendingAction) executeNavigation(pendingAction);
    setPendingAction(null);
  };

  const handleGuardarYSalir = () => {
    setIsDirty(false);
    setEditingInfo(false);
    setSalirDialogOpen(false);
    if (pendingAction) executeNavigation(pendingAction);
    setPendingAction(null);
  };

  const handleInactivarConfirm = (_motivo: string) => {
    setActivo(false);
    setInactivarDialogOpen(false);
    setEstadoSnack(`"${nombre}" inactivado`);
  };

  const handleActivar = () => {
    setActivo(true);
    setEstadoSnack(`"${nombre}" activado`);
  };

  // Back button: if left-panel edit form is open, treat it as dirty too
  const handleBack = () => {
    if (editingInfo || isDirty) {
      setPendingAction({ kind: 'back' });
      setSalirDialogOpen(true);
    } else {
      navigate('/');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageHeader title="Terceros" onBack={handleBack} />

      <Box
        sx={{
          py: 3,
          px: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 3,
            width: viewerOpen ? 'auto' : 1100,
            maxWidth: '100%',
          }}
        >
          {/* Left panel: profile card OR edit form */}
          <Box sx={{ width: 340, flexShrink: 0 }}>
            {editingInfo ? (
              <InformacionTerceroEditCard
                nombre={nombre}
                tipo={tipo}
                identificacionTipo={identificacionTipo}
                identificacionNumero={identificacionNumero}
                pais={pais}
                roles={roles}
                onNombreChange={setNombre}
                onTipoChange={setTipo}
                onIdentificacionTipoChange={setIdentificacionTipo}
                onIdentificacionNumeroChange={setIdentificacionNumero}
                onPaisChange={setPais}
                onRolesChange={setRoles}
                onCancel={() => setEditingInfo(false)}
                onSave={() => setEditingInfo(false)}
              />
            ) : (
              <TerceroPerfilCard
                tercero={terceroConDatos}
                activeTab={activeTab}
                onTabChange={(tab) => requestNavigation({ kind: 'tab', tab })}
                onEdit={() => setEditingInfo(true)}
                onInactivar={() => setInactivarDialogOpen(true)}
                onActivar={handleActivar}
                activo={activo}
                tieneDireccionPreferida={direcciones.some((d) => d.esPreferida)}
                onViewDocument={tercero.documentoFuente ? () => setViewerOpen(true) : undefined}
              />
            )}
          </Box>

          {/* Center panel: tabbed content */}
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {activeTab === 'contacto' && (
              <>
                <ContactosCard
                  contactos={contactos}
                  onContactosChange={setContactos}
                  onTerceroAutoInactivar={() => {
                    setActivo(false);
                    setEstadoSnack(`"${nombre}" inactivado`);
                  }}
                  onDirtyChange={setIsDirty}
                />
                <DireccionesCard
                  direcciones={direcciones}
                  onDireccionesChange={setDirecciones}
                  onDirtyChange={setIsDirty}
                />
              </>
            )}
            {activeTab === 'tributario' && (
              <PerfilTributarioCard
                nombreRazonSocial={nombre}
                identificacionTipo={identificacionTipo}
                nit={tercero.nit}
                perfil={perfilTributario}
                onPerfilChange={setPerfilTributario}
                onDirtyChange={setIsDirty}
              />
            )}
          </Box>

          {/* Right panel: document viewer (inline, same pattern as OCR creation) */}
          {viewerOpen && (
            <Box sx={{ width: 443, flexShrink: 0, height: 624 }}>
              <OcrDocumentoViewer
                filename={tercero.documentoFuente ?? ''}
                onClose={() => setViewerOpen(false)}
                isScanning={false}
              />
            </Box>
          )}
        </Box>
      </Box>

      <InactivarTerceroDialog
        open={inactivarDialogOpen}
        nombre={nombre}
        onClose={() => setInactivarDialogOpen(false)}
        onConfirm={handleInactivarConfirm}
      />

      <SalirSinGuardarDialog
        open={salirDialogOpen}
        onClose={() => setSalirDialogOpen(false)}
        onSalir={handleSalirConfirm}
        onGuardar={handleGuardarYSalir}
      />

      <Snackbar
        open={Boolean(estadoSnack)}
        autoHideDuration={4000}
        onClose={() => setEstadoSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setEstadoSnack(null)} severity="success">
          {estadoSnack}
        </Alert>
      </Snackbar>
    </Box>
  );
}
