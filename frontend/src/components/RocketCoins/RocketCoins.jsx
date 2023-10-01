import Box from "@mui/material/Box";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import {Typography} from "@mui/material";
import {useCoins} from "../../context/CointContext.jsx";
import {useState} from "react";

function RocketCoins({options, cost = 120}) {
    const {coins, addCoin, removeCoin} = useCoins();
    const [alreadyBought, setAlreadyBought] = useState(false);

    function handleBuy() {

        removeCoin(cost);

    }

    return (
        <Box onClick={handleBuy} sx={{display: "flex", cursor: "pointer"}}>
            <RocketLaunchIcon sx={{color: "gold"}}/>
            <Typography sx={{color: "gold"}}>
                {
                    options === "buy" ? cost : coins
                }
            </Typography>
        </Box>
    );
}

export default RocketCoins;
