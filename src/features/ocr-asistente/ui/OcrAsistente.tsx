import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import {
  IconArrowUp,
  IconBubble,
  IconChevronDown,
  IconLayoutSidebarRight,
  IconMessageSearch,
  IconPaperclip,
  IconPlus,
  IconFileText,
  IconX,
} from '@tabler/icons-react';

type OcrState = 'idle' | 'cargar' | 'archivos' | 'analizando' | 'link-digitando' | 'link-validando';

interface AttachedFile {
  name: string;
  sizeLabel: string;
  formatLabel: string;
}

const ASISTENTE_SX = {
  position: 'fixed',
  bottom: '12px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 680,
  bgcolor: 'grey.100',
  border: '1px solid rgba(47,67,208,0.12)',
  borderRadius: '8px',
  boxShadow: '0px 3px 14px 2px rgba(47,67,208,0.09), 2px 4px 6px 1px rgba(182,192,255,0.14), 2px 4px 4px -3px rgba(182,192,255,0.2)',
  p: 1,
  px: 1.5,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  zIndex: 1200,
} as const;

function isUrl(text: string) {
  return /^https?:\/\//i.test(text.trim()) || /^HTTPS?:\/\//i.test(text.trim());
}

interface InputPromptProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onAttach?: () => void;
  attachedFiles?: AttachedFile[];
  onRemoveFile?: (i: number) => void;
  placeholder?: string;
}

function InputPrompt({
  value,
  onChange,
  onSend,
  onAttach,
  attachedFiles,
  onRemoveFile,
  placeholder = 'Describe lo que necesitas...',
}: InputPromptProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {attachedFiles && attachedFiles.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {attachedFiles.map((f, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: 1,
                px: 1,
                py: 0.5,
              }}
            >
              <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                <IconFileText size={14} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 500, lineHeight: 1.2 }}>
                  {f.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                  {f.sizeLabel} · {f.formatLabel}
                </Typography>
              </Box>
              {onRemoveFile && (
                <IconButton size="small" sx={{ p: 0.25 }} onClick={() => onRemoveFile(i)}>
                  <IconX size={12} />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      )}

      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid rgba(47,67,208,0.4)',
          borderRadius: '20px',
          px: 1,
          py: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <IconButton size="small" sx={{ p: '3px' }} onClick={onAttach}>
          <IconPlus size={14} />
        </IconButton>

        <InputBase
          fullWidth
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend())}
          sx={{
            fontSize: '0.8125rem',
            lineHeight: '16px',
            letterSpacing: '0.17px',
            color: 'text.primary',
            flex: 1,
          }}
        />

        <Box
          sx={{
            bgcolor: 'rgba(47,67,208,0.3)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconButton size="small" sx={{ p: '3px' }} onClick={onSend}>
            <IconArrowUp size={14} />
          </IconButton>
        </Box>
      </Box>

      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ textAlign: 'center', letterSpacing: '0.4px', display: 'block' }}
      >
        El contenido generado por IA puede ser incorrecto.
      </Typography>
    </Box>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pl: 7 }}>
      <Box
        sx={{
          bgcolor: 'rgba(47,67,208,0.08)',
          px: 1,
          py: 0.5,
          borderRadius: '4px 4px 0 4px',
        }}
      >
        <Typography variant="body2">{text}</Typography>
      </Box>
    </Box>
  );
}

function NameChatBar({ onCollapse }: { onCollapse: () => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box sx={{ color: 'primary.main', display: 'flex' }}>
          <IconBubble size={16} />
        </Box>
        <Typography sx={{ fontSize: '0.8125rem', letterSpacing: '0.15px', color: 'primary.main', lineHeight: '16px' }}>
          [Nombre del chat]
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'grey.200', borderRadius: '4px', p: '4px', display: 'flex', cursor: 'pointer' }}>
          <IconPlus size={14} />
        </Box>
        <IconButton size="small" sx={{ p: '3px' }}><IconMessageSearch size={16} /></IconButton>
        <IconButton size="small" sx={{ p: '3px' }}><IconLayoutSidebarRight size={16} /></IconButton>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: '5px' }} />
        <IconButton size="small" sx={{ p: '3px' }} onClick={onCollapse}><IconChevronDown size={16} /></IconButton>
      </Box>
    </Box>
  );
}

export function OcrAsistente() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [ocrState, setOcrState] = useState<OcrState>('idle');
  const [inputValue, setInputValue] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [linkUrl, setLinkUrl] = useState('');

  const handleRegistrar = () => navigate('/nuevo');
  const handleCargar = () => setOcrState('cargar');
  const handleAttach = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const mapped: AttachedFile[] = files.map((f) => ({
      name: f.name,
      sizeLabel: `${Math.max(1, Math.round(f.size / 1024 / 1024))} MB`,
      formatLabel: f.name.split('.').pop()?.toUpperCase() ?? 'PDF',
    }));
    setAttachedFiles((prev) => [...prev, ...mapped]);
    setOcrState('archivos');
    e.target.value = '';
  };

  const handleRemoveFile = (i: number) => {
    setAttachedFiles((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      if (next.length === 0) setOcrState('cargar');
      return next;
    });
  };

  const handleSendFiles = () => {
    if (ocrState === 'archivos' && attachedFiles.length > 0) {
      setOcrState('analizando');
      setTimeout(() => {
        navigate('/nuevo/ocr', { state: { files: attachedFiles } });
      }, 1500);
    }
  };

  const handleSendInput = () => {
    const val = inputValue.trim();
    if (!val) return;

    if (isUrl(val)) {
      setLinkUrl(val);
      setInputValue('');
      setOcrState('link-validando');
      setTimeout(() => {
        navigate('/nuevo/ocr/batch', {
          state: {
            sourceUrl: val,
            terceros: [
              { id: 'NIT-3251614-Col-Avianca', status: 'ready' },
              { id: '2847391-COL-2819', status: 'ready' },
              { id: 'OXP-DEV-2850-1', status: 'error' },
            ],
          },
        });
      }, 1800);
    } else if (ocrState === 'analizando') {
      navigate('/nuevo/ocr', { state: { files: attachedFiles } });
    }
  };

  const handleCollapse = () => {
    setOcrState('idle');
    setInputValue('');
    setAttachedFiles([]);
    setLinkUrl('');
  };

  // ── IDLE ──────────────────────────────────────────────────────────
  if (ocrState === 'idle') {
    return (
      <Box sx={ASISTENTE_SX}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', flex: 1, gap: 1, alignItems: 'center' }}>
            <Chip
              label="Registrar tercero"
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleRegistrar}
              sx={{ borderRadius: '4px', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.16px' }}
            />
            <Chip
              label="Cargar tercero"
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleCargar}
              sx={{ borderRadius: '4px', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.16px' }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" sx={{ p: '3px' }}><IconMessageSearch size={16} /></IconButton>
            <IconButton size="small" sx={{ p: '3px' }}><IconLayoutSidebarRight size={16} /></IconButton>
          </Box>
        </Box>

        <InputPrompt
          value={inputValue}
          onChange={(v) => {
            setInputValue(v);
            if (isUrl(v)) setOcrState('cargar');
          }}
          onSend={handleSendInput}
          onAttach={handleAttach}
        />

        <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleFileChange} />
      </Box>
    );
  }

  // ── EXPANDED (cargar / archivos / analizando / link-*) ───────────
  return (
    <Box sx={ASISTENTE_SX}>
      <NameChatBar onCollapse={handleCollapse} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, position: 'relative', overflow: 'hidden' }}>
        {/* Fade top gradient */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 32, background: 'linear-gradient(to bottom, #f5f5f6, rgba(245,245,246,0))', zIndex: 1, pointerEvents: 'none' }} />

        {/* USER bubble — action that triggered the state */}
        <UserBubble text={ocrState.startsWith('link') ? 'Cargar tercero' : 'Cargar tercero'} />

        {/* IA response */}
        <Box sx={{ pr: 7 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Tienes 2 opciones:
            <br />
            Cargar uno o varios archivos
            <br />
            Copiar y pegar en el chat el enlace.
          </Typography>

          {(ocrState === 'cargar' || ocrState === 'archivos') && (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<IconPaperclip size={16} />}
              onClick={handleAttach}
              sx={{ mt: 0.5 }}
            >
              Adjuntar archivos
            </Button>
          )}
        </Box>

        {/* Link bubble (sent URL) */}
        {(ocrState === 'link-validando') && linkUrl && (
          <UserBubble text={linkUrl} />
        )}

        {/* Analizando / Validando message */}
        {ocrState === 'analizando' && (
          <Box sx={{ pr: 7, mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              • Analizando soporte - {attachedFiles[0]?.name ?? 'documento.pdf'}
            </Typography>
          </Box>
        )}

        {ocrState === 'link-validando' && (
          <Box sx={{ pr: 7, mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              • Validando datos...
            </Typography>
          </Box>
        )}
      </Box>

      {/* InputPrompt */}
      {ocrState === 'analizando' ? (
        <InputPrompt
          value="Si, registra el tercero con la información obtenida"
          onChange={() => {}}
          onSend={() => navigate('/nuevo/ocr', { state: { files: attachedFiles } })}
          placeholder=""
        />
      ) : (
        <InputPrompt
          value={inputValue}
          onChange={(v) => {
            setInputValue(v);
          }}
          onSend={ocrState === 'archivos' ? handleSendFiles : handleSendInput}
          onAttach={handleAttach}
          attachedFiles={ocrState === 'archivos' ? attachedFiles : undefined}
          onRemoveFile={handleRemoveFile}
        />
      )}

      <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleFileChange} />
    </Box>
  );
}
