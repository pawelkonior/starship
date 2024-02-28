import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import API from '../data/constants/api_routes.js';
import { useMutation } from '@tanstack/react-query';
import { postData } from '../helpers/api.js';
import Typography from '@mui/material/Typography';
import { Box, Button, Divider, Grid, TextField } from '@mui/material';
import { inputStyles } from 'pages/Login.jsx';
import LoginImg from 'assets/login.jpg';
import toast from 'react-hot-toast';

function Register() {
  const { updateUser, setAuthTokens } = useAuth();
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: postData(API.users.all),
  });

  const handleRegistration = async (e) => {
    e.preventDefault();
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const passwordConfirmation = e.target.passwordConfirmation.value;
    const data = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      password_confirmation: passwordConfirmation,
    };

    try {
      await registerMutation.mutateAsync(data);
      toast.success('Na adres e-mail wysłano link aktywacyjny');
      navigate('/zaloguj-sie');
    } catch (error) {
      toast.error(Object.values(error).join('\n '));
    }
  };

  const customLabelWidth = {
    '& label': { width: { xs: '7rem', md: '10rem' }, textAlign: 'right' },
  };

  const customStyles = {
    ...inputStyles,
    ...customLabelWidth,
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
          onSubmit={handleRegistration}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '.5rem',
            border: '1px solid',
            borderColor: 'border.light',
            bgcolor: 'background.main',
            maxWidth: '22rem',
            p: {
              xs: '1rem',
              md: '2rem 3rem',
            },
            width: '100%',
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
            }}
          >
            Zarejestruj się
          </Typography>
          <Divider sx={{ mt: '.5rem', mb: '2rem' }} />

          <Box sx={customStyles}>
            <label htmlFor="firstName" style={{ textAlign: 'right' }}>
              Imię:
            </label>
            <TextField
              type="firstName"
              id="firstName"
              name="firstName"
              required
              size="small"
            />
          </Box>
          <Box sx={customStyles}>
            <label htmlFor="lastName">Nazwisko:</label>
            <TextField
              type="lastName"
              id="lastName"
              name="lastName"
              required
              size="small"
            />
          </Box>
          <Box sx={customStyles}>
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
          <Box sx={customStyles}>
            <label htmlFor="password">Hasło:</label>
            <TextField
              type="password"
              id="password"
              name="password"
              required
              size="small"
            />
          </Box>
          <Box sx={customStyles}>
            <label htmlFor="passwordConfirmation">Powtórz hasło:</label>
            <TextField
              type="password"
              id="passwordConfirmation"
              name="passwordConfirmation"
              required
              size="small"
            />
          </Box>
          <Button
            type="submit"
            disabled={registerMutation.isLoading}
            sx={{ my: '1rem' }}
            variant="outlined"
          >
            {registerMutation.isLoading
              ? 'Rejestruje się...'
              : 'Zarejestruj się'}
          </Button>
          <Typography sx={{ textAlign: 'center', mt: '.5rem' }}>
            Masz już konto? <a href="/zaloguj-sie">Zaloguj się</a>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Register;
