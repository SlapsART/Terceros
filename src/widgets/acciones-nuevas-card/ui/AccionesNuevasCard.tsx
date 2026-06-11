import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { IconPlus } from '@tabler/icons-react';
import { fadeIn } from '@/shared/ui/animations';

const ACCIONES = ['Perfil tributario', 'Cuentas bancarias', 'Documentación'];

interface AccionesNuevasCardProps {
  hiddenAcciones?: string[];
}

export function AccionesNuevasCard({ hiddenAcciones = [] }: AccionesNuevasCardProps) {
  const acciones = ACCIONES.filter((a) => !hiddenAcciones.includes(a));
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, px: 2, ...fadeIn }}>
      {acciones.map((accion) => (
        <Button
          key={accion}
          size="small"
          startIcon={<IconPlus size={14} />}
          sx={{ color: 'primary.main' }}
        >
          {accion}
        </Button>
      ))}
    </Box>
  );
}
