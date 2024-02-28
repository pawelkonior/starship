import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Modal,
  Link,
  Divider,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ApartmentIcon from '@mui/icons-material/Apartment.js';
import PlaceIcon from '@mui/icons-material/Place.js';
import WorkIcon from '@mui/icons-material/Work.js';
import CloseIcon from '@mui/icons-material/Close.js';

import LanguageIcon from '@mui/icons-material/Language';
import api_routes from '../data/constants/api_routes.js';
import axiosInstance from '../helpers/axiosInstance.js';

export default function JobOfferDetail() {
  const { data, isLoading } = useJobOfferDetailQuery();
  const [showModal, setShowModal] = useState(false);
  if (isLoading === true) {
    return (
      <Box
        sx={{
          w: '44px',
          h: '44px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const {
    id,
    title,
    description,
    company,
    employment_type,
    location,
    salary_low,
    salary_high,
    posting_date,
    expiration_date,
    experience,
    position,
  } = data;

  const salaryLow = Number(salary_low).toFixed(0);
  const salaryHigh = Number(salary_high).toFixed(0);
  const hasSalary =
    (salary_low !== undefined && salaryLow !== '0') ||
    (salaryHigh !== undefined && salaryHigh !== '0');

  const dayInMs = 24 * 60 * 60 * 1000;
  const isNew =
    (new Date().getTime() - new Date(posting_date).getTime()) / dayInMs < 3;

  const expirationDate = expiration_date.split('T')[0];

  const subLabelSx = {
    color: 'secondary.light',
    fontWeight: 500,
    display: 'flex',
    columnGap: '0.5rem',
    alignItems: 'center',
  };
  const subTitleSx = {
    color: 'secondary.dark',
    fontWeight: 600,
    fontSize: '1.2rem',
    mb: 1,
  };

  return (
    <Container
      sx={{
        py: 2,
        px: 4,
        display: 'flex',
        flexDirection: 'column',
        rowGap: 3,
        bgcolor: 'background.default',
        minHeight: 'inherit',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'primary.light',
        }}
      >
        <Typography
          sx={{ fontWeight: 600, fontSize: '1.5rem', color: 'secondary.dark' }}
        >
          {position}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          {isNew && <Chip label="Nowa" sx={{ marginLeft: 2 }} />}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', columnGap: '2rem', flexWrap: 'wrap' }}>
        <Typography sx={subLabelSx}>
          <ApartmentIcon fontSize="medium" color="primary" />
          {company.company_name}
        </Typography>
        <Typography sx={subLabelSx}>
          <PlaceIcon fontSize="medium" color="success" />
          {location}
        </Typography>
        <Typography sx={subLabelSx}>
          <WorkIcon fontSize="medium" />
          {employment_type}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          {hasSalary && (
            <Typography sx={{ color: 'info.light', fontWeight: 500 }}>
              {salaryLow} - {salaryHigh} zł
            </Typography>
          )}
        </Box>
      </Box>
      <Box>
        <Typography sx={subTitleSx}>Opis</Typography>
        <Divider sx={{ mb: 1 }} />
        <Typography whiteSpace="preserve">{description}</Typography>
      </Box>
      <Box>
        <Typography sx={subTitleSx}>Wymagane doświadczenie</Typography>
        <Divider sx={{ mb: 1 }} />
        <Typography whiteSpace="preserve">{experience}</Typography>
      </Box>
      <Typography sx={subLabelSx}>Oferta wygasa: {expirationDate}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={() => setShowModal((prev) => !prev)}
          variant="contained"
          sx={{
            maxWidth: '400px',
            backgroundColor: 'primary.main',
            color: 'white',
            px: 4,
          }}
        >
          Kontakt
        </Button>
      </Box>
      <ContactModal
        open={showModal}
        onClose={() => setShowModal(false)}
        {...company}
      />
    </Container>
  );
}

function ContactModal({
  open,
  onClose,
  company_name,
  company_address,
  phone_number,
  website,
}) {
  const labelSx = {
    color: 'secondary.light',
  };
  const valueSx = {
    fontWeight: '600',
    color: 'secondary.dark',
    display: 'flex',
    alignItems: 'center',
  };

  const containerSx = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    rowGap: 1,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Grid container sx={containerSx} columns={12}>
        <CloseIcon
          onClick={onClose}
          sx={{ position: 'absolute', top: 4, right: 4, cursor: 'pointer' }}
        />
        <Grid item xs={2}>
          <ApartmentIcon fontSize="medium" sx={labelSx} />
        </Grid>
        <Grid item xs={10} sx={valueSx}>
          {company_name}
        </Grid>
        <Grid item xs={2}>
          <PlaceIcon fontSize="medium" sx={labelSx} />
        </Grid>
        <Grid item xs={10} sx={valueSx}>
          {company_address}
        </Grid>
        <Grid item xs={2}>
          <LocalPhoneIcon fontSize="medium" sx={labelSx} />
        </Grid>
        <Grid item xs={10} sx={valueSx}>
          {phone_number}
        </Grid>

        <Grid item xs={2}>
          <LanguageIcon fontSize="medium" sx={labelSx} />
        </Grid>
        <Grid item xs={10} sx={valueSx}>
          <Link target="_blank" href={website} sx={{ textDecoration: 'none' }}>
            {website}
          </Link>
        </Grid>
      </Grid>
    </Modal>
  );
}

function useJobOfferDetailQuery() {
  const { offerId } = useParams();

  return useQuery({
    queryKey: [axiosInstance, api_routes.jobs.detail(offerId)],
    queryFn: async ({ queryKey: [axios, url] }) => {
      const response = await axios.get(url);
      return response.data;
    },
  });
}
