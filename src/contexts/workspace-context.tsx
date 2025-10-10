'use client';

import type { ReactNode } from 'react';

import { useState, useContext, createContext, useEffect } from 'react';

import type { Project } from 'src/lib/orval/generated/model';

// ----------------------------------------------------------------------

export type WorkspaceData = {
  id: string;
  name: string;
  logo: string;
};

type WorkspaceContextValue = {
  selectedOrganization: WorkspaceData | null;
  setSelectedOrganization: (organization: WorkspaceData | null) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
};

// ----------------------------------------------------------------------

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

// ----------------------------------------------------------------------

type WorkspaceProviderProps = {
  children: ReactNode;
};

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [selectedOrganization, setSelectedOrganization] = useState<WorkspaceData | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    console.log('WorkspaceProvider - selectedOrganization changed:', selectedOrganization);
  }, [selectedOrganization]);

  useEffect(() => {
    console.log('WorkspaceProvider - selectedProject changed:', selectedProject);
  }, [selectedProject]);

  return (
    <WorkspaceContext.Provider
      value={{
        selectedOrganization,
        setSelectedOrganization,
        selectedProject,
        setSelectedProject,
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
