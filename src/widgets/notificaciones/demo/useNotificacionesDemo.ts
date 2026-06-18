import { useEffect, useRef } from 'react';
import { useNotificacionesContext } from '../context/NotificacionesContext';

const MOCK_MSGS = [
  'Tercero NIT-900123456 actualizado correctamente',
  'Tercero NIT-800987654 creado exitosamente',
  'Tercero NIT-860012345 inactivado',
  'Dirección de NIT-900123456 eliminada',
  'Contacto de NIT-800987654 actualizado',
  'Perfil tributario de NIT-860012345 modificado',
  'Tercero NIT-900123457 registrado con OCR',
];

const BETWEEN_NOTIFS_MS = 4000; // entre cada notificación del lote
const COOLDOWN_MS = 20000;      // pausa tras el último del lote antes del siguiente ciclo
const BATCH_SIZE = 4;

export function useNotificacionesDemo() {
  const { agregarNotificacion } = useNotificacionesContext();
  const indexRef = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    function cancelAll() {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    }

    function scheduleCycle(offsetMs: number) {
      for (let i = 0; i < BATCH_SIZE; i++) {
        const t = setTimeout(() => {
          const msg = MOCK_MSGS[indexRef.current % MOCK_MSGS.length];
          indexRef.current++;
          agregarNotificacion(msg, {
            onClick: () => console.log(`Abrir detalle: ${msg}`),
          });
        }, offsetMs + i * BETWEEN_NOTIFS_MS);
        timers.current.push(t);
      }

      // Tras el último del lote, esperar COOLDOWN y arrancar el siguiente ciclo.
      // No se limpia nada: si el usuario no gestionó las anteriores se apilan con las nuevas.
      const nextAt = offsetMs + (BATCH_SIZE - 1) * BETWEEN_NOTIFS_MS + COOLDOWN_MS;
      const tNext = setTimeout(() => scheduleCycle(0), nextAt);
      timers.current.push(tNext);
    }

    scheduleCycle(0);
    return cancelAll;
  }, [agregarNotificacion]);
}
