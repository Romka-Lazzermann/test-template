import AdminLayout from '@/components/AdminLayout';
import ChannelTable from '@/components/panel/channel/ChannelTable';
export default function BlogPage() {
    return (
        <AdminLayout title="Channel">
            <div className={`container`}>
                <ChannelTable />
            </div>
        </AdminLayout>
    )
}
