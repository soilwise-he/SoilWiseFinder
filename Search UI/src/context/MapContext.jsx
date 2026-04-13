'use client';

import React, { useContext } from 'react';

const MapContext = new React.createContext();

export default MapContext;

export const useMap = () => useContext(MapContext);
