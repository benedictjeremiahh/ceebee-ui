import { AnchorIframeDemo } from '../../../../../components/navigation/anchor/iframe-demo';

export function generateStaticParams() {
  return ['basic', 'horizontal', 'targetOffset', 'replace', 'style-class'].map((demo) => ({ demo }));
}

export default async function AnchorDemoPage({ params }: { params: Promise<{ demo: string }> }) {
  return <AnchorIframeDemo demo={(await params).demo} />;
}
