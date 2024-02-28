import { Outlet } from 'react-router-dom';

import { useTheme } from '@mui/material';
import { Box } from '@mui/material';

import Navbar from './Navbar/Navbar.jsx';

function Layout() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        maxWidth: '100%',
        marginInline: 'auto',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          position: 'relative',
          bgcolor: theme.palette.background.default,
          minHeight: 'calc(100vh - 7.25rem)',
          maxWidth: 'lg',
          width: '100%',
        }}
      >
        <Outlet />
      </Box>
      <Box
        component="footer"
        sx={{
          bgcolor: 'background.main',
          color: 'text.primary',
          height: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderTop: '2px solid',
          borderColor: 'primary.light',
          width: '100%',
        }}
      >
        © 2024 AzenoIT
      </Box>
    </Box>
  );
}

export default Layout;
