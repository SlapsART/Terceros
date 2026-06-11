import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { TercerosToolbar } from './TercerosToolbar';
import { TercerosTableHeader } from './TercerosTableHeader';
import { TerceroTableRow } from './TerceroTableRow';
import type { Tercero } from '@/shared/types/tercero';
import { slideUp } from '@/shared/ui/animations';

interface Filters {
  rol: string;
  tipo: string;
  estado: string;
  buscar: string;
}

interface TercerosTableProps {
  terceros: Tercero[];
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onRowClick: (id: string) => void;
}

export function TercerosTable({ terceros, filters, onFiltersChange, onRowClick }: TercerosTableProps) {
  const filtered = terceros.filter((t) => {
    if (filters.rol && !t.roles.includes(filters.rol as never)) return false;
    if (filters.tipo) {
      const tipoMap: Record<string, string[]> = {
        Organización: ['Organizacion', 'Juridico'],
        Persona: ['Persona', 'Natural'],
      };
      if (!tipoMap[filters.tipo]?.includes(t.tipo)) return false;
    }
    if (filters.estado && t.estado !== filters.estado) return false;
    if (filters.buscar) {
      const q = filters.buscar.toLowerCase();
      if (!t.nombre.toLowerCase().includes(q) && !t.nit.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200',
        overflow: 'hidden',
        mx: 2,
        mb: 2,
        ...slideUp,
      }}
    >
      {/* Toolbar: 8px top padding, 12px bottom gap to match Figma */}
      <Box sx={{ px: 3, pt: 1, pb: 1.5 }}>
        <TercerosToolbar filters={filters} onFiltersChange={onFiltersChange} />
      </Box>

      {/* Header: no horizontal wrapper padding — header fills full width */}
      <Box sx={{ pb: 1 }}>
        <TercerosTableHeader />
      </Box>

      <Box>
        {filtered.map((tercero, index) => (
          <TerceroTableRow key={tercero.id} tercero={tercero} onClick={onRowClick} index={index} />
        ))}
      </Box>
    </Paper>
  );
}
