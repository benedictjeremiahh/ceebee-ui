import { AlertIframeDemo } from '../../../../../components/feedback/alert/iframe-demo';

export function generateStaticParams() {
  return ['banner'].map((demo) => ({ demo }));
}

export default async function AlertDemoPage({ params }: { params: Promise<{ demo: string }> }) {
  return <AlertIframeDemo demo={(await params).demo} />;
}
