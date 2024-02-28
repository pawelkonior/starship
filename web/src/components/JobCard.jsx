import Typography from "@mui/material/Typography";
import ApartmentIcon from '@mui/icons-material/Apartment';
import PlaceIcon from '@mui/icons-material/Place';
import WorkIcon from '@mui/icons-material/Work';
import Container from "@mui/material/Container";
import {Box, Chip} from "@mui/material";

export default function JobCard({
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
                                    position
                                }) {

    const salaryLow = Number(salary_low).toFixed(0)
    const salaryHigh = Number(salary_high).toFixed(0)
    const hasSalary = (salary_low !== undefined && salaryLow !== "0") || (salaryHigh !== undefined && salaryHigh !== "0")

    const dayInMs = 24 * 60 * 60 * 1000
    const isNew = ((new Date().getTime() - new Date(posting_date).getTime()) / dayInMs) < 3
    const subLabelSx = {
        color: "secondary.light", fontWeight: 500, display: "flex", columnGap: "0.5rem", alignItems: "center"
    }
    return (<Container
        sx={{
            bgcolor: 'background.default',
            paddingY: 1,
            marginX: 0,
            boxShadow: 1,
            borderRadius: '3px',
            overflow: 'visible',
            transition: 'all .2s',
            height: '100%',
            position: 'relative',
            '&:hover': {
                boxShadow: 4, cursor: 'pointer', opacity: 0.9,
            },
            display: "flex",
            flexDirection: "column",
            rowGap: 1.5
        }}
    >
        <Box sx={{
            display: "flex", alignItems: "center",
        }}>
            <Typography sx={{fontWeight: 600, fontSize: "1.2rem", color: "secondary.dark"}}>{position}</Typography>
            <Box sx={{display: "flex", alignItems: "center", ml: "auto"}}>
            {hasSalary && (
                <Typography sx={{color: 'info.light', fontWeight: 500,}}>{salaryLow} - {salaryHigh} zł</Typography>
            )}
            {isNew && <Chip label="Nowa" sx={{marginLeft: 2}}/>}
            </Box>
        </Box>
        <Box sx={{display: "flex", columnGap: "2rem"}}>
            <Typography sx={subLabelSx}>
                <ApartmentIcon fontSize="medium"/>
                {company.company_name}
            </Typography>
            <Typography sx={subLabelSx}>
                <PlaceIcon fontSize="medium"/>
                {location}
            </Typography>
            <Typography sx={subLabelSx}>
                <WorkIcon fontSize="medium"/>
                {employment_type}
            </Typography>
        </Box>
    </Container>)
}
