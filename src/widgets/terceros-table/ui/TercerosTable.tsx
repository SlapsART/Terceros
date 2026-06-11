import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import { TercerosToolbar } from './TercerosToolbar';
import { TercerosTableHeader } from './TercerosTableHeader';
import { TerceroTableRow } from './TerceroTableRow';
import type { Tercero } from '@/shared/types/tercero';
import { slideUp } from '@/shared/ui/animations';

const ROW_HEIGHT = 45; // minHeight 44px + 1px divider

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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowsContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setRowsPerPage(Math.max(1, Math.floor(el.clientHeight / ROW_HEIGHT)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  useEffect(() => { setPage(1); }, [filters]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...slideUp,
      }}
    >
      {/* Toolbar */}
      <Box sx={{ px: 2, pt: 1, pb: 1.5, flexShrink: 0 }}>
        <TercerosToolbar filters={filters} onFiltersChange={onFiltersChange} />
      </Box>

      {/* Header + rows agrupados */}
      <Box
        sx={{
          mx: 2,
          borderRadius: 1,
          overflow: 'hidden',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TercerosTableHeader />
        {/* Rows fill remaining space — ResizeObserver measures this */}
        <Box ref={rowsContainerRef} sx={{ flex: 1, overflow: 'hidden' }}>
          {paginated.map((tercero, index) => (
            <TerceroTableRow
              key={tercero.id}
              tercero={tercero}
              onClick={onRowClick}
              index={index}
              isLast={index === paginated.length - 1}
            />
          ))}
        </Box>
      </Box>

      {/* Paginador */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 1.5, flexShrink: 0 }}>
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
