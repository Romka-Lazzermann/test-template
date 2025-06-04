import AdminLayout from '@/components/AdminLayout';
import styles from './index.module.css'
import BlogsTable from '@/components/panel/blog/BlogsTable';
export default function BlogPage() {
    return (
        <AdminLayout title="Blog">
            <div className={`container`}>
                <BlogsTable key={"blogs_table"}/>
            </div>
        </AdminLayout>
    )
}
