import { useMutation } from '@tanstack/react-query';
import { postData } from 'helpers/api.js';
import API from 'data/constants/api_routes.js';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Divider, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { inputStyles } from 'pages/Login.jsx';
import KeywordsInput from 'components/Inputs/KeywordsInput.jsx';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from 'hooks/useAuth.js';

function AddProject() {
  const { user } = useAuth();
  const addProjectMutation = useMutation({
    mutationKey: ['courses'],
    mutationFn: postData(API.projects.all),
  });
  const navigate = useNavigate();

  const [tagsList, setTagsList] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const description = event.target.description.value;
    const liveVersionLink = event.target.live_version_link.value;
    const sourceCodeLink = event.target.source_code_link.value;
    const tags = tagsList || [];
    const imgs = event.target.img.files;

    const imgsLength = imgs.length;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('live_version_link', liveVersionLink);
    formData.append('source_code_link', sourceCodeLink);
    tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    for (let i = 0; i < imgsLength; i++) {
      formData.append(`images`, imgs[i]);
    }

    try {
      await addProjectMutation.mutateAsync(formData);
      navigate(`/portfolio/${user?.id}`);
      toast.success('Projekt został dodany');
    } catch (error) {
      toast.error('Nie udało się dodać projektu');
    }
  };

  const customLabelWidth = {
    '& label': {
      flex: {
        xs: '1 0 2rem',
        sm: '1 0 7rem',
      },
      textAlign: 'right',
      whiteSpace: 'wrap',
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
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: 'background.main',
          p: 2,
          width: '100%',
        }}
      >
        <Box sx={{ bgcolor: 'background.main' }}>
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
              Dodaj projekt
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
              <label htmlFor="live_version_link">Link do live projektu:</label>
              <TextField
                id="live_version_link"
                name="live_version_link"
                size="small"
              />
            </Box>
            <Box sx={customStyles}>
              <label htmlFor="source_code_link">Link do kodu źródłowego:</label>
              <TextField
                id="source_code_link"
                name="source_code_link"
                size="small"
              />
            </Box>

            <KeywordsInput
              label="Tagi:"
              name="tags"
              id="tags"
              value={tagsList}
              setValue={setTagsList}
            />

            <Box sx={customStyles}>
              <label htmlFor="img">Zdjęcia:</label>
              <input
                type="file"
                name="img"
                multiple={true}
                alt="Zdjęcia projektu"
                accept="image/*"
                style={{ width: '100%' }}
              />
            </Box>
            <Divider />
            <Button
              variant="contained"
              type="submit"
              sx={{ color: 'text.contrast', mt: 2 }}
            >
              Utwórz projekt
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AddProject;
