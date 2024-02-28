import { useAuth } from 'hooks/useAuth.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getData, patchData } from 'helpers/api.js';
import API from 'data/constants/api_routes.js';
import { Box, Button, Divider, Grid, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LearnCourse from 'pages/Learn/LearnCourse.jsx';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import Tooltip from '@mui/material/Tooltip';

function User() {
  const { user, logoutUser, updateUser } = useAuth();
  const enrollmentsServerState = useQuery({
    queryKey: ['enrollments', 'user.id'],
    queryFn: getData(API.users.enrollments(user?.id)),
  });
  const coursesServerState = useQuery({
    queryKey: ['courses', 'user.id'],
    queryFn: getData(API.users.courses(user?.id)),
  });

  const navigate = useNavigate();

  const enrollments = enrollmentsServerState.data;
  const courses = coursesServerState.data;

  const imageRef = useRef(null);

  const updateUserAvatar = useMutation({
    mutationKey: ['user', 'update'],
    mutationFn: patchData(API.users.user(user?.id)),
  });

  const imageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);

    await updateUserAvatar.mutateAsync(formData);
    await updateUser({ force: true });
    toast.success('Twój avatar został zaktualizowany');
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <Grid item xs={12} md={3}>
        <Box
          sx={{
            bgcolor: 'background.default',
            p: 2,
            borderRadius: '3px',
            boxShadow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Tooltip title={'Zmień avatar'} arrow placement={"right"}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: '3rem',
                bgcolor: 'primary.light',
                color: 'primary.dark',
                cursor: 'pointer',
              }}
              onClick={() => imageRef.current.click()}
            >
              <input
                type={'file'}
                ref={imageRef}
                accept={'image/*'}
                style={{ display: 'none' }}
                onChange={imageUpload}
              />
              {user?.avatar ? (
                <img
                  src={user?.avatar}
                  alt={`${user?.first_name} ${user?.last_name}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                user?.first_name?.charAt(0)
              )}
            </Avatar>
          </Tooltip>

          <Typography sx={{ fontSize: '1.5rem' }}>
            {user?.first_name} {user?.last_name}
          </Typography>
          <Box
            component="section"
            sx={{
              width: '100%',
              display: 'flex',
              mt: 2,
              gap: 2,
              flexDirection: 'column',
              '& .Mui-disabled': {
                WebkitTextFillColor: '#b6b6b6',
              },
              '& .MuiInput-root.Mui-disabled:before': {
                borderBottomStyle: 'inset',
              },
              '& .MuiInput-root.Mui-disabled:after': {
                borderBottomStyle: 'inset',
              },
              '& .MuiInput-input.Mui-disabled': {
                WebkitTextFillColor: '#393939',
                borderBottomStyle: 'inset',
              },
            }}
          >
            <TextField
              variant="standard"
              label="Imię"
              value={user?.first_name}
              disabled
            />
            <TextField
              variant="standard"
              label="Nazwisko"
              value={user?.last_name}
              disabled
            />
            <TextField
              variant="standard"
              label="Email"
              value={user?.email}
              disabled
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 2,
              width: '100%',
            }}
          >
            <Button variant="outlined" onClick={() => navigate('/')}>
              Ucz się
            </Button>
            <Button variant="outlined" onClick={() => navigate('/dodaj-kurs')}>
              Nauczaj
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => logoutUser()}
            >
              Wyloguj się
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={9}>
        <Box
          component="section"
          sx={{
            bgcolor: 'background.default',
            p: 2,
          }}
        >
          <Typography sx={{ fontSize: '1.4rem' }}>Twoje zapisy</Typography>
          <Divider sx={{ mt: 0, mb: 2 }} />
          <Grid container spacing={2} sx={{ display: 'flex' }}>
            {!enrollments?.length ? (
              <Typography sx={{ p: 2, textAlign: 'center' }}>
                Brak wydarzeń
              </Typography>
            ) : (
              enrollments.map((enrollment) => (
                <LearnCourse
                  key={enrollment.id}
                  course={enrollment}
                  mode={
                    enrollment?.is_mine
                      ? 'mine'
                      : enrollment?.is_attendee
                        ? 'attend'
                        : 'default'
                  }
                />
              ))
            )}
          </Grid>
        </Box>
        <Box
          component="section"
          sx={{
            bgcolor: 'background.default',
            p: 2,
          }}
        >
          <Typography sx={{ fontSize: '1.4rem' }}>Twoje kursy</Typography>
          <Divider sx={{ mt: 0, mb: 2 }} />
          <Grid container spacing={2} sx={{ display: 'flex' }}>
            {!courses?.length ? (
              <Typography sx={{ p: 2, textAlign: 'center' }}>
                Brak kursów
              </Typography>
            ) : (
              courses.map((course) => (
                <LearnCourse
                  key={course.id}
                  course={course}
                  mode={
                    course?.is_mine
                      ? 'mine'
                      : course?.is_attendee
                        ? 'attend'
                        : 'default'
                  }
                />
              ))
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export default User;
