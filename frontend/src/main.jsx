import React from 'react'
import ReactDOM from 'react-dom/client'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './index.css'

import {RouterProvider} from "react-router-dom";
import {router} from "./router.jsx";
import {CoinProvider} from "./context/CointContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CoinProvider>
            <RouterProvider router={router}/>
        </CoinProvider>
    </React.StrictMode>
)
