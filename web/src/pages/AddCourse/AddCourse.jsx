import { useMutation } from '@tanstack/react-query';
import { postData } from 'helpers/api.js';
import API, { BASE_URL, HTTP_PROTOCOL } from "data/constants/api_routes.js";
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  TextField,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { inputStyles } from 'pages/Login.jsx';
import { DateTimePicker } from '@mui/x-date-pickers';
import KeywordsInput from 'components/Inputs/KeywordsInput.jsx';
import StarCoin from 'components/Currency/StarCoin.jsx';
import { useState } from 'react';
import Agenda from 'components/Inputs/Agenda.jsx';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { generateRoomId } from "../../helpers/generateRoomId.js";

function AddCourse() {
  const addCourseMutation = useMutation({
    mutationKey: ['courses'],
    mutationFn: postData(API.courses.all),
  });
  const navigate = useNavigate();

  const [tagsList, setTagsList] = useState([]);
  const [agendaItems, setAgendaItems] = useState(['']);
  const [courseLevel, setCourseLevel] = useState('Beginner');
  const [isUsingWebrtc, setIsUsingWebrtc] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const description = event.target.description.value;
    const duration = event.target.duration.value;
    const course_date = event.target.course_date.value;
    const link = isUsingWebrtc || !event.target.link.value ? `${HTTP_PROTOCOL}://${BASE_URL}/kurs/${generateRoomId()}` : event.target.link.value;
    const tags = tagsList || [];
    const price = event.target.price.value;
    const img = event.target.img.files[0] ?? '';
    const agenda = agendaItems || [];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('duration', duration);
    formData.append(
      'course_date',
      dayjs(course_date, 'DD.MM.YYYY HH:mm').toISOString(),
    );
    formData.append('link', link);
    formData.append('level', courseLevel);
    formData.append('tags', JSON.stringify(tags));
    formData.append('price', price);
    formData.append('image', img);
    formData.append('agenda', JSON.stringify(agenda));

    try {
      await addCourseMutation.mutateAsync(formData);
      navigate('/ucz-sie');
      toast.success('Kurs został dodany');
    } catch (error) {
      toast.error('Nie udało się dodać kursu');
    }
  };

  const customLabelWidth = {
    '& label': {
      flex: {
        xs: '1 0 2rem',
        sm: '1 0 8rem',
      },
      textAlign: 'right',
      whiteSpace: 'nowrap',
    },
  };

  const customStyles = {
    ...inputStyles,
    ...customLabelWidth,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 'sm',
        margin: 'auto',
        width: 'inherit',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: 'background.main',
          p: 2,
        }}
      >
        <Box sx={{ width: 'fit-content', bgcolor: 'background.main' }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              border: '1px solid',
              borderColor: 'border.light',
              bgcolor: 'background.main',
              p: {
                xs: 1,
                sm: 2,
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
              }}
            >
              Dodaj kurs
            </Typography>
            <Divider sx={{ mb: '1rem' }} />

            <Box sx={customStyles}>
              <label htmlFor="title">Tytuł:</label>
              <TextField id="title" name="title" required size="small" />
            </Box>
            <Box sx={customStyles}>
              <label htmlFor="description">Opis:</label>
              <TextField
                multiline
                id="description"
                name="description"
                required
                rows={3}
              />
            </Box>
            <Box sx={customStyles}>
              <label htmlFor="duration">Czas trwania:</label>
              <TextField
                type="number"
                id="duration"
                name="duration"
                defaultValue={0}
                required
                size="small"
              />
              <TextField value="minut" disabled size="small" />
            </Box>
            <Box sx={customStyles}>
              <label htmlFor="course_date">Data kursu:</label>
              <DateTimePicker
                ampm={false}
                format={'DD/MM/YYYY HH:mm'}
                slotProps={{ textField: { size: 'small' } }}
                name="course_date"
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '8.5px 14px',
                  },
                }}
                id="course_date"
              />
            </Box>

            <Box sx={{ ...customStyles, flexDirection: 'column' }}>
              <Typography>
                <Checkbox
                  id="webrtc"
                  value={isUsingWebrtc}
                  onClick={() => setIsUsingWebrtc((prev) => !prev)}
                />
                Użyj komunikatora Starship
              </Typography>
              { !isUsingWebrtc &&
                <Box sx={customStyles}>
                  <label htmlFor="link">Link do spotkania:</label>
                  <TextField id="link" name="link" size="small" />
                </Box>
              }
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                component="label"
                htmlFor="level"
                sx={{
                  flex: {
                    xs: '1 0 2rem',
                    sm: '1 0 7rem',
                  },
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                }}
              >
                Poziom kursu:
              </Typography>
              <RadioGroup
                id="level"
                name="level"
                sx={{ width: '100%' }}
                value={courseLevel}
                onChange={() => {
                  setCourseLevel(event.target.value);
                }}
              >
                <FormControlLabel
                  value="Beginner"
                  control={<Radio />}
                  label="Dla wszystkich"
                />
                <FormControlLabel
                  value="Intermediate"
                  control={<Radio />}
                  label="Średniozaawansowany"
                />
                <FormControlLabel
                  value="Advanced"
                  control={<Radio />}
                  label="Dla zaawansowanych"
                />
                <FormControlLabel
                  value="Expert"
                  control={<Radio />}
                  label="Ekspert"
                />
              </RadioGroup>
            </Box>

            <KeywordsInput
              label="Tagi:"
              name="tags"
              id="tags"
              value={tagsList}
              setValue={setTagsList}
            />

            <Box sx={{ ...customStyles, mt: 2 }}>
              <label htmlFor="duration">Cena:</label>
              <Slider
                name="price"
                id="price"
                aria-label="StarCoins"
                defaultValue={25}
                step={5}
                marks
                min={10}
                max={100}
                valueLabelDisplay="on"
                sx={{
                  '& .MuiSlider-valueLabel': {
                    backgroundColor: 'primary.dark',
                    color: 'text.contrast',
                    fontSize: '.8rem',
                  },
                }}
              />
              <StarCoin />
            </Box>

            <Box sx={customStyles}>
              <label htmlFor="img">Zdjęcie:</label>
              <input
                type="file"
                name="img"
                alt="Zdjęcie kursu"
                accept="image/*"
                style={{ width: '100%' }}
              />
            </Box>
            <Divider />
            <Agenda items={agendaItems} setItems={setAgendaItems} />
            <Button
              variant="contained"
              type="submit"
              sx={{ color: 'text.contrast', mt: 2 }}
            >
              Utwórz kurs
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AddCourse;
