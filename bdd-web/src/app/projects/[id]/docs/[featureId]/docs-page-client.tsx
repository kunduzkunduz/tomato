'use client';

import { useEffect } from 'react';
import { DocsViewer } from '@/components/DocsViewer';
import { useProjectStore } from '@/store/projectStore';

export default function DocsPageClient({ projectId, featureId }: { projectId: string; featureId: string }) {
  const { setActiveProject } = useProjectStore();

  useEffect(() => {
    setActiveProject(projectId);
  }, [projectId, setActiveProject]);

  return <DocsViewer projectId={projectId} featureId={featureId} />;
}


