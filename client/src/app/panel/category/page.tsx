import AdminLayout from '@/components/AdminLayout';
import CategoryTable from '@/components/panel/category/CategoryTable';

export default function CategoryPage() {
    return (
        <AdminLayout title="Category">
            <div className="container mx-auto px-4">
                <CategoryTable />
            </div>
        </AdminLayout>
    )
}