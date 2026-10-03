import React from 'react';
import {createRoot} from 'react-dom/client';
import Game from './app/game.jsx';
import './app/globals.css';
import './app/tour.css';
import './app/tabletop.css';
createRoot(document.getElementById('root')).render(<Game/>);
