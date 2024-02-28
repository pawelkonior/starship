import { Box, Button, Grid, Skeleton } from '@mui/material';
import Typography from '@mui/material/Typography';
import PortfolioProject from 'pages/Portfolio/PortfolioProject.jsx';
import { useQuery } from '@tanstack/react-query';
import { getData } from 'helpers/api.js';
import API from 'data/constants/api_routes.js';
import { useAuth } from 'hooks/useAuth.js';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useParams } from 'react-router-dom';

function Portfolio() {
  const { user } = useAuth();
  const { userId } = useParams();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getData(API.users.projects(userId)),
  });
  
  const navigate = useNavigate();

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        {projects?.length > 0 ? <Box
          sx={{
            bgcolor: 'background.main',
            py: 1,
            border: '1px solid',
            borderColor: 'primary.light',
            borderRadius: '3px',
          }}
        >
          <Typography sx={{ textAlign: 'center', fontSize: '1.5rem' }}>
            Cześć, jestem{' '}
            <Typography
              component={'span'}
              sx={{ color: 'primary.main', fontSize: '1.5rem' }}
            >
              {projects?.[0]?.owner?.first_name}
            </Typography>
          </Typography>
        </Box> : null}
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: '3px',
            textShadow: '1px 1px 1px rgba(0,0,0,.1)',
            bgcolor: 'background.main',
            color: 'primary.main',
            border: '1px solid',
            borderColor: 'primary.light',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '1.2rem',
              letterSpacing: '1px',
            }}
          >
            Moje projekty
          </Typography>
          {user?.id.toString() === userId ? <Button
            variant="contained"
            color="primary"
            sx={{
              color: 'text.contrast',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
            onClick={() => navigate('/dodaj-projekt')}
          >
            <AddIcon /> Dodaj projekt
          </Button> : null}
        </Box>
      </Grid>

      {projects?.length > 0 ? (
        projects?.map((project) => (
          <PortfolioProject key={project.id} project={project} />
        ))
      ) : isLoading ?
        Array.from({ length: 8 }).map((_, index) => (
          <SkeletonProject key={index} />
        ))
        : (
        <Typography sx={{ p: 2, textAlign: 'center' }}>
          Nie znaleziono projektów
        </Typography>
      )}
    </Grid>
  );
}

export default Portfolio;


const SkeletonProject = () => (
  <Grid item xs={12} sm={6} md={4}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        border: '1px solid',
        borderColor: 'border.light',
        bgcolor: 'background.main',
        borderRadius: '3px',
        position: 'relative',
      }}
    >
      <Skeleton variant="rectangle" width="100%" height={150} sx={{ m: 0 }} />
      <Box sx={{px: 2}}>
        <Skeleton variant="text" width="100%" height={50} />
        <Skeleton variant="text" width="100%" height={50} />
        <Skeleton variant="text" width="100%" height={50} />
      </Box>
    </Box>
  </Grid>
);
