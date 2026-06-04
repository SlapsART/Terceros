import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

export type FilterMenuType = 'rol' | 'tipo' | 'estado';

const ROL_OPTIONS = ['Cliente', 'Empleado', 'Proveedor', 'Entidad financiera', 'Otro'];
const TIPO_OPTIONS = ['Organización', 'Persona'];
const ESTADO_OPTIONS = ['En registro', 'Activo', 'Inactivo'];

interface TerceroContextMenuProps {
  anchorEl: HTMLElement | null;
  type: FilterMenuType;
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function TerceroContextMenu({
  anchorEl,
  type,
  selected,
  onSelect,
  onClose,
}: TerceroContextMenuProps) {
  const options =
    type === 'rol' ? ROL_OPTIONS : type === 'tipo' ? TIPO_OPTIONS : ESTADO_OPTIONS;

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{
        paper: {
          sx: {
            mt: 0.5,
            minWidth: 140,
            boxShadow: '0px 4px 16px rgba(0,0,0,0.12)',
            borderRadius: 1,
          },
        },
      }}
    >
      {options.map((option) => (
        <MenuItem
          key={option}
          selected={selected === option}
          onClick={() => {
            onSelect(option);
            onClose();
          }}
          sx={{ py: 0.75, px: 2 }}
        >
          <Typography variant="body2">{option}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );
}
