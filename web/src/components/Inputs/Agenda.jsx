import { Button, TextField, Grid, Box } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const Agenda = ({ items, setItems }) => {
  const handleAddItem = () => {
    setItems([...items, '']);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleChangeItem = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    setItems(updatedItems);
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <label
        htmlFor="agenda"
        style={{ alignSelf: 'flex-start', marginBottom: '.5rem' }}
      >
        Agenda:
      </label>
      {items.map((item, index) => (
        <Grid container spacing={1} key={index} alignItems="center">
          <Grid item xs={1}>
            <Typography>{index + 1}.</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              fullWidth
              value={item}
              onChange={(e) => handleChangeItem(index, e.target.value)}
              placeholder={`Agenda pkt ${index + 1}`}
              size="small"
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => handleDeleteItem(index)}>
              <DeleteOutlineIcon color={'error'} />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button
        onClick={handleAddItem}
        sx={{ width: 'fit-content', mt: 1 }}
        color="success"
        variant="outlined"
      >
        Dodaj
      </Button>
    </Box>
  );
};

export default Agenda;
