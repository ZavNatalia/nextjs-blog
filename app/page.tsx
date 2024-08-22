
import Link from 'next/link';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { ArrowRightIcon } from '@heroicons/react/16/solid';
import Hero from '@/app/ui/hero-card';

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24  w-full">
         <Hero/>
      </main>
  );
}
