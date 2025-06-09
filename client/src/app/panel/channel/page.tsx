import AdminLayout from '@/components/AdminLayout';
import ChannelTable from '@/components/panel/channel/ChannelTable';

export default function ChannelPage() {
    return (
        <AdminLayout title="Channel">
            <div className="container mx-auto px-4">
                <ChannelTable />
            </div>
        </AdminLayout>
    )
}