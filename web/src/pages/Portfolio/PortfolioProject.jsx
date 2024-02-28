import { Box, Chip, Divider, Fade, Grid, Modal } from '@mui/material';
import Typography from '@mui/material/Typography';
import Placeholder from 'assets/placeholder.jpg';
import CloseIcon from '@mui/icons-material/Close.js';
import { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';

const PortfolioProject = ({ project }) => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.main',
          borderRadius: '3px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'primary.light',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: 2,
          },
        }}
        onClick={() => setShowDetail(true)}
      >
        <Box
          component="img"
          src={project?.images[0]?.image ?? Placeholder}
          alt={project.title}
          sx={{
            height: '30vh',
            objectFit: 'cover',
            position: 'relative',
          }}
        />
        <Box
          sx={{ p: 2, pb: 0, display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <Typography sx={{ fontSize: '1.7rem', fontWeight: 600 }}>
            {project.title}
          </Typography>
          <Typography
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              wordBreak: 'break-word',
              maxHeight: 'calc(1.2em * 5)',
              lineHeight: '1.2em',
            }}
          >
            {project?.description}
          </Typography>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography component="span">Live:</Typography>
            <Typography component="a" href={project.live_version_link}>
              {project.live_version_link}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography component="span">Kod źródłowy:</Typography>
            <Typography component="a" href={project.source_code_link}>
              {project.source_code_link}
            </Typography>
          </Box>
          {project?.tags?.length > 0 ? <Divider /> : null}
          <Box>
            {project?.tags?.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                sx={{
                  m: 0.5,
                  border: '1px solid',
                  borderColor: 'primary.dark',
                  borderRadius: '3px',
                  bgcolor: 'transparent',
                  color: 'primary.dark',
                  cursor: 'default',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    color: 'text.contrast',
                  },
                }}
              />
            ))}
          </Box>
          <Typography>{project.link}</Typography>
          <Typography>{project.level}</Typography>
        </Box>
      </Box>

      <ProjectModal
        open={showDetail}
        onClose={() => setShowDetail(false)}
        project={project}
      />
    </Grid>
  );
};

export default PortfolioProject;

const ProjectModal = ({ open, onClose, project }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        '.MuiBackdrop-root': {
          backdropFilter: 'blur(5px)',
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            borderRadius: 1,
            transform: 'translate(-50%, -50%)',
            maxWidth: '45rem',
            width: '100%',
            maxHeight: '90vh',
            height: '100%',
            overflow: 'auto',
            bgcolor: 'background.main',
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CloseIcon
              tabIndex={0}
              onClick={onClose}
              onKeyDown={(e) => {
                if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                  onClose();
                }
              }}
              sx={{
                fontSize: '2.25rem',
                color: 'text.contrast',
                cursor: 'pointer',
                transition: '.2s all',
                position: 'absolute',
                right: 0,
                top: 0,
                zIndex: 100,
                borderRadius: 1,
                p: '0.125rem',
                '&:hover': {
                  color: 'primary.main',
                  transform: 'scale(0.9)',
                },
                '&:focus': {
                  color: 'primary.main',
                  transform: 'scale(0.9)',
                },
              }}
            />
          </Box>
          <Box
            sx={{
              position: 'relative',
              maxHeight: '50vh',
              bgcolor: 'background.dark',
            }}
          >
            <Carousel
              showArrows={true}
              showStatus={false}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={false}
              swipeable={true}
              dynamicHeight={true}
              emulateTouch={true}
              useKeyboardArrows={true}
              renderIndicator={(onClickHandler, isSelected, index, label) => {
                const defStyle = {
                  marginLeft: 20,
                  background: '#bee3ff',
                  cursor: 'pointer',
                  padding: '5px',
                  width: '15px',
                  height: '15px',
                  borderRadius: '100%',
                  border: '1px solid #fff',
                };
                const style = isSelected
                  ? { ...defStyle, background: '#45b9ff', width: '20px', height: '20px'}
                  : { ...defStyle };
                return (
                  <div
                    style={style}
                    onClick={onClickHandler}
                    onKeyDown={onClickHandler}
                    value={index}
                    key={index}
                    role="button"
                    tabIndex={0}
                    aria-label={`${label} ${index + 1}`}
                  >
                  </div>
                );
              }}
            >
              {project?.images?.length > 0 ? project?.images?.map((image, index) => (
                <div key={index}>
                  <img
                    src={image.image}
                    alt={project.title}
                    style={{ maxHeight: '50vh', objectFit: 'scale-down' }}
                  />
                </div>
              )) : (
                <div>
                  <img
                    src={Placeholder}
                    alt={project.title}
                    style={{ maxHeight: '50vh', objectFit: 'scale-down' }}
                  />
                </div>
              )}
            </Carousel>
          </Box>
          <Box
            sx={{
              maxHeight: '50vh',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                  {project.title}
                </Typography>
                {project?.owner?.full_name ? (
                  <Typography
                    sx={{ color: 'text.light', fontSize: '.9rem', mt: 1 }}
                  >
                    Autor: <b>{project?.owner?.full_name}</b>
                  </Typography>
                ) : null}
              </Box>
            </Box>
            <Typography
              sx={{
                px: 2,
                mb: 3,
                whiteSpace: 'break-spaces',
                wordBreak: 'break-word',
                flex: 1,
              }}
            >
              {project.description}
            </Typography>

            <Divider sx={{ my: 2, mb: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', px: 2 }}>
                <Typography component="span">Live:</Typography>
                <Typography component="a" href={project.live_version_link}>
                  {project.live_version_link}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', px: 2 }}>
                <Typography component="span">Kod źródłowy:</Typography>
                <Typography component="a" href={project.source_code_link}>
                  {project.source_code_link}
                </Typography>
              </Box>
            </Box>

            {project?.tags?.length > 0 ? (
              <Divider sx={{ mb: 1, mt: 2 }} />
            ) : null}
            <Box sx={{ px: 2, pb: 1 }}>
              {project?.tags?.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  sx={{
                    m: 0.5,
                    border: '1px solid',
                    borderColor: 'primary.dark',
                    borderRadius: '3px',
                    bgcolor: 'transparent',
                    color: 'primary.dark',
                    cursor: 'default',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      color: 'text.contrast',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
