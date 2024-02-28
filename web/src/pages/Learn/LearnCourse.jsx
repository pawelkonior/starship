import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Fade,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItemButton,
  Modal,
  Rating,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import StarCoin from 'components/Currency/StarCoin.jsx';
import VerifiedIcon from '@mui/icons-material/Verified';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import Placeholder from 'assets/placeholder.jpg';
import dayjs from 'dayjs';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import API from 'data/constants/api_routes.js';
import { deleteData, postData } from 'helpers/api.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import 'add-to-calendar-button';
import { useAuth } from 'hooks/useAuth.js';
import { Link } from "react-router-dom";

const LearnCourse = ({ course, mode, searchValue, sortBy }) => {
  const [showDetail, setShowDetail] = useState(false);
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  const borderColor = () => {
    if (mode === 'mine') {
      return 'primary.main';
    } else if (mode === 'attend') {
      return '#94dc92';
    } else {
      return 'transparent';
    }
  };

  const enrollCourseMutation = useMutation({
    mutationKey: ['course', course.id],
    mutationFn: postData(API.courses.enrollments(course.id)),
  });

  const cancelCourseMutation = useMutation({
    mutationKey: ['course', course.id],
    mutationFn: deleteData(API.courses.enrollments(course.id)),
  });

  const enrollHandler = async () => {
    if (mode === 'attend') {
      try {
        const res = await cancelCourseMutation.mutateAsync();
        await queryClient.invalidateQueries(['courses', searchValue, sortBy]);
        setShowDetail(false);
        toast.success('Zrezygnowano z udziału w kursie');
        await updateUser({ force: true });
        return res;
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            'Wystąpił błąd przy rezygnowaniu z kursu',
        );
      }
      return;
    }
    try {
      const res = await enrollCourseMutation.mutateAsync();
      await queryClient.invalidateQueries(['courses', searchValue, sortBy]);
      setShowDetail(false);
      toast.success('Zapisano na kurs');
      await updateUser({ force: true });
      return res;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Wystąpił błąd przy zapisie na kurs',
      );
    }
  };

  const deleteCourseMutation = useMutation({
    mutationKey: ['course', course.id],
    mutationFn: deleteData(API.courses.course(course.id)),
  });

  const deleteCourseHandler = async () => {
    try {
      const res = await deleteCourseMutation.mutateAsync();
      await queryClient.invalidateQueries(['courses', searchValue]);
      setShowDetail(false);
      toast.success('Anulowano wydarzenie');
      return res;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Wystąpił błąd przy usuwaniu kursu',
      );
    }
  };

  const endCourseTime = dayjs(course?.course_date).add(
    course?.duration,
    'minute',
  );
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Box
        onClick={() => setShowDetail(true)}
        sx={{
          bgcolor: 'background.default',
          border: '2px solid',
          borderColor: borderColor(mode),
          boxShadow: 1,
          borderRadius: '3px',
          overflow: 'visible',
          transition: 'all .2s',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          position: 'relative',
          '&:hover': {
            boxShadow: 4,
            cursor: 'pointer',
            opacity: 0.9,
          },
        }}
      >
        <Box>
          <img
            src={course.image ?? Placeholder}
            alt={course.title}
            style={{ width: '100%', maxHeight: '15rem', objectFit: 'cover' }}
          />
          {mode === 'attend' ? (
            <Chip
              label={
                <Box
                  sx={{ display: 'flex', gap: '.2rem', alignItems: 'center' }}
                >
                  <VerifiedIcon
                    sx={{ color: 'success.light', fontSize: '1.4rem' }}
                  />
                  <Typography
                    sx={{
                      color: 'success.dark',
                      fontWeight: 500,
                      pr: 0.5,
                      fontSize: '.9rem',
                    }}
                  >
                    Biorę udział
                  </Typography>
                </Box>
              }
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 50,
                opacity: 0.9,
                bgcolor: '#f7ffef',
                alignItems: 'center',
                overflow: 'auto',
                border: '2px solid',
                borderColor: '#94dc92',
                borderRadius: '0 0 5px 0',
                borderTop: 'none',
                borderLeft: 'none',
                px: 0,
                '& .MuiChip-label': { px: 0.5, py: 0, display: 'flex' },
              }}
            />
          ) : null}

          {mode === 'mine' ? (
            <Chip
              label={
                <Box
                  sx={{ display: 'flex', gap: '.2rem', alignItems: 'center' }}
                >
                  <CoPresentIcon
                    sx={{ color: 'info.light', fontSize: '1.2rem' }}
                  />
                  <Typography
                    sx={{
                      color: 'info.dark',
                      fontWeight: 500,
                      pr: 0.5,
                      fontSize: '.9rem',
                    }}
                  >
                    Jestem twórcą
                  </Typography>
                </Box>
              }
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 50,
                opacity: 0.9,
                bgcolor: '#effcff',
                alignItems: 'center',
                overflow: 'auto',
                border: '2px solid',
                borderColor: '#39b3ea',
                borderRadius: '0 0 5px 0',
                borderTop: 'none',
                borderLeft: 'none',
                px: 0,
                '& .MuiChip-label': { px: 0.5, py: 0, display: 'flex' },
              }}
            />
          ) : null}
          <Typography
            sx={{
              textAlign: 'center',
              m: 0,
              fontSize: '.8rem',
              bgcolor: 'background.default',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              justifyContent: 'center',
            }}
          >
            <Typography
              component="span"
              sx={{ color: 'primary.dark', fontWeight: 700, fontSize: '.8rem' }}
            >
              {dayjs().to(course?.course_date)}
            </Typography>
            <TodayOutlinedIcon
              sx={{ fontSize: '1rem', color: 'primary.dark' }}
            />
          </Typography>
          <Divider />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ p: 1, fontWeight: 600 }}>{course.title}</Typography>
          <StatsSection
            points={course.price}
            time={course.duration}
            level={course.level}
          />
        </Box>
      </Box>

      <Modal
        open={showDetail}
        onClose={() => setShowDetail(false)}
        sx={{
          '.MuiBackdrop-root': {
            backdropFilter: 'blur(5px)',
          },
        }}
      >
        <Fade in={showDetail}>
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
              height: 'fit-content',
              overflow: 'hidden',
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
                onClick={() => setShowDetail(false)}
                onKeyDown={(e) => {
                  if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                    setShowDetail(false);
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
              component="img"
              src={course?.image ?? Placeholder}
              alt={course.title}
              sx={{
                height: '40vh',
                objectFit: 'cover',
                position: 'relative',
              }}
            />
            <Box sx={{ position: 'absolute', left: 0, top: 0 }}>
              <add-to-calendar-button
                name={course.title}
                label={'Dodaj do kalendarza'}
                options="'MicrosoftTeams','Google'"
                location="World Wide Web"
                startDate={dayjs(course?.course_date).format('YYYY-MM-DD')}
                endDate={dayjs(course?.course_date).format('YYYY-MM-DD')}
                startTime={dayjs(course?.course_date).format('HH:mm')}
                endTime={endCourseTime.format('HH:mm')}
                timeZone="Europe/Warsaw"
              ></add-to-calendar-button>
            </Box>
            <Box
              sx={{
                bgcolor: 'background.default',
                display: 'flex',
                justifyContent: 'space-between',
                px: 2,
                py: 1,
              }}
            >
              <Typography sx={{ textAlign: 'center', m: 0 }}>
                Data rozpoczęcia:{' '}
                <Typography
                  component="span"
                  sx={{
                    color: 'primary.dark',
                    fontWeight: 700,
                  }}
                >
                  {dayjs(course?.course_date).format('DD.MM.YYYY HH:mm')}
                </Typography>
              </Typography>
              <Typography
                sx={{
                  textAlign: 'center',
                  m: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  component="span"
                  sx={{ color: 'primary.dark', fontWeight: 700 }}
                >
                  {dayjs().to(course?.course_date)}
                </Typography>
                <TodayOutlinedIcon
                  sx={{ fontSize: '1.3rem', color: 'primary.dark' }}
                />
              </Typography>
            </Box>

            <Divider />
            <Box
              sx={{
                maxHeight: '35vh',
                overflow: 'auto',
                pb: 1,
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
                    {course.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Rating name="read-only" value={4} readOnly />
                    <Typography sx={{ color: 'text.light', fontSize: '.9rem' }}>
                      <b>4.0</b> (15 ocen)
                    </Typography>
                  </Box>
                  {course?.owner?.full_name ? (
                    <Typography
                      sx={{ color: 'text.light', fontSize: '.9rem', mt: 1 }}
                    >
                      Autor: <b>{course?.owner?.full_name}</b>
                    </Typography>
                  ) : null}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <StatsSection
                    points={course.price}
                    time={course.duration}
                    level={course.level}
                  />
                  {course?.students_count > 0 ? (
                    <Chip
                      label={
                        <Typography sx={{ fontSize: '.8rem' }}>
                          Liczba uczestników: <b>{course?.students_count}</b>
                        </Typography>
                      }
                      color="secondary"
                      variant="outlined"
                      sx={{ opacity: 0.6 }}
                    />
                  ) : null}
                </Box>
              </Box>
              {course?.link &&( mode === 'attend' || mode === 'mine') ? (
                <Typography
                  sx={{
                    px: 2,
                    py: 1,
                    mb: 1,
                    borderTop: '1px solid',
                    bgcolor: '#f3fbff',
                    borderBottom: '1px solid',
                    borderColor: 'primary.light',
                  }}
                >
                  Link do spotkania: <Link to={course.link}>{course.link}</Link>
                </Typography>
              ) : null}
              <Typography
                sx={{
                  px: 2,
                  mb: 3,
                  whiteSpace: 'break-spaces',
                }}
              >
                {course.description}
              </Typography>
              <Typography
                variant={'button'}
                sx={{
                  px: 2,
                  mb: 3,
                }}
              >
                Agenda
              </Typography>
              <List>
                {course.agenda.includes('[') &&
                JSON.parse(course.agenda).length > 0 ? (
                  JSON.parse(course.agenda).map((item) => (
                    <ListItemButton key={item} sx={{ cursor: 'auto' }}>
                      {item}
                    </ListItemButton>
                  ))
                ) : (
                  <ListItemButton sx={{ cursor: 'auto' }}>
                    {course.agenda}
                  </ListItemButton>
                )}
              </List>
              <FormGroup sx={{ px: 2 }}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Wyślij maila z przypomnieniem"
                />
              </FormGroup>
              {course?.tags?.length > 0 ? (
                <Divider sx={{ mb: 1, mt: 2 }} />
              ) : null}
              <Box sx={{ px: 2 }}>
                {course?.tags?.map((tag, index) => (
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
            {mode === 'mine' ? (
              <Button
                variant="contained"
                sx={{
                  color: 'text.contrast',
                  borderRadius: '0 0 3px 3px',
                  py: 1.5,
                }}
                color="info"
                onClick={deleteCourseHandler}
              >
                Anuluj wydarzenie
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  color: 'text.contrast',
                  borderRadius: '0 0 3px 3px',
                  py: 1.5,
                }}
                color={mode === 'attend' ? 'error' : 'primary'}
                onClick={enrollHandler}
              >
                {mode === 'attend' ? 'Zrezygnuj z udziału' : 'Weź udział'}
              </Button>
            )}
          </Box>
        </Fade>
      </Modal>
    </Grid>
  );
};

export default LearnCourse;

const StatsSection = ({ points, time, level }) => {
  const levelColors = {
    Beginner: 'success',
    Intermediate: 'info',
    Advanced: 'warning',
    Expert: 'error',
  };

  const levelNames = {
    Beginner: 'Początkujący',
    Intermediate: 'Średniozaawansowany',
    Advanced: 'Zaawansowany',
    Expert: 'Ekspert',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <StarCoin value={points} />
        <Chip
          label={`${time} minut`}
          sx={{
            m: 1,
            fontWeight: 700,
            border: '1px solid',
            borderColor: 'primary.light',
            borderRadius: '5rem',
            bgcolor: 'transparent',
          }}
        />
      </Box>
      {level ? (
        <Chip
          label={levelNames[level]}
          variant={'outlined'}
          color={levelColors[level]}
          sx={{
            fontWeight: 600,
            borderWidth: 2,
            letterSpacing: 1,
            width: 'fit-content',
            mb: 1,
            borderRadius: '5rem',
          }}
        />
      ) : null}
    </Box>
  );
};
