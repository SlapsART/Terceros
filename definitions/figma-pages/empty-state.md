# Empty State

**Sección Figma:** `Empty state` (node `4578:62534`)

---

## Página principal

| Estado | Link |
|--------|------|
| Vista base — Detalle del tercero con cards de Contactos y Direcciones vacías | [Terceros \| Detalle \| Perfil](https://www.figma.com/design/RsWDP9n6V5NpjDgReTJrMP?node-id=4577-62108) |

---

## Componentes EmptyState

### EmptyState — Contactos

Aparece en la card de Contactos cuando el tercero no tiene contactos registrados.

| Elemento | Valor |
|----------|-------|
| Título | "No tienes contactos registrados" |
| Descripción | "Aquí aparecerán todos tus contacto, empieza registrando uno." |
| Acción primaria | "Agregar contacto" |
| Acción secundaria | "Opción 1" |
| Link | [EmptyState Contactos](https://www.figma.com/design/RsWDP9n6V5NpjDgReTJrMP?node-id=4578-62508) |

### EmptyState — Direcciones

Aparece en la card de Direcciones cuando el tercero no tiene direcciones registradas.

| Elemento | Valor |
|----------|-------|
| Título | "No tienes direcciones registradas" |
| Descripción | "Aquí aparecerán todas tus direcciones, empieza registrando una." |
| Acción primaria | "Agregar contacto" |
| Acción secundaria | "Opción 1" |
| Link | [EmptyState Direcciones](https://www.figma.com/design/RsWDP9n6V5NpjDgReTJrMP?node-id=4578-62535) |

---

## Estructura del componente EmptyState

```
EmptyState
├── Header         → icono ilustrativo (Orbits/Icon)
├── Content
│   ├── Title empty  → texto del título
│   └── Description  → texto descriptivo
└── Actions
    ├── <Button>   → acción primaria
    └── <Button>   → acción secundaria
```

El componente se renderiza dentro de la card correspondiente (Contactos o Direcciones) cuando su lista de items está vacía, reemplazando el contenido de la tabla/DataGrid.
