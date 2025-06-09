import AdminLayout from '@/components/AdminLayout';

export default function Dashboard() {
    return (
        <AdminLayout title="Dashboard">
            <div className="flex justify-center items-center py-5">
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="flex-shrink-0 w-30 h-28">
                        <a href="/panel/category" className="flex flex-col items-center justify-center w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold no-underline transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                            <div className="text-2xl">
                                <i className="bi bi-folder-fill"></i>
                            </div>
                            Category
                        </a>
                    </div>
                    <div className="flex-shrink-0 w-30 h-28">
                        <a href="/panel/blog" className="flex flex-col items-center justify-center w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold no-underline transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                            <div className="text-2xl">
                                <i className="bi bi-newspaper"></i>
                            </div>
                            Blog
                        </a>
                    </div>
                    <div className="flex-shrink-0 w-30 h-28">
                        <a href="/panel/channel" className="flex flex-col items-center justify-center w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold no-underline transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                            <div className="text-2xl">
                                <i className="bi bi-rss"></i>
                            </div>
                            Channel
                        </a>
                    </div>
                    <div className="flex-shrink-0 w-30 h-28">
                        <a href="/panel/style" className="flex flex-col items-center justify-center w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold no-underline transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                            <div className="text-2xl">
                                <i className="bi bi-brush-fill"></i>
                            </div>
                            Style
                        </a>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}