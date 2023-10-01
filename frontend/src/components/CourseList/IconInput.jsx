import {FilledInput, FormControl, InputAdornment} from "@mui/material";
import {Search} from "@mui/icons-material";

export function IconInput(props) {
    return <FormControl variant="standard" style={{width: "100%"}}>

        <FilledInput
            disableUnderline={true}
            hiddenLabel={true}
            id="input-with-icon-adornment"
                    position="start"
            value={props.value}
            onChange={props.onChange}
            sx={{ color: "white", height: 42, lineHeight: "1.5", borderRadius: "0", background: "rgba(255, 255, 255, 0.09)", border: "0", boxShadow: "0px 4px 16px -1px rgba(0, 0, 0, 0.25)", padding: "4px 20px", borderRadius: 2}}
            startAdornment={
                <InputAdornment position="start">
                    <Search
                        sx={{color: "white"}}
                    />
                </InputAdornment>
            }
        />
    </FormControl>;
}