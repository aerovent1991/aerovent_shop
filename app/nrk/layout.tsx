import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'НРК',
  description: 'Наземні роботизовані комплекси. Розділ в розробці.',
};

export default function NrkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
