'use client'

import dynamic from 'next/dynamic';

const Timer = dynamic(() => import('./components/Timer'), { ssr: false });

export default function Home() {
  return (
    <><Timer /></>
  );
}
