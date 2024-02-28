import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from './router.jsx';
import { ThemeProvider } from '@mui/material';
import theme from './theme.js';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs  from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pl';
import { Toaster } from 'react-hot-toast';
dayjs.extend(relativeTime);
dayjs.locale('pl');
import "react-responsive-carousel/lib/styles/carousel.min.css";


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <Toaster
          position="top-center"
          reverseOrder
          gutter={20}
          toastOptions={{
            duration: 2500,
            style: {
              maxWidth: 300,
              width: '100%',
              display: 'flex',
              fontWeight: 600,
              fontSize: '1rem',
              wordBreak: 'break-word',
              padding: '1rem',
              color: theme.palette.text.primary,
              lineHeight: 1.5,
            },
            success: {
              style: {
                backgroundColor: '#f1fde2',
                border: '1px solid #5bb342',
                color: '#0a4501',
              },
            },
            error: {
              style: {
                backgroundColor: '#ffe5e5',
                border: '1px solid #d12020',
                color: '#590101',
              },
            },
          }}
        />
        <RouterProvider router={router} />
      </ThemeProvider>
    </LocalizationProvider>
  // </React.StrictMode>,
);
