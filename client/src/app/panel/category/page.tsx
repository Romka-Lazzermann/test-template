import AdminLayout from '@/components/AdminLayout';
import CategoryTable from '@/components/panel/category/CategoryTable';
export default function BlogPage() {
    return (
        <AdminLayout title="Category">
            <div className={`container`}>
                <CategoryTable />
            </div>
        </AdminLayout>
    )
}
