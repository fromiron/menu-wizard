import dynamic from 'next/dynamic';

const Builder = dynamic(() => import('./builder'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function TestPage() {
  return <Builder />;
}
