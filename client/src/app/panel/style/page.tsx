import AdminLayout from '@/components/AdminLayout';
import StylesTable from '@/components/panel/style/StyleTable'

export default function BlogPage() {
    return (
        <AdminLayout title="Style">
            <div className="container mx-auto px-4">
                <StylesTable />
            </div>
        </AdminLayout>
    )
}