import AdminLayout from '@/components/AdminLayout';
import BlogsTable from '@/components/panel/blog/BlogsTable';

export default function BlogPage() {
    return (
        <AdminLayout title="Blog">
            <div className="container mx-auto px-4">
                <BlogsTable key={"blogs_table"}/>
            </div>
        </AdminLayout>
    )
}