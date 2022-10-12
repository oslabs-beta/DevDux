import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import Album from './Album';

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

root.render(
    <BrowserRouter>
        <Album />
    </BrowserRouter>,
)