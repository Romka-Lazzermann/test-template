'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/index.module.css';
import CreateFormModal from '@/components/modals/CreateFormModal';

interface Blog {
    id: string,
    title: string
    category: string
    status: boolean,
    create_date: string,
    description: string,
    keywords: Array<string>
}

interface Category {
    id: string,
    title: string
}

export default function BlogsTable() {
    const router = useRouter();
    const [blogs, setBlogs] = useState<Array<Blog>>([]);
    const [categories, setCategories] = useState<Array<Category>>([])
    const [show, setShow] = useState(false);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setShow(false)
        }
    }

    const generate_rows = (blogs: Array<Blog>) => {
        return blogs?.map((blog: Blog) => {
            return (
                <tr key={blog.id}>
                    <td>
                        {blog.title}
                    </td>
                    <td>
                        {blog.category}
                    </td>
                    <td>
                        {blog.status}
                    </td>
                    <td>
                        {blog.create_date}
                    </td>
                    <td>
                        <button type='button' className='btn btn-sm btn-danger'>
                            <i className="bi bi-pencil-square"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    const generate_selects = (categories: Array<Category>) => {
        return categories?.map((category) => {
            return (
                <option key={`key_${category.id}`} value={category.id}>{category.title}</option>
            )
        })
    }

    const handleClick = () => {
        router.push('/panel/')
    };
    const handleAddClick = () => {
        setShow(true);
    }

    const rows = useMemo(() => generate_rows(blogs), [blogs])
    const selectors = useMemo(() => generate_selects(categories), [categories])


    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch('/api/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json: Array<Category> = await res.json();
            if (res.ok) {
                console.log("Fetched categories", json)
                setCategories([...json])
            } else {
                console.error("Fetch error")
            }
        }

        const fetchBlogs = async () => {
            const res = await fetch('/api/blogs', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json: Array<Blog> = await res.json();
            if (res.ok) {
                console.log("Fetched", json)
                setBlogs([...json])
            } else {
                console.error("Fetch error")
            }
        }
        fetchCategories();
        fetchBlogs();
    }, [])

    const handleCreateFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const res = await fetch('/api/blogs/', {
            method: 'POST',
            body: formData
        });
        if (res.ok) {
            const data = await res.json();
            console.log("created successfully", data)
            setBlogs([...blogs, data])
        } else {
            const data = await res.json();
            console.error("created error", data)
        }
    }

    if (!blogs) {
        return <div>Loading...</div>;
    }

    return (
        <>

            <div className='d-flex justify-content-between mb-2'>
                <button onClick={handleClick} className='btn btn-secondary'>
                    <i className="bi bi-arrow-left"></i>
                    <span> Back</span>
                </button>

                <button onClick={handleAddClick} disabled={!categories?.length} className='btn btn-primary'>
                    <i className="bi bi-plus-lg"></i>
                    <span> Add</span>
                </button>

            </div>
            <h2 className="mt-4">Blog</h2>
            <div className='table-responsive'>
                <table className={`${styles.table_rounded} table table-dark`}>
                    <thead>
                        <tr>
                            <th>Blog</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Create</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>

            <CreateFormModal show={show} setShow={setShow}>
                <form onSubmit={handleCreateFormSubmit}>
                    <div className={styles.modal_header}>
                        <h2>Add Blog</h2>
                        <button type="button" onClick={() => setShow(false)}>×</button>
                    </div>

                    <div className={styles.modal_body}>
                        <label className="form-label">
                            Title
                            <input className='form-control w-100' type="text" name="title" required />
                        </label>

                        <label>
                            <select className='form-select' name="category_id" required>
                                <option key={"key_0"} value="">Choose Category</option>
                                {selectors}
                            </select>
                        </label>

                        <label>
                            Image:
                            <input className='w-100' type="file" name="img" accept="image/*" required />
                        </label>
                    </div>

                    <div className={styles.modal_footer}>
                        <button className='btn btn-primary' type="submit">Add</button>
                        <button className='btn btn-danger' type="button" onClick={() => setShow(false)}>Close</button>
                    </div>
                </form>
            </CreateFormModal>

        </>
    )
}