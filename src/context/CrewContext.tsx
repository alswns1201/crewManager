"use client";

import React, { createContext, useContext, useState } from "react";

type CrewContextType = {
  selectedCrewId: string;
  setSelectedCrewId: (id: string) => void;
};

const CrewContext = createContext<CrewContextType>({
  selectedCrewId: "crew1",
  setSelectedCrewId: () => {},
});

export const useCrew = () => useContext(CrewContext);

export function CrewProvider({ children }: { children: React.ReactNode }) {
  const [selectedCrewId, setSelectedCrewId] = useState("crew1");

  return (
    <CrewContext.Provider value={{ selectedCrewId, setSelectedCrewId }}>
      {children}
    </CrewContext.Provider>
  );
}
