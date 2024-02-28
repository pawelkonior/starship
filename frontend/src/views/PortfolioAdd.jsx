import { Edit } from "@mui/icons-material"
import { useId, useState } from "react"
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from "react-router-dom"
import usePortfolio from "../hooks/usePortfolio";

const tagOptions = [
    "tailwind",
    "react",
    "vue",
    "typescript",
    "javascript",
    "python",
    "django",
    "fastAPI",
]

export default function PortfolioAdd() {
    const imageId = useId()
    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [productionLink, setProuctionLink] = useState([]);
    const { addItem } = usePortfolio();
    const navigate = useNavigate();

    function onSubmit() {
        addItem({ images: [image], title, description, tags });
        navigate("/portfolio/");
    }

    return (
        <div className="flex items-center justify-center h-full">
            <form className="max-w-[900px] min-w-[100%] rounded-2xl bg-[#acacac]/[0.2] backdrop-blur-lg p-4 md:p-8 flex flex-col shadow-[0px_4px_16px_-1px_] gap-y-4 mt-5" onSubmit={onSubmit}>
                <label htmlFor={imageId} className="w-[200px] h-[200px] cursor-pointer text-white mx-auto">
                    {
                        image === "" ? (
                            <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded-lg backdrop-blur-lg">
                                <Edit color="white" />
                            </div>
                        ) : (
                            <div className="relative w-full h-full rounded-lg hover:scale-[101%] transition ease-in-out group">
                                <img src={image} alt="project preview" className="object-cover w-full h-full rounded-lg group-hover:blur-[2px]" />
                                <Edit sx={{ fill: "#C1C1C1" }} className="absolute invisible ease-in-out -translate-x-1/2 -translate-y-1/2 group-hover:visible top-1/2 left-1/2 transtion" />
                            </div>
                        )
                    }
                    <input type="file" id={imageId} className="hidden" onChange={e => setImage(URL.createObjectURL(e.target.files[0]))} />
                </label>
                <Input label="Nazwa projektu" value={title} setValue={setTitle} />
                <Input label="Opis projektu" value={description} setValue={setDescription} />
                <Input label="Link do demo" value={productionLink} setValue={setProuctionLink} />
                <Button variant="contained" type="submit">Dodaj</Button>
            </form>
        </div>
    )
}

function Input({ label, value, setValue }) {
    const id = useId();

    return <label className="flex flex-col text-white" htmlFor={id}>
        <span className="text-xs">{label}</span>
        <input type="text" value={value} onChange={e => setValue(e.target.value)} id={id} className="bg-transparent border-b border-white focus:outline-none" />
    </label>
}


function Card({ image, title, description, tags }) {
    return (
        <div className="flex flex-col w-[200px] md:w-[320px] h-[400px] gap-y-2 bg-[#011f26] rounded-lg text-white hover:scale-[102%] transition ease-in-out">
            <img alt="preview" src={image} className="rounded-t-lg max-h-[200px] object-cover" />
            <div className="flex flex-col px-3 py-2 gap-y-2 grow">
                <h4 className="text-lg font-semibold">{title}</h4>
                <p>{description}</p>
                <div className="justify-center hidden pb-2 mt-auto overflow-wrap gap-x-2 md:flex">
                    {tags.map(text => <Tag key={text} text={text} />)}
                </div>
            </div>
        </div>
    )
}

export function Multiselect({ values, options, setValues }) {

    const handleChange = (e) => {
        setValues(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="tags-label">Tag</InputLabel>
                <Select
                    labelId="tags-label"
                    id="tags"
                    multiple
                    value={values}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(', ')}
                    className="text-white border-none"
                    variant="standard"
                    sx={{
                        ".MuiOutlinedInput-notchedOutline": { border: 0 },
                        "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { border: 0 },
                        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { border: 0 }
                    }}
                >
                    {options.map((label) => (
                        <MenuItem key={label} value={label}>
                            <Checkbox checked={values.indexOf(label) > -1} />
                            <ListItemText primary={label} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
