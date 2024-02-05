import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/app';

// eslint-disable-next-line no-undef
const root = document.getElementById('root');
const rootContainer = createRoot(root);

rootContainer.render(<App />);
