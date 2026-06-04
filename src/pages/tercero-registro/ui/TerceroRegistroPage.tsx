import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { PageHeader } from '@/widgets/page-header';
import { FloatingBar } from '@/widgets/floating-bar';
import { InformacionTerceroCard, type DuplicadoInfo } from '@/widgets/informacion-tercero-card';
import { ContactosCard } from '@/widgets/contactos-card';
import { DireccionesCard } from '@/widgets/direcciones-card';
import { AccionesNuevasCard } from '@/widgets/acciones-nuevas-card';
import type { TerceroTipo, TerceroRol, Contacto, Direccion } from '@/shared/types/tercero';

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
  // TODO: reemplazar con detección real del backend
  const [duplicado] = useState<DuplicadoInfo | null>({
    identificacionTipo: 'Cédula Extranjera',
    identificacionNumero: '5698745894',
    pais: 'República dominicana',
  });

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
        <Box sx={{ width: '100%', maxWidth: 670, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <InformacionTerceroCard
            nombre={nombre}
            tipo={tipo}
            identificacionTipo={identificacionTipo}
            identificacionNumero={identificacionNumero}
            pais={pais}
            roles={roles}
            duplicado={duplicado}
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

      <FloatingBar
        onInactivar={() => {}}
        onDescartar={() => navigate('/')}
        onGuardar={() => navigate('/')}
        guardarLabel="Crear tercero"
        showInactivar={true}
      />
    </Box>
  );
}
