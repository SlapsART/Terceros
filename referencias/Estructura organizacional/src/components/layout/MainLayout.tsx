import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { IconHistory } from '@tabler/icons-react';
import { HistorialEventosDrawer } from '@/widgets/historial-eventos';
import { MOCK_EVENTOS } from '@/widgets/historial-eventos/lib/mockEventos';
import { useNotificaciones } from '@/widgets/notificaciones';

const MOCK_MSGS = [
  'Asiento BRD-76373 enviado',
  'Contabilización BRD-76373 finalizado',
  'Factura COMP-01202167 registrada',
  'Contabilización BRD-7612 devuelta',
  'Tercero NIT-900123456 actualizado',
  'Rol asignado a usuario jsmith@sinco.co',
];

const MainLayout = () => {
  const [historialOpen, setHistorialOpen] = useState(false);
  const { agregarNotificacion } = useNotificaciones();

  const dispararNotificacion = () => {
    const msg = MOCK_MSGS[Math.floor(Math.random() * MOCK_MSGS.length)];
    agregarNotificacion(msg, {
      onClick: () => console.log(`Abrir detalle: ${msg}`),
    });
  };

  const dispararAyer = () => {
    const msg = MOCK_MSGS[Math.floor(Math.random() * MOCK_MSGS.length)];
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    agregarNotificacion(msg, {
      timestamp: ayer,
      onClick: () => console.log(`Abrir detalle: ${msg}`),
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 4 }}>
      <Typography variant="h5" mb={2}>Demo — Terceros</Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<IconHistory size={16} />}
          onClick={() => setHistorialOpen(true)}
        >
          Ver historial de eventos
        </Button>

        <Button variant="contained" onClick={dispararNotificacion}>
          Simular notificación IA
        </Button>

        <Button variant="outlined" onClick={dispararAyer}>
          Simular notificación de ayer
        </Button>
      </Box>

      <HistorialEventosDrawer
        open={historialOpen}
        onClose={() => setHistorialOpen(false)}
        eventos={MOCK_EVENTOS}
        totalEventos={MOCK_EVENTOS.length}
      />
    </Box>
  );
};

export default MainLayout;
