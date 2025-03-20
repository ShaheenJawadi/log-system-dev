import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReactNode } from 'react';
 

const MapContext = createContext<{}>({});

export const useMapUtils = () => useContext(MapContext);


export const MapUtilsProvider = ({ children }: { children: ReactNode }) => { 
 
  return (
    <MapContext.Provider value={{}}>
      {children}
    </MapContext.Provider>
  );
};
