import { PopconfirmIframeDemo } from '../../../../../components/feedback/popconfirm/iframe-demo';

export function generateStaticParams() {
  return ['shift'].map((demo) => ({ demo }));
}

export default async function PopconfirmDemoPage({ params }: { params: Promise<{ demo: string }> }) {
  return <PopconfirmIframeDemo demo={(await params).demo} />;
}
