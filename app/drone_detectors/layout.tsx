import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Детектори дронів',
  description: 'Каталог детекторів дронів для моніторингу та захисту.',
};

export default function DroneDetectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
