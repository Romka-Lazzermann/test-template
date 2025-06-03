import AdminLayout from '@/components/AdminLayout';
import styles from './index.module.css'

export default function Dashboard() {
    return (
        <AdminLayout title="Dashboard">
            <div className={styles.nav_container}>
                <div className="row">
                    <div className="col nav-item">
                        <a href="/panel/category" className={styles.nav_link}>
                            <div className="fa-icon">
                                <i  style={{fontSize: "26px"}} className="bi bi-folder-fill"></i>
                                </div>
                            Category
                        </a>
                    </div>
                    <div className="col nav-item">
                        <a href="/panel/blog" className={styles.nav_link}>
                            <div className="fa-icon">
                                <i style={{fontSize: "26px"}} className="bi bi-newspaper"></i>
                            </div>
                            Blog
                        </a>
                    </div>
                    <div className="col nav-item">
                        <a href="/panel/channel" className={styles.nav_link}>
                            <div className="fa-icon">
                                <i style={{fontSize: "26px"}} className="bi bi-rss"></i>
                            
                            </div>
                            Channel
                        </a>
                    </div>
                    <div className="col nav-item">
                        <a href="/panel/style" className={styles.nav_link}>
                            <div className="fa-icon">
                                <i style={{fontSize: "26px"}} className="bi bi-brush-fill"></i>
                            </div>
                            Style
                        </a>
                    </div>

                </div>
            </div>
        </AdminLayout>
    )
}
