import { useEffect } from 'react';
import { Blog } from './BlogsTable';
import { useCreateBlogHandler } from './useCreateBlogHandler';
import { useUpdateBlogHandler } from './useUpdateBlogHandler';

interface FormProps {
    blog: Blog | null;
    setShow: (value: boolean) => void;
    fetchCreateCallback: (value: any) => void;
    fetchUpdateCallback: (value: any) => void;
    children: React.ReactNode;
}

export default function BlogForm({ blog, setShow, children, fetchCreateCallback, fetchUpdateCallback }: FormProps) {
    const isEdit = blog;
    const handleSubmit = isEdit ? useUpdateBlogHandler(fetchUpdateCallback) : useCreateBlogHandler(fetchCreateCallback);

    useEffect(() => {
        console.log("Change blog", blog);
    }, [blog]);

    return (
        <>
            <div className="flex justify-between items-center pb-3 border-b border-gray-700 px-6 py-4">
                <h2 className="text-xl font-bold">{isEdit ? 'Edit Blog' : 'Add Blog'}</h2>
                <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => setShow(false)}>×</button>
            </div>

            <div className="overflow-y-auto flex-grow px-6 py-4">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Title
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1'
                                type="text"
                                name="title"
                                defaultValue={blog?.title || ''}
                                required
                            />
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Category
                            <select
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1'
                                name="category_id"
                                defaultValue={blog?.category_id || ''}
                                required
                            >
                                <option value="">Choose Category</option>
                                {children}
                            </select>
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Image:
                            <input
                                className='w-full text-gray-700 mt-1'
                                type="file"
                                name="img"
                                accept="image/*"
                                required={!isEdit}
                            />
                        </label>
                    </div>

                    {isEdit && (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Description:
                                    <textarea
                                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1'
                                        name="description"
                                        defaultValue={blog?.description || ''}
                                    />
                                </label>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Sub-description:
                                    <textarea
                                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1'
                                        name="sub_description"
                                        defaultValue={blog?.sub_description || ''}
                                    />
                                </label>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Keywords</label>
                                {[...Array(10)].map((_, i) => (
                                    <input
                                        key={`i_${i}`}
                                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1 mb-2'
                                        name={`keywords[${i}]`}
                                        defaultValue={blog?.keywords?.[i] || ''}
                                    />
                                ))}
                            </div>

                            <input type="hidden" name="blog_id" defaultValue={blog.id} />
                        </>
                    )}

                    <div className="flex justify-end pt-4 border-t border-gray-700 px-6 py-4">
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2' type="submit">
                            {isEdit ? 'Update' : 'Add'}
                        </button>
                        <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' type="button" onClick={() => setShow(false)}>
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
