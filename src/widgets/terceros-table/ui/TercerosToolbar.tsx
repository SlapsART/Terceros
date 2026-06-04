import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import { TerceroContextMenu } from '@/features/terceros-filters';
import type { FilterMenuType } from '@/features/terceros-filters';

interface Filters {
  rol: string;
  tipo: string;
  estado: string;
  buscar: string;
}

interface TercerosToolbarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function TercerosToolbar({ filters, onFiltersChange }: TercerosToolbarProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuType, setMenuType] = useState<FilterMenuType>('rol');

  const openMenu = (event: React.MouseEvent<HTMLElement>, type: FilterMenuType) => {
    setMenuType(type);
    setMenuAnchor(event.currentTarget);
  };

  const handleSelect = (value: string) => {
    onFiltersChange({ ...filters, [menuType]: value });
  };

  const getLabel = (type: FilterMenuType) => {
    const defaults: Record<FilterMenuType, string> = { rol: 'Todas', tipo: 'Todos', estado: 'Todas' };
    return filters[type] || defaults[type];
  };

  return (
    /* No internal py padding — spacing handled by TercerosTable wrapper */
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
        {(['rol', 'tipo', 'estado'] as FilterMenuType[]).map((type) => (
          <Box key={type} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {type === 'rol' ? 'Rol:' : type === 'tipo' ? 'Tipo:' : 'Estado:'}
            </Typography>
            <Button
              size="small"
              endIcon={<IconChevronDown size={14} />}
              onClick={(e) => openMenu(e, type)}
              sx={{ color: 'text.primary', fontWeight: 500, px: 1.25, py: 0.5 }}
            >
              {getLabel(type)}
            </Button>
          </Box>
        ))}
      </Box>

      <OutlinedInput
        size="small"
        placeholder="Buscar"
        value={filters.buscar}
        onChange={(e) => onFiltersChange({ ...filters, buscar: e.target.value })}
        endAdornment={
          <InputAdornment position="end" sx={{ color: 'text.secondary' }}>
            <IconSearch size={16} />
          </InputAdornment>
        }
        sx={{ width: 250, height: 32 }}
      />

      <TerceroContextMenu
        anchorEl={menuAnchor}
        type={menuType}
        selected={filters[menuType]}
        onSelect={handleSelect}
        onClose={() => setMenuAnchor(null)}
      />
    </Box>
  );
}
