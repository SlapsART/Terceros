import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import { PageHeader } from '@/widgets/page-header';
import { FloatingBar } from '@/widgets/floating-bar';
import { InformacionTerceroCard } from '@/widgets/informacion-tercero-card';
import { ContactosCard } from '@/widgets/contactos-card';
import { DireccionesCard } from '@/widgets/direcciones-card';
import { AccionesNuevasCard } from '@/widgets/acciones-nuevas-card';
import { PerfilTributarioCard } from '@/widgets/perfil-tributario-card';
import { OcrDocumentoViewer } from '@/shared/ui/OcrDocumentoViewer';
import type { Tercero, TerceroTipo, TerceroRol, Contacto, Direccion, PerfilTributario, ContactoTipo, DireccionTipo } from '@/shared/types/tercero';

interface OcrState {
  files?: Array<{ name: string; sizeLabel: string; formatLabel: string }>;
}

const MOCK_OCR_DATA = {
  nombre: 'Andina Capital S.A.S',
  tipo: 'Organizacion' as TerceroTipo,
  identificacionTipo: 'NIT',
  identificacionNumero: '900.847.215-3',
  pais: 'Colombia',
  roles: ['Proveedor', 'Cliente'] as TerceroRol[],
  documentoFuente: 'RUT-AndinaCapital-2026.PDF',
  contactos: [
    {
      id: 'ocr-c1',
      tipo: 'Representante legal' as ContactoTipo,
      nombre: 'Carlos Andrés Martínez',
      email: 'c.martinez@andinacapital.com',
      telefono: '3001234567',
      codigoPais: '+57',
      esPrincipal: true,
      activo: true,
    },
    {
      id: 'ocr-c2',
      tipo: 'Contacto de facturación' as ContactoTipo,
      nombre: 'Laura Gómez',
      email: 'facturacion@andinacapital.com',
      telefono: '3157654321',
      codigoPais: '+57',
      esPrincipal: false,
      activo: true,
    },
  ] as Contacto[],
  direcciones: [
    {
      id: 'ocr-d1',
      tipo: 'Fiscal' as DireccionTipo,
      pais: 'Colombia',
      departamento: 'Cundinamarca',
      ciudad: 'Bogotá',
      viaPrincipal: 'Carrera (Kr.)',
      num1: '7',
      num2: '72',
      num3: '64',
      esPreferida: true,
    },
    {
      id: 'ocr-d2',
      tipo: 'Comercial' as DireccionTipo,
      pais: 'Colombia',
      departamento: 'Antioquia',
      ciudad: 'Medellín',
      viaPrincipal: 'Calle (Cll.)',
      num1: '52',
      num2: '43',
      num3: '21',
      esPreferida: false,
    },
  ] as Direccion[],
  perfilTributario: {
    tipoPersona: 'Jurídica' as const,
    regimenTributario: 'Ordinario',
    actividadesEconomicas: [
      { codigo: '6499', descripcion: 'Otras actividades de servicios financieros', esPrincipal: true },
      { codigo: '7010', descripcion: 'Actividades de administración empresarial', esPrincipal: false },
    ],
    perteneceRegimenIVA: true,
    esGranContribuyente: false,
    esAutorretenedora: true,
    esAgenteRetenedorIVA: false,
    esAutorretenedorRenta: true,
    esExentoRetefuente: false,
  } as PerfilTributario,
};

export function TerceroRegistroOcrPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as OcrState;
  const filename = state.files?.[0]?.name ?? 'RUT-AndinaCapital-2026.PDF';

  // Información básica
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TerceroTipo>('Organizacion');
  const [identificacionTipo, setIdentificacionTipo] = useState('');
  const [identificacionNumero, setIdentificacionNumero] = useState('');
  const [pais, setPais] = useState('');
  const [roles, setRoles] = useState<TerceroRol[]>([]);

  // Contactos
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [contactoSkeletons, setContactoSkeletons] = useState(0);
  const [ocrContactIds, setOcrContactIds] = useState<string[]>([]);

  // Direcciones
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [direccionSkeletons, setDireccionSkeletons] = useState(0);
  const [ocrDirIds, setOcrDirIds] = useState<string[]>([]);

  // Perfil tributario
  const [perfilTributario, setPerfilTributario] = useState<PerfilTributario | null>(null);
  const [perfilTributarioLoading, setPerfilTributarioLoading] = useState(false);

  const [viewerOpen, setViewerOpen] = useState(true);

  // Reveal state para campos básicos
  const [ocrRevealed, setOcrRevealed] = useState({
    nombre: false,
    tipo: false,
    identificacion: false,
    pais: false,
    roles: false,
  });

  useEffect(() => {
    const reveal = (field: keyof typeof ocrRevealed) =>
      setOcrRevealed((prev) => ({ ...prev, [field]: true }));

    const timers: ReturnType<typeof setTimeout>[] = [
      // ── Campos básicos ────────────────────────────────
      setTimeout(() => { setNombre(MOCK_OCR_DATA.nombre); reveal('nombre'); }, 700),
      setTimeout(() => { setTipo(MOCK_OCR_DATA.tipo); reveal('tipo'); }, 1150),
      setTimeout(() => {
        setIdentificacionTipo(MOCK_OCR_DATA.identificacionTipo);
        setIdentificacionNumero(MOCK_OCR_DATA.identificacionNumero);
        reveal('identificacion');
      }, 1600),
      setTimeout(() => { setPais(MOCK_OCR_DATA.pais); reveal('pais'); }, 2000),
      setTimeout(() => { setRoles(MOCK_OCR_DATA.roles); reveal('roles'); }, 2450),

      // ── Contactos ─────────────────────────────────────
      setTimeout(() => setContactoSkeletons(2), 2700),
      setTimeout(() => {
        const c = MOCK_OCR_DATA.contactos[0];
        setContactos([c]);
        setOcrContactIds([c.id]);
        setContactoSkeletons(1);
      }, 3200),
      setTimeout(() => {
        const c = MOCK_OCR_DATA.contactos[1];
        setContactos((prev) => [...prev, c]);
        setOcrContactIds((prev) => [...prev, c.id]);
        setContactoSkeletons(0);
      }, 3900),

      // ── Direcciones ───────────────────────────────────
      setTimeout(() => setDireccionSkeletons(2), 4200),
      setTimeout(() => {
        const d = MOCK_OCR_DATA.direcciones[0];
        setDirecciones([d]);
        setOcrDirIds([d.id]);
        setDireccionSkeletons(1);
      }, 4700),
      setTimeout(() => {
        const d = MOCK_OCR_DATA.direcciones[1];
        setDirecciones((prev) => [...prev, d]);
        setOcrDirIds((prev) => [...prev, d.id]);
        setDireccionSkeletons(0);
      }, 5400),

      // ── Perfil tributario ─────────────────────────────
      setTimeout(() => setPerfilTributarioLoading(true), 5700),
      setTimeout(() => {
        setPerfilTributario(MOCK_OCR_DATA.perfilTributario);
        setPerfilTributarioLoading(false);
      }, 6500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadingFields = (Object.keys(ocrRevealed) as (keyof typeof ocrRevealed)[])
    .filter((k) => !ocrRevealed[k]);

  const isScanning =
    loadingFields.length > 0 ||
    contactoSkeletons > 0 ||
    direccionSkeletons > 0 ||
    perfilTributarioLoading;

  const handleCrear = () => {
    const newId = `ocr-${Date.now()}`;
    const nuevoTercero: Tercero = {
      id: newId,
      nombre,
      nit: identificacionNumero,
      tipo,
      identificacionTipo,
      identificacionNumero,
      pais,
      roles,
      estado: 'Activo',
      documentoFuente: MOCK_OCR_DATA.documentoFuente,
      contactos,
      direcciones,
      perfilTributario: perfilTributario ?? undefined,
    };
    navigate(`/${newId}`, {
      state: {
        tercero: nuevoTercero,
        justCreated: true,
        snackMessage: `"${nombre}" creado exitosamente`,
      },
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageHeader title="Terceros" onBack={() => navigate('/')} />

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
            width: viewerOpen ? 1014 : 670,
            maxWidth: '100%',
            gap: 0,
          }}
        >
          {/* Form column — 555px */}
          <Box
            sx={{
              width: viewerOpen ? 555 : '100%',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <InformacionTerceroCard
              nombre={nombre}
              tipo={tipo}
              identificacionTipo={identificacionTipo}
              identificacionNumero={identificacionNumero}
              pais={pais}
              roles={roles}
              documentoFuente={MOCK_OCR_DATA.documentoFuente}
              loadingFields={loadingFields}
              onViewDocument={() => setViewerOpen(true)}
              onNombreChange={setNombre}
              onTipoChange={setTipo}
              onIdentificacionTipoChange={setIdentificacionTipo}
              onIdentificacionNumeroChange={setIdentificacionNumero}
              onPaisChange={setPais}
              onRolesChange={setRoles}
            />
            <ContactosCard
              contactos={contactos}
              onContactosChange={setContactos}
              mode="creation"
              skeletonCount={contactoSkeletons}
              disableAutoForm
              ocrAddedIds={ocrContactIds}
            />
            <DireccionesCard
              direcciones={direcciones}
              onDireccionesChange={setDirecciones}
              mode="creation"
              skeletonCount={direccionSkeletons}
              disableAutoForm
              ocrAddedIds={ocrDirIds}
            />
            {(perfilTributarioLoading || perfilTributario) && (
              <PerfilTributarioCard
                nombreRazonSocial={nombre}
                identificacionTipo={identificacionTipo}
                nit={identificacionNumero}
                perfil={perfilTributario ?? undefined}
                isLoading={perfilTributarioLoading}
                onPerfilChange={setPerfilTributario}
                onDirtyChange={() => {}}
              />
            )}
            <AccionesNuevasCard
              hiddenAcciones={perfilTributario ? ['Perfil tributario'] : []}
            />
          </Box>

          {/* Split view + document viewer — 443px */}
          {viewerOpen && (
            <Box sx={{ width: 443, flexShrink: 0, height: 624 }}>
              <OcrDocumentoViewer
                filename={filename}
                onClose={() => setViewerOpen(false)}
                isScanning={isScanning}
              />
            </Box>
          )}
        </Box>
      </Box>

      <FloatingBar
        onInactivar={() => {}}
        onDescartar={() => navigate('/')}
        onGuardar={handleCrear}
        guardarLabel="Crear tercero"
        showInactivar={false}
      />

    </Box>
  );
}
