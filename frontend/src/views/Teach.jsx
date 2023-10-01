import Box from "@mui/material/Box";
import {IconButton, TextField, Typography} from "@mui/material";
import CloseIcon from "../components/Overlay/CloseIcon.jsx";
import Button from "@mui/material/Button";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import useAxios from "../hooks/useAxios.js";
import './Teach.css'

function AddIcon() {
    return null;
}

export default function Teach() {
    const axios = useAxios();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        programme_points: [],
        tags: []
    });

    const handleAddProgrammePoint = () => {
        setFormData(prevData => ({
            ...prevData,
            programme_points: [...prevData.programme_points, {name: '', description: ''}]
        }));
    };

    const handleAddTag = () => {
        setFormData(prevData => ({
            ...prevData,
            tags: [...prevData.tags, {name: ''}]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("/api/v1/courses/", formData)
            .then(response => {
                console.log(response.data.id);
                navigate('/videoroom/');
            })
            .catch(error => {
                console.error("Wystąpił błąd podczas wysyłania formularza:", error);
            });
    };


    return (
        <form
            style={{
                borderRadius: '20px',
                margin: '5% auto',
                maxWidth: '600px',
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "linear-gradient(180deg, rgba(217, 217, 217, 0.25) 0%, rgba(217, 217, 217, 0.05) 100%)",
                boxShadow: "0px 4px 16px -1px rgba(0, 0, 0, 0.25)",
                backdropFilter: "blur(10px)",
                padding: "20px 40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: '20px',
                color: 'white'
            }}
            onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Name"
                variant="standard"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="white-border-bottom"
            />

            <TextField
                fullWidth
                label="Description"
                variant="standard"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="white-border-bottom"
            />

            <Typography variant="h6" style={{color: "white"}}>Programme Points</Typography>

            {formData.programme_points.map((point, index) => (
                <Box key={index} width="100%" mb={2} display="flex" alignItems="center" gap="10px">
                    <TextField
                        fullWidth
                        label="Name"
                        variant="standard"
                        value={point.name}
                        onChange={(e) => {
                            const newPoints = [...formData.programme_points];
                            newPoints[index].name = e.target.value;
                            setFormData({...formData, programme_points: newPoints});
                        }}
                        className="white-border-bottom"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        variant="standard"
                        value={point.description}
                        onChange={(e) => {
                            const newPoints = [...formData.programme_points];
                            newPoints[index].description = e.target.value;
                            setFormData({...formData, programme_points: newPoints});
                        }}
                        className="white-border-bottom"
                    />
                    <IconButton onClick={() => {
                        const newPoints = [...formData.programme_points];
                        newPoints.splice(index, 1);
                        setFormData({...formData, programme_points: newPoints});
                    }}>
                        <CloseIcon/>
                    </IconButton>
                </Box>
            ))}
            <Button startIcon={<AddIcon/>} variant="contained" color="primary" style={{width: '300px'}} onClick={handleAddProgrammePoint}>Add
                Programme Point</Button>

            <Typography variant="h6" mt={3} style={{color: "white"}}>Tagi</Typography>

            {formData.tags.map((tag, index) => (
                <Box key={index} width="100%" mb={2} display="flex" alignItems="center" gap="10px">
                    <TextField
                        fullWidth
                        label="Name"
                        variant="standard"
                        value={tag.name}
                        onChange={(e) => {
                            const newTags = [...formData.tags];
                            newTags[index].name = e.target.value;
                            setFormData({...formData, tags: newTags});
                        }}
                        className="white-border-bottom"
                    />
                    <IconButton onClick={() => {
                        const newTags = [...formData.tags];
                        newTags.splice(index, 1);
                        setFormData({...formData, tags: newTags});
                    }}>
                        <CloseIcon/>
                    </IconButton>
                </Box>
            ))}
            <Button startIcon={<AddIcon/>} variant="contained" color="primary" style={{color: "white", width: '300px'}} onClick={handleAddTag}>Dodaj Tag</Button>

            <Box mt={3}>
                <Button type="submit" variant="contained" color="primary" style={{width: '300px'}}>Dodaj kurs</Button>
            </Box>
        </form>
    );
}


