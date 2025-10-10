'use client';

import type { ReactNode } from 'react';

import { useState, useContext, createContext, useEffect } from 'react';

// ----------------------------------------------------------------------

export type WorkspaceData = {
  id: string;
  name: string;
  logo: string;
};

type WorkspaceContextValue = {
  selectedOrganization: WorkspaceData | null;
  setSelectedOrganization: (organization: WorkspaceData | null) => void;
};

// ----------------------------------------------------------------------

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

// ----------------------------------------------------------------------

type WorkspaceProviderProps = {
  children: ReactNode;
};

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [selectedOrganization, setSelectedOrganization] = useState<WorkspaceData | null>(null);

  useEffect(() => {
    console.log('WorkspaceProvider - selectedOrganization changed:', selectedOrganization);
  }, [selectedOrganization]);

  return (
    <WorkspaceContext.Provider
      value={{
        selectedOrganization,
        setSelectedOrganization,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

// ----------------------------------------------------------------------

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }

  return context;
}
