import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import MainLayout from './components/layout/MainLayout';
import { NotificacionesProvider, NotificacionesWidget } from '@/widgets/notificaciones';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificacionesProvider>
        <MainLayout />
        <NotificacionesWidget />
      </NotificacionesProvider>
    </ThemeProvider>
  );
}

export default App;
