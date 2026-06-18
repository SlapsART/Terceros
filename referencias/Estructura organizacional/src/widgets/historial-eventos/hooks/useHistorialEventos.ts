import { useState, useMemo } from 'react';
import type { HistorialEvento } from '@/entities/historial-evento';

export function useHistorialEventos(eventos: HistorialEvento[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDescending, setSortDescending] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);

  const filteredEventos = useMemo(() => {
    let result = [...eventos];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.titulo.toLowerCase().includes(q)
      );
    }
    if (!sortDescending) result = result.reverse();
    return result;
  }, [eventos, searchQuery, sortDescending]);

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setAllExpanded(false);
  };

  const toggleAllExpanded = () => {
    if (allExpanded) {
      setExpandedIds(new Set());
      setAllExpanded(false);
    } else {
      const expandable = eventos.filter(e => e.detalles?.length || e.motivo);
      setExpandedIds(new Set(expandable.map(e => e.id)));
      setAllExpanded(true);
    }
  };

  const toggleSort = () => setSortDescending(prev => !prev);

  const isExpanded = (id: string) => expandedIds.has(id);

  return {
    searchQuery,
    setSearchQuery,
    sortDescending,
    toggleSort,
    filteredEventos,
    isExpanded,
    toggleExpanded,
    allExpanded,
    toggleAllExpanded,
  };
}
