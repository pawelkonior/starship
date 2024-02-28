import { Box, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import DoneIcon from '@mui/icons-material/Done';
import Typography from '@mui/material/Typography';

const SortBy = ({ ordering, setOrdering }) => {
  const options = [
    { value: '-course_date', label: 'najkrócej do rozpoczęcia' },
    { value: 'course_date', label: 'najdłużej do rozpoczęcia' },
    { value: 'price', label: 'najniższej ceny' },
    { value: '-price', label: 'najwyższej ceny' },
  ];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography>Sortuj od:</Typography>
      <TextField
        select
        value={ordering}
        onChange={(e) => setOrdering(e.target.value)}
        variant="outlined"
        size="small"
        sx={{
          width: {xs: '100%', sm: 'auto'},
          display: 'flex',
          '.MuiSelect-select': { display: 'flex', gap: 1 },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {option.label}{' '}
            {ordering === option.value && <DoneIcon color="primary" />}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default SortBy;
