
import UnloadTracker from '@/components/articles/UnloadTracker';
import { cookies } from 'next/headers';


export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const impression_id = cookieStore.get('impression_id')?.value || ''
    return (
        <>
            <UnloadTracker impression_id={impression_id} />
            {children}
        </>


    );
}
