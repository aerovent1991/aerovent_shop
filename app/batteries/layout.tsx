import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Акумулятори',
  description: 'Каталог акумуляторів для БПЛА та суміжних систем.',
};

export default function BatteriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
