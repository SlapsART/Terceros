import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { PageHeader } from '@/widgets/page-header';
import { TercerosTable } from '@/widgets/terceros-table';
import { OcrAsistente } from '@/features/ocr-asistente';
import { MOCK_TERCEROS } from '@/shared/mocks/terceros';

interface Filters {
  rol: string;
  tipo: string;
  estado: string;
  buscar: string;
}

const DEFAULT_FILTERS: Filters = { rol: '', tipo: '', estado: '', buscar: '' };

export function TercerosPanoramaPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageHeader
        title="Terceros"
        actionLabel="Nuevo tercero"
        onAction={() => navigate('/nuevo')}
      />
      <Box sx={{ pt: 1, pb: 16 }}>
        <TercerosTable
          terceros={MOCK_TERCEROS}
          filters={filters}
          onFiltersChange={setFilters}
          onRowClick={(id) => navigate(`/${id}`)}
        />
      </Box>

      <OcrAsistente />
    </Box>
  );
}
