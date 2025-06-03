import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

export default function AdminLayout({ title, children }: Props) {
  return (
    <>
      <Head>
        <title>{title} - Admin Panel</title>
      </Head>
      <div className="container-fluid">
        <div className="row">
          <main className="ms-sm-auto py-4">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}