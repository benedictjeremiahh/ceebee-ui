import { FormIframeDemo } from '../../../../../components/data-entry/form/iframe-demo';

export function generateStaticParams() {
  return ['validate-scroll-to-field'].map((demo) => ({ demo }));
}

export default async function FormDemoPage({ params }: { params: Promise<{ demo: string }> }) {
  return <FormIframeDemo demo={(await params).demo} />;
}
