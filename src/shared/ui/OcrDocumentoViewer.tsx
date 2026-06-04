import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import {
  IconX, IconScan, IconGridDots,
  IconChevronLeft, IconChevronRight,
  IconZoomOut, IconZoomIn,
  IconRotate, IconDownload, IconArrowsMaximize,
} from '@tabler/icons-react';
import documentPreview from '@/shared/assets/ocr/document-preview.png';

const ZOOM_STEPS = [50, 75, 100, 125, 150, 200];

interface OcrDocumentoViewerProps {
  filename: string;
  onClose: () => void;
  isScanning?: boolean;
}

export function OcrDocumentoViewer({ filename, onClose, isScanning = true }: OcrDocumentoViewerProps) {
  const [page, setPage] = useState(1);
  const [zoomIdx, setZoomIdx] = useState(2); // 100% por defecto
  const totalPages = 3;

  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch', height: '100%', position: 'relative' }}>
      {/* Split divider handle — 15px, centered vertical divider + drag knob */}
      <Box
        sx={{
          width: 15,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 1,
          mr: '-7px',
          zIndex: 2,
          position: 'relative',
        }}
      >
        <Divider orientation="vertical" flexItem sx={{ position: 'absolute', top: 0, bottom: 0, left: '50%' }} />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, 8px)',
            bgcolor: 'grey.50',
            borderRadius: '32px',
            boxShadow: '0px 1px 5px 0px rgba(93,109,126,0.08), 0px 2px 2px 0px rgba(93,109,126,0.12), 0px 3px 1px -2px rgba(93,109,126,0.16)',
            py: 0.5,
            px: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 12,
            cursor: 'col-resize',
          }}
        >
          <Box sx={{ color: 'text.secondary', display: 'flex' }}>
            <IconGridDots size={10} />
          </Box>
        </Box>
      </Box>

      {/* Document panel */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          bgcolor: 'rgba(255,255,255,0.4)',
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          p: 0,
          height: '100%',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Header: badge icon + filename + close */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, px: 2, pt: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
            {/* Document badge: circular primary bg + scan icon overlay (simulates the PDF thumbnail) */}
            <Box sx={{ position: 'relative', width: 32, height: 29, flexShrink: 0 }}>
              {/* Outer circle (bank logo placeholder) */}
              <Box
                sx={{
                  position: 'absolute',
                  width: 22,
                  height: 22,
                  top: 4,
                  left: 5,
                  borderRadius: '50%',
                  bgcolor: 'primary.100',
                  opacity: 0.8,
                }}
              />
              {/* Inner circle */}
              <Box
                sx={{
                  position: 'absolute',
                  width: 32,
                  height: 29,
                  top: 0,
                  left: 0,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  opacity: 0.15,
                }}
              />
              {/* Scan icon centered */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconScan size={11} />
              </Box>
            </Box>

            <Typography variant="subtitle2" noWrap>
              {filename}
            </Typography>
          </Box>

          <IconButton size="small" sx={{ p: '2px', flexShrink: 0 }} onClick={onClose}>
            <IconX size={16} />
          </IconButton>
        </Box>

        {/* Document preview — the actual scanned document image */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            mx: 2,
            borderRadius: 0.5,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src={documentPreview}
            alt="Documento"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top',
              display: 'block',
            }}
          />

          {/* Scan glow trail */}
          {isScanning && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 80,
                background: 'linear-gradient(to bottom, rgba(47,67,208,0.10), transparent)',
                animation: 'ocrGlow 2.8s ease-in-out infinite',
                '@keyframes ocrGlow': {
                  '0%': { transform: 'translateY(-80px)', opacity: 0 },
                  '5%': { opacity: 1 },
                  '88%': { opacity: 1 },
                  '100%': { transform: 'translateY(100%)', opacity: 0 },
                },
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
          )}

          {/* Scan line */}
          {isScanning && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: 'linear-gradient(to right, transparent 0%, rgba(47,67,208,0.5) 15%, rgba(83,105,255,1) 50%, rgba(47,67,208,0.5) 85%, transparent 100%)',
                boxShadow: '0 0 6px 2px rgba(47,67,208,0.35), 0 0 14px 4px rgba(83,105,255,0.2)',
                animation: 'ocrScanLine 2.8s ease-in-out infinite',
                '@keyframes ocrScanLine': {
                  '0%': { top: 0, opacity: 0 },
                  '4%': { opacity: 1 },
                  '88%': { top: '100%', opacity: 1 },
                  '100%': { top: '100%', opacity: 0 },
                },
                pointerEvents: 'none',
                zIndex: 3,
              }}
            />
          )}

          {/* Scan highlight rectangle (blue selection overlay) */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '20%',
              left: '4%',
              width: '92%',
              height: 68,
              bgcolor: 'rgba(47,67,208,0.08)',
              border: '1px solid rgba(47,67,208,0.2)',
              borderRadius: 0.5,
              pointerEvents: 'none',
              opacity: isScanning ? 0 : 1,
              transition: 'opacity 0.4s ease-in',
            }}
          />
        </Box>

        {/* Preview controls bar */}
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.5,
            py: 0.75,
            borderTop: '1px solid',
            borderColor: 'grey.100',
          }}
        >
          {/* Navegación de páginas */}
          <IconButton size="small" sx={{ p: '3px' }} disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <IconChevronLeft size={14} />
          </IconButton>
          <Typography variant="caption" sx={{ minWidth: 28, textAlign: 'center', color: 'text.secondary' }}>
            {page}/{totalPages}
          </Typography>
          <IconButton size="small" sx={{ p: '3px' }} disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            <IconChevronRight size={14} />
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: '4px' }} />

          {/* Zoom */}
          <IconButton size="small" sx={{ p: '3px' }} disabled={zoomIdx <= 0} onClick={() => setZoomIdx((i) => Math.max(0, i - 1))}>
            <IconZoomOut size={14} />
          </IconButton>
          <Typography variant="caption" sx={{ minWidth: 36, textAlign: 'center', color: 'text.secondary' }}>
            {ZOOM_STEPS[zoomIdx]}%
          </Typography>
          <IconButton size="small" sx={{ p: '3px' }} disabled={zoomIdx >= ZOOM_STEPS.length - 1} onClick={() => setZoomIdx((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))}>
            <IconZoomIn size={14} />
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: '4px' }} />

          {/* Acciones */}
          <IconButton size="small" sx={{ p: '3px', color: 'text.secondary' }}>
            <IconRotate size={14} />
          </IconButton>
          <IconButton size="small" sx={{ p: '3px', color: 'text.secondary' }}>
            <IconDownload size={14} />
          </IconButton>
          <IconButton size="small" sx={{ p: '3px', color: 'text.secondary' }}>
            <IconArrowsMaximize size={14} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
