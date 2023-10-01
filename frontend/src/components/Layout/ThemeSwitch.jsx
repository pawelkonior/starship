import {FormControlLabel, FormGroup, Switch} from "@mui/material";

function ThemeSwitch({isDarkTheme, setIsDarkTheme}) {

    const changeTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    return (
        <FormGroup>
            <FormControlLabel
                control={
                    <Switch checked={isDarkTheme} onChange={changeTheme}/>
                }
                label="Dark Theme"
            />
        </FormGroup>
    );
}

export default ThemeSwitch;