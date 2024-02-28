import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { Box, Button, Divider, Grid, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useAuth } from '../hooks/useAuth.js';
import axios from '../helpers/axiosInstance.js';
import API from '../data/constants/api_routes.js';
import LoginImg from 'assets/login.jpg';
import toast from "react-hot-toast";

export const inputStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '.5rem',
  width: '100%',
  '& .MuiTextField-root': { width: '100%' },
  '& label': { whiteSpace: 'nowrap', textAlign: 'right' },
};

function Login() {
  const { updateUser, setAuthTokens } = useAuth();
  const navigate = useNavigate();

  const sendCredentials = async ({ email, password }) => {
    const response = await axios.post(API.auth.token, {
      email,
      password,
    })
    setAuthTokens(response.data);
    await updateUser({force: false});
  };
  const loginMutation = useMutation({
    mutationFn: sendCredentials,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const data = { email, password };

    try {
      await loginMutation.mutateAsync(data);
      toast.success('Zalogowano pomyślnie');
      navigate('/');
    } catch (error) {
      toast.error('Niepoprawne dane logowania');
    }
  };

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid
        item
        xs={6}
        sx={{
          maxHeight: 'calc(100vh - 7.25rem)',
          overflow: 'hidden',
          display: {
            xs: 'none',
            md: 'block',
          },
        }}
      >
        <img
          src={LoginImg}
          alt="Photo by Solen Feyissa on Unsplash"
          style={{
            width: '100%',
            objectFit: 'cover',
            height: '100%',
            maxHeight: '100%',
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 7.25rem)',
          p: {
            xs: '1rem',
            md: 0,
          },
          width: '100%',
        }}
      >
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '.5rem',
            border: '1px solid',
            borderColor: 'border.light',
            bgcolor: 'background.main',
            width: '100%',
            maxWidth: '20rem',
            p: {
              xs: '1rem',
              md: '2rem 3rem',
            },
            borderRadius: '3px',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: 'text.secondary',
              fontSize: '2.5rem',
              textAlign: 'center',
              fontWeight: '600',
              textShadow: '1px 1px 1px rgba(0,0,0,.1)',
              bgcolor: 'background.main',
            }}
          >
            Zaloguj się
          </Typography>
          <Divider sx={{ mt: '.5rem', mb: '2rem' }} />

          <Box sx={inputStyles}>
            <label htmlFor="email">Email:</label>
            <TextField
              type="email"
              id="email"
              name="email"
              required
              size="small"
              placeholder="np. jan.kowalski@gmail.com"
            />
          </Box>
          <Box sx={inputStyles}>
            <label htmlFor="password">Hasło:</label>
            <TextField
              type="password"
              id="password"
              name="password"
              required
              size="small"
            />
          </Box>
          <Button
            type="submit"
            disabled={loginMutation.isLoading}
            sx={{ my: '1rem' }}
            variant="outlined"
          >
            {loginMutation.isLoading ? 'Loguję się...' : 'Zaloguj się'}
          </Button>
          <Typography sx={{ textAlign: 'center', mt: '.5rem' }}>
            Nie masz konta? <a href="/zarejestruj-sie">Zarejestruj się</a>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Login;
