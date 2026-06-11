import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { PageHeader } from '@/widgets/page-header';
import { FloatingBar } from '@/widgets/floating-bar';
import { InformacionTerceroCard, type DuplicadoInfo } from '@/widgets/informacion-tercero-card';
import { ContactosCard } from '@/widgets/contactos-card';
import { DireccionesCard } from '@/widgets/direcciones-card';
import { AccionesNuevasCard } from '@/widgets/acciones-nuevas-card';
import { OcrTercerosSidebar } from '@/widgets/ocr-terceros-sidebar';
import type { OcrTerceroItem } from '@/widgets/ocr-terceros-sidebar';
import { MOCK_TERCEROS } from '@/shared/mocks/terceros';
import type { TerceroTipo, TerceroRol, Contacto, Direccion } from '@/shared/types/tercero';

const MOCK_ITEMS: OcrTerceroItem[] = [
  { id: 'NIT-3251614-Col-Avianca', status: 'ready' },
  { id: '2847391-COL-2819', status: 'ready' },
  { id: 'OXP-DEV-2850-1', status: 'error' },
];

const MOCK_OCR_DATA = {
  nombre: 'Andina Capital S.A.S - CO',
  tipo: 'Organizacion' as TerceroTipo,
  identificacionTipo: 'Cédula extranjera',
  identificacionNumero: '5698745894',
  pais: 'República dominicana',
  roles: ['Proveedor', 'Empleado', 'Entidad financiera'] as TerceroRol[],
  documentoFuente: 'fact- 9346455.pdf',
};

export function OcrBatchResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as { terceros?: OcrTerceroItem[] };
  const items = state.terceros ?? MOCK_ITEMS;

  const [selectedId, setSelectedId] = useState(items.find((i) => i.status === 'ready')?.id ?? '');
  const [nombre, setNombre] = useState(MOCK_OCR_DATA.nombre);
  const [tipo, setTipo] = useState<TerceroTipo>(MOCK_OCR_DATA.tipo);
  const [identificacionTipo, setIdentificacionTipo] = useState(MOCK_OCR_DATA.identificacionTipo);
  const [identificacionNumero, setIdentificacionNumero] = useState(MOCK_OCR_DATA.identificacionNumero);
  const [pais, setPais] = useState(MOCK_OCR_DATA.pais);
  const [roles, setRoles] = useState<TerceroRol[]>(MOCK_OCR_DATA.roles);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [snack, setSnack] = useState<string | null>(null);

  const detectedDuplicate = useMemo<DuplicadoInfo | null>(() => {
    if (!identificacionNumero) return null;
    const match = MOCK_TERCEROS.find(
      (t) =>
        t.identificacionTipo.toLowerCase() === identificacionTipo.toLowerCase() &&
        t.identificacionNumero === identificacionNumero,
    );
    return match
      ? { identificacionTipo: match.identificacionTipo, identificacionNumero: match.identificacionNumero, pais: match.pais }
      : null;
  }, [identificacionTipo, identificacionNumero]);

  const handleCrear = () => {
    setSnack(`"${nombre}" creado exitosamente`);
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageHeader title="Terceros" onBack={() => navigate('/')} />

      {/*
        Figma layout (link estado 4):
        - WidgetGrid at x=16 within Contenedor (1286px wide)
        - sidebar at x=217, width=281 → centered within the grid
        - form at x=514, width=555
        - Total content (sidebar+gap+form): 281+16+555=852px
        - Left offset within WidgetGrid: 217px
        Total: 217 + 852 + (1286-217-852)=217px right margin → content centered within 1286px
      */}
      <Box
        sx={{
          py: 3,
          px: 2,
          pb: 12,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 2,
            width: 852,
            maxWidth: '100%',
            animation: 'uiSlideUp 0.22s ease-out both',
            animationDelay: '60ms',
            '@keyframes uiSlideUp': {
              from: { opacity: 0, transform: 'translateY(10px)' },
              to:   { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          {/* Left sidebar — 281px */}
          <Box sx={{ width: 281, flexShrink: 0, height: 624 }}>
            <OcrTercerosSidebar
              items={items}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </Box>

          {/* Center form — 555px */}
          <Box sx={{ width: 555, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InformacionTerceroCard
              nombre={nombre}
              tipo={tipo}
              identificacionTipo={identificacionTipo}
              identificacionNumero={identificacionNumero}
              pais={pais}
              roles={roles}
              documentoFuente={MOCK_OCR_DATA.documentoFuente}
              duplicado={detectedDuplicate}
              duplicadoMode="error"
              onNombreChange={setNombre}
              onTipoChange={setTipo}
              onIdentificacionTipoChange={setIdentificacionTipo}
              onIdentificacionNumeroChange={setIdentificacionNumero}
              onPaisChange={setPais}
              onRolesChange={setRoles}
            />
            <ContactosCard contactos={contactos} onContactosChange={setContactos} mode="creation" />
            <DireccionesCard direcciones={direcciones} onDireccionesChange={setDirecciones} mode="creation" />
            <AccionesNuevasCard />
          </Box>
        </Box>
      </Box>

      <FloatingBar
        onInactivar={() => {}}
        onDescartar={() => navigate('/')}
        onGuardar={handleCrear}
        guardarLabel="Crear tercero"
        showInactivar={false}
        guardarDisabled={!!detectedDuplicate}
      />

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnack(null)}>{snack}</Alert>
      </Snackbar>
    </Box>
  );
}
