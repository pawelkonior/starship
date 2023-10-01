import { useId, useState } from 'react';
import axios from "axios";
import Button from '@mui/material/Button';
import Box from "@mui/material/Box"
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router';


export default function Login() {
    const [login, setLogin] = useState("programuj_z_pasja");
    const [pass, setPass] = useState("redbull12");
    const { setToken } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault()
        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/v1/token/", { username: login, password: pass })
            setToken(response.data.access)
        } finally {
            setIsSubmitting(false)
            navigate("/")
        }
    }

    return (
        <Box className="flex items-center justify-center w-full h-full">
            <form
                onSubmit={handleSubmit}
                style={{ marginTop: 64 }}
                className="max-w-[650px] rounded-2xl bg-[#acacac]/[0.2] backdrop-blur-lg px-4 py-3 md:px-10 md:py-8 flex flex-col gap-y-6 shadow-[0px_4px_16px_-1px_] grow mx-4"
            >
                <h2 className="text-3xl text-white">Logowanie</h2>
                <Input value={login} setValue={setLogin} label="Email" placeholder="Email" />
                <Input value={pass} setValue={setPass} label="Hasło" placeholder="Hasło" type='password' />
                <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                >Zaloguj</Button>
            </form>
        </Box>
    )
}

function Input({ value, setValue, placeholder, label, type = 'text' }) {
    const id = useId()

    return (
        <label htmlFor={id} className="flex flex-col py-3 text-white bg-transparent">
            <span className="text-xs text-white">{label}</span>
            <input id={id} type={type} value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder}
                className="text-white bg-transparent border-b border-white focus:outline-none placeholder:text-gray-300"
            />
        </label>
    )
}
