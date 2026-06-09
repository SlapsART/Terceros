import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { PageHeader } from '@/widgets/page-header';
import { FloatingBar } from '@/widgets/floating-bar';
import { InformacionTerceroCard, type DuplicadoInfo } from '@/widgets/informacion-tercero-card';
import { ContactosCard } from '@/widgets/contactos-card';
import { DireccionesCard } from '@/widgets/direcciones-card';
import { AccionesNuevasCard } from '@/widgets/acciones-nuevas-card';
import { ForzarCreacionDialog } from '@/features/forzar-creacion';
import { MOCK_TERCEROS } from '@/shared/mocks/terceros';
import type { TerceroTipo, TerceroRol, Contacto, Direccion } from '@/shared/types/tercero';
import { slideUp } from '@/shared/ui/animations';

export function TerceroRegistroPage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TerceroTipo>('Organizacion');
  const [identificacionTipo, setIdentificacionTipo] = useState('NIT');
  const [identificacionNumero, setIdentificacionNumero] = useState('');
  const [pais, setPais] = useState('');
  const [roles, setRoles] = useState<TerceroRol[]>([]);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [omitido, setOmitido] = useState(false);
  const [forzarDialogOpen, setForzarDialogOpen] = useState(false);

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

  const duplicadoActivo = detectedDuplicate && !omitido ? detectedDuplicate : null;

  const handleIdentificacionTipoChange = (v: string) => {
    setIdentificacionTipo(v);
    setOmitido(false);
  };

  const handleIdentificacionNumeroChange = (v: string) => {
    setIdentificacionNumero(v);
    setOmitido(false);
  };

  const handleGuardar = () => {
    if (detectedDuplicate && !omitido) {
      setForzarDialogOpen(true);
    } else {
      navigate('/');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageHeader title="Terceros" onBack={() => navigate('/')} />

      <Box
        sx={{
          py: 3,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pb: 12,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 670, display: 'flex', flexDirection: 'column', gap: 2, ...slideUp }}>
          <InformacionTerceroCard
            nombre={nombre}
            tipo={tipo}
            identificacionTipo={identificacionTipo}
            identificacionNumero={identificacionNumero}
            pais={pais}
            roles={roles}
            duplicado={duplicadoActivo}
            duplicadoMode="warning"
            onNombreChange={setNombre}
            onTipoChange={setTipo}
            onIdentificacionTipoChange={handleIdentificacionTipoChange}
            onIdentificacionNumeroChange={handleIdentificacionNumeroChange}
            onPaisChange={setPais}
            onRolesChange={setRoles}
            onOmitirDuplicado={() => setOmitido(true)}
          />
          <ContactosCard contactos={contactos} onContactosChange={setContactos} mode="creation" />
          <DireccionesCard direcciones={direcciones} onDireccionesChange={setDirecciones} mode="creation" />
          <AccionesNuevasCard />
        </Box>
      </Box>

      <FloatingBar
        onInactivar={() => {}}
        onDescartar={() => navigate('/')}
        onGuardar={handleGuardar}
        guardarLabel="Crear tercero"
        showInactivar={true}
        guardarDisabled={contactos.length === 0 || direcciones.length === 0}
      />

      <ForzarCreacionDialog
        open={forzarDialogOpen}
        onClose={() => setForzarDialogOpen(false)}
        onConfirmar={() => {
          setForzarDialogOpen(false);
          navigate('/');
        }}
      />
    </Box>
  );
}
