import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Tooltip from '@mui/material/Tooltip';
import { Box, Chip } from '@mui/material';
import Typography from '@mui/material/Typography';

const StarCoin = ({ value }) => {
  return (
    <Tooltip title="StarCoin" arrow sx={{ display: 'flex' }}>
      <Chip
        label={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontWeight: 700,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {value || value === 0 ? (
                <Typography sx={{ fontWeight: 700, pl: 1.5, pr: 0.5 }}>
                  {value}
                </Typography>
              ) : null}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  border: '2px solid',
                  borderRadius: '100%',
                  borderColor: 'primary.main',
                  boxShadow: 1,
                  p: 0.5,
                }}
              >
                <RocketLaunchIcon
                  sx={{ fontSize: '1.2rem', color: 'primary.dark' }}
                />
              </Box>
            </Box>
          </Box>
        }
        sx={{
          m: 1,
          p: 0,
          border: '1px solid',
          borderColor: 'primary.light',
          borderRadius: '5rem',
          bgcolor: 'transparent',
          '& .MuiChip-label': { p: 0 },
        }}
      />
    </Tooltip>
  );
};

export default StarCoin;
