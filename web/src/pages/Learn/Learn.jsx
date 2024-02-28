import {
  Autocomplete,
  Box,
  Grid,
  InputAdornment,
  Skeleton,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import LearnCourse from 'pages/Learn/LearnCourse.jsx';
import Typography from '@mui/material/Typography';
import API from 'data/constants/api_routes.js';
import { useQuery } from '@tanstack/react-query';
import { getData } from 'helpers/api.js';
import useDebounce from 'hooks/useDebounce.js';
import SortBy from 'components/Inputs/SortBy.jsx';

function Learn() {
  const [value, setValue] = useState('');
  const [sortBy, setSortBy] = useState('-course_date');

  const debounedSearchValue = useDebounce(value, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['courses', debounedSearchValue, sortBy],
    queryFn: getData(
      `${API.courses.all}?title__icontains=${debounedSearchValue}&ordering=${sortBy}`,
    ),
  });

  const onChangeHandler = (event, value) => {
    if (value !== null && value !== undefined && value !== '') {
      setValue(value);
    } else {
      setValue('');
    }
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Autocomplete
          id="search-bar"
          freeSolo
          autoHighlight={false}
          value={value}
          inputValue={value}
          onChange={onChangeHandler}
          onInputChange={onChangeHandler}
          size="large"
          sx={{
            width: '100%',
            bgcolor: 'background.main',
          }}
          options={[]}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="end" sx={{ pr: 1 }}>
                        <SearchIcon />
                      </InputAdornment>
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                placeholder={'Szukaj kursów...'}
                sx={{
                  height: '100%',
                  fieldset: {
                    borderRadius: '3px',
                  },
                }}
              />
            );
          }}
        />
      </Grid>

      <SectionTitle
        title="Lista kursów"
        ordering={sortBy}
        setOrdering={setSortBy}
      />
      {data?.results?.length > 0 ? (
        data?.results.map((course, index) => (
          <LearnCourse
            key={index}
            course={course}
            searchValue={debounedSearchValue}
            sortBy={sortBy}
            mode={
              course?.is_mine
                ? 'mine'
                : course?.is_attendee
                  ? 'attend'
                  : 'default'
            }
          />
        ))
      ) : isLoading ? (
        Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCourse key={index} />
        ))
      ) : (
        <Typography sx={{ p: 2, textAlign: 'center' }}>
          Nie znaleziono kursów
        </Typography>
      )}
    </Grid>
  );
}

export default Learn;

const SectionTitle = ({ title, ordering, setOrdering }) => (
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
        {title}
      </Typography>
      <SortBy ordering={ordering} setOrdering={setOrdering} />
    </Box>
  </Grid>
);

const SkeletonCourse = () => (
  <Grid item xs={12} sm={6} md={4} lg={3}>
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
