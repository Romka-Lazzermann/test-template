import { useEffect } from 'react';
import { Blog } from './BlogsTable';
import { useCreateBlogHandler } from './useCreateBlogHandler';
import { useUpdateBlogHandler } from './useUpdateBlogHandler';
import styles from '@/components/index.module.css';

interface FormProps {
    blog: Blog | null,
    setShow: (value: boolean) => void;
    fetchCreateCallback: (value: any) => void;
    fetchUpdateCallback: (value: any) => void;
    children: React.ReactNode;
}

export default function BlogForm({ blog, setShow, children, fetchCreateCallback, fetchUpdateCallback }: FormProps) {
    const isEdit = blog;
    const handleSubmit = isEdit ? useUpdateBlogHandler(fetchUpdateCallback) : useCreateBlogHandler(fetchCreateCallback);
    useEffect(() => {
        console.log("Change blog", blog)
    }, [blog])
    return (
        <>
            <div className={styles.modal_header}>
                <h2>{isEdit ? 'Edit Blog' : 'Add Blog'}</h2>
                <button type="button" onClick={() => setShow(false)}>×</button>
            </div>

            <div style={{ overflowY: 'auto', flexGrow: 1 }}>
                <div className={styles.modal_body}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>


                        <label className="form-label">
                            Title
                            <input
                                className='form-control w-100'
                                type="text"
                                name="title"
                                defaultValue={blog?.title || ''}
                                required
                            />
                        </label>

                        <label>
                            <select
                                className='form-select'
                                name="category_id"
                                defaultValue={blog?.category_id || ''}
                                required
                            >
                                <option value="">Choose Category</option>
                                {children}
                            </select>
                        </label>

                        <label>
                            Image:
                            <input
                                className='w-100'
                                type="file"
                                name="img"
                                accept="image/*"
                                required={!isEdit}
                            />
                        </label>

                        {isEdit && (
                            <>
                                <label>
                                    Description:
                                    <textarea
                                        className='form-control w-100'
                                        name="description"
                                        defaultValue={blog?.description || ''}
                                    />
                                </label>

                                <label>
                                    Sub-description:
                                    <textarea
                                        className='form-control w-100'
                                        name="sub_description"
                                        defaultValue={blog?.sub_description || ''}
                                    />
                                </label>

                                <label>Keywords</label>
                                {[...Array(10)].map((_, i) => (
                                    <input
                                        key={`i_${i}`}
                                        className='form-control'
                                        name={`keywords[${i}]`}
                                        defaultValue={blog?.keywords?.[i] || ''}
                                    />
                                ))}

                                <input hidden name="blog_id" defaultValue={blog.id} />
                            </>
                        )}

                        <div className={styles.modal_footer}>
                            <button className='btn btn-primary' type="submit">
                                {isEdit ? 'Update' : 'Add'}
                            </button>
                            <button className='btn btn-danger' type="button" onClick={() => setShow(false)}>
                                Close
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </>
    );
}
