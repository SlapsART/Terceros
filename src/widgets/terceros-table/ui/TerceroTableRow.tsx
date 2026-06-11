import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import {
  IconBuilding,
  IconUser,
  IconChevronRight,
  IconInfoCircle,
  IconRefresh,
} from '@tabler/icons-react';
import { InactivoPopover } from '@/features/terceros-filters';
import type { Tercero } from '@/shared/types/tercero';

const TIPO_LABEL: Record<string, string> = {
  Organizacion: 'Organización',
  Persona: 'Persona',
  Natural: 'Natural',
  Juridico: 'Jurídico',
};

interface TerceroTableRowProps {
  tercero: Tercero;
  onClick: (id: string) => void;
  index?: number;
}

export function TerceroTableRow({ tercero, onClick, index = 0 }: TerceroTableRowProps) {
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

  const isOrg = tercero.tipo === 'Organizacion' || tercero.tipo === 'Juridico';

  return (
    <>
      <Box
        onClick={() => onClick(tercero.id)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
          '&:hover': { bgcolor: 'action.hover' },
          minHeight: 44,
          animation: 'uiSlideUp 0.22s ease-out both',
          animationDelay: `${Math.min(index, 8) * 35}ms`,
          '@keyframes uiSlideUp': {
            from: { opacity: 0, transform: 'translateY(10px)' },
            to:   { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        {/* Type icon — color set on parent Box so SVG inherits currentColor */}
        <Box
          sx={{
            width: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'text.secondary',
          }}
        >
          {isOrg ? <IconBuilding size={16} /> : <IconUser size={16} />}
        </Box>

        {/* Name + NIT */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5, py: 0.5 }}>
          <Typography variant="subtitle2" noWrap>
            {tercero.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            NIT: {tercero.nit}
          </Typography>
        </Box>

        {/* Rol chips */}
        <Box sx={{ width: 320, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'nowrap', flexShrink: 0 }}>
          {tercero.roles.map((rol) => (
            <Chip key={rol} label={rol} size="small" variant="filled" />
          ))}
        </Box>

        {/* Tipo */}
        <Box sx={{ width: 160, flexShrink: 0 }}>
          <Typography variant="body2" color="text.primary">
            {TIPO_LABEL[tercero.tipo] ?? tercero.tipo}
          </Typography>
        </Box>

        {/* Estado chip — icon embedded in label (right side) */}
        <Box sx={{ width: 160, flexShrink: 0 }}>
          {tercero.estado === 'Activo' && (
            <Chip label="Activo" size="medium" color="success" variant="filled" />
          )}
          {tercero.estado === 'En registro' && (
            <Chip
              label={
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  En registro&nbsp;<IconRefresh size={12} />
                </Box>
              }
              size="medium"
              color="warning"
              variant="filled"
            />
          )}
          {tercero.estado === 'Inactivo' && (
            <Chip
              label={
                <Box
                  component="span"
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPopoverAnchor(e.currentTarget as HTMLElement);
                  }}
                >
                  Inactivo&nbsp;<IconInfoCircle size={12} />
                </Box>
              }
              size="medium"
              color="default"
              variant="filled"
            />
          )}
        </Box>

        {/* Chevron */}
        <Box sx={{ width: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'text.secondary' }}>
          <IconChevronRight size={16} />
        </Box>
      </Box>

      <Divider />

      <InactivoPopover
        anchorEl={popoverAnchor}
        motivo="Se inactivó contacto por finalización de relación comercial con el tercero."
        onClose={() => setPopoverAnchor(null)}
      />
    </>
  );
}
