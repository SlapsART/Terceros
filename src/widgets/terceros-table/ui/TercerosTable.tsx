import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import { TercerosToolbar } from './TercerosToolbar';
import { TercerosTableHeader } from './TercerosTableHeader';
import { TerceroTableRow } from './TerceroTableRow';
import type { Tercero } from '@/shared/types/tercero';
import { slideUp } from '@/shared/ui/animations';

const ROWS_PER_PAGE = 10;

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
  const [page, setPage] = useState(1);

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

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [filters]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200',
        mx: 2,
        mb: 2,
        ...slideUp,
      }}
    >
      {/* Toolbar */}
      <Box sx={{ px: 2, pt: 1, pb: 1.5 }}>
        <TercerosToolbar filters={filters} onFiltersChange={onFiltersChange} />
      </Box>

      {/* Header + rows agrupados con 16px de margen lateral y borde */}
      <Box
        sx={{
          mx: 2,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <TercerosTableHeader />
        {paginated.map((tercero, index) => (
          <TerceroTableRow key={tercero.id} tercero={tercero} onClick={onRowClick} index={index} />
        ))}
      </Box>

      {/* Paginador */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 1.5 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            size="small"
            shape="rounded"
          />
        </Box>
      )}
    </Paper>
  );
}
