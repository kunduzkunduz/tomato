import ReportPageClient from './report-page-client';

export default async function ReportPage({ params }: { params: Promise<{ id: string; featureId: string }> }) {
  const { id, featureId } = await params;
  return <ReportPageClient projectId={id} featureId={featureId} />;
}

export async function generateStaticParams() {
  return [] as Array<{ id: string; featureId: string }>;
}
