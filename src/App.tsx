import { Routes, Route } from 'react-router-dom';
import { TercerosPanoramaPage } from '@/pages/terceros-panorama';
import { TerceroRegistroPage } from '@/pages/tercero-registro';
import { TerceroRegistroOcrPage } from '@/pages/tercero-registro-ocr';
import { OcrBatchResultPage } from '@/pages/ocr-batch-result';
import { TerceroEdicionPage } from '@/pages/tercero-edicion';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TercerosPanoramaPage />} />
      <Route path="/nuevo" element={<TerceroRegistroPage />} />
      <Route path="/nuevo/ocr" element={<TerceroRegistroOcrPage />} />
      <Route path="/nuevo/ocr/batch" element={<OcrBatchResultPage />} />
      <Route path="/:id" element={<TerceroEdicionPage />} />
    </Routes>
  );
}
