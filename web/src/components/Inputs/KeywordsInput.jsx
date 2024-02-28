import {
  Typography,
  Autocomplete,
  TextField,
  Grid,
  Chip,
  Box,
} from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';

function KeywordsInput({
  name,
  id,
  label,
  required,
  sxInput,
  value,
  setValue,
}) {
  // Filter options
  const defaultFilterOptions = createFilterOptions();
  // Filter options handler, show 3 suggestions
  const filterOptions = (options, state) => {
    return defaultFilterOptions(options, state).slice(0, 3);
  };

  return (
    <Box component="section" sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          component="label"
          sx={{
            flex: {
              xs: '1 0 2rem',
              sm: '1 0 7rem',
            },
            mb: 0.5,
            textAlign: 'right',
          }}
        >
          {label}{' '}
          <Typography component="span" style={{ color: 'red' }}>
            {required ? '*' : ''}
          </Typography>
        </Typography>
        <Grid container spacing={1}>
          <Grid item sx={{ flex: 1 }}>
            <Autocomplete
              multiple
              freeSolo
              id={id}
              name={name}
              filterOptions={filterOptions}
              options={[
                'programowanie',
                'AI',
                'sztuczna inteligencja',
                'robot',
                'wynalazek',
                'wzór przemysłowy',
                'wzór użytkowy',
                'znak towarowy',
              ]}
              value={value}
              size="small"
              sx={{
                '.MuiAutocomplete-tag': {
                  margin: '2px 2px 1px 2px',
                },
                width: '100%',
                ...sxInput,
              }}
              noOptionsText="Brak wyników"
              onChange={(event, item) => {
                setValue(item);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={`${option}-${index}`}
                    sx={{
                      height: '100%',
                      whiteSpace: 'break-spaces',
                      py: 0.5,
                      '& .MuiChip-label': {
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                        textOverflow: 'clip',
                      },
                    }}
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} variant="outlined" />
              )}
            />
          </Grid>
        </Grid>
      </Box>
      {/* Error alert */}
      <Typography
        sx={{
          color: 'text.secondary',
          textAlign: 'right',
          fontSize: '.8rem',
          ml: 2,
        }}
      >
        Wpisany ręcznie tag należy potwierdzić enterem
      </Typography>
    </Box>
  );
}

export default KeywordsInput;
