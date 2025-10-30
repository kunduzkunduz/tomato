import { redirect } from 'next/navigation';

export default async function NewRunPage({ params }: { params: Promise<{ id: string; featureId: string }> }) {
  const { id, featureId } = await params;
  const runId = `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  redirect(`/projects/${id}/run/${runId}?new=true&featureId=${featureId}`);
}

// Allow Next.js static export by providing an empty param list
export async function generateStaticParams() {
  return [] as Array<{ id: string; featureId: string }>;
}

