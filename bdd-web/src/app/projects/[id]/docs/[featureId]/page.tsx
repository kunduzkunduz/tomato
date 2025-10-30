import DocsPageClient from './docs-page-client';

export default async function DocsPage({ params }: { params: Promise<{ id: string; featureId: string }> }) {
  const { id: projectId, featureId } = await params;
  return <DocsPageClient projectId={projectId} featureId={featureId} />;
}

export async function generateStaticParams() {
  return [] as Array<{ id: string; featureId: string }>;
}
