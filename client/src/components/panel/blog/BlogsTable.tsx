'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/index.module.css';
import CreateFormModal from '@/components/modals/CreateFormModal';
import { fetchCategories } from '../category/fetchCalls'
import { fetchBlogs, createBlog, updateBlog } from './fetchCalls'
import BlogForm from './BlogForm';
export interface Blog {
    id: string,
    title: string
    category: string
    status: boolean,
    create_date: string,
    description: string,
    keywords: Array<string>,
    category_id: number,
    sub_description: string
}

interface Category {
    id: string,
    title: string
}

export default function BlogsTable() {
    const router = useRouter();
    const [blogs, setBlogs] = useState<Array<Blog>>([]);
    const [categories, setCategories] = useState<Array<Category>>([])
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
    const [show, setShow] = useState(false);

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
                        <button type='button' onClick={() => {
                            setSelectedBlog(blog)
                            setShow(true)
                        }} className='btn btn-sm btn-danger'>
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
        fetchCategories((categories: Category[]) => {
            setCategories([...categories])
        })
        fetchBlogs((blogs: Blog[]) => {
            setBlogs([...blogs])
        });
    }, [])

    const fetchCreateCallback = (formData: any) => {
        createBlog(formData, (data: Blog) => {
            setBlogs([...blogs, data])
        })
        setShow(false)
    }
    const fetchUpdateCallback = (formData: any) => {

        updateBlog(formData, (data: Blog) => {
            const _blogs = blogs.map((item, i) => (item.id === data.id ? data : item));
            setBlogs([..._blogs])
        })
        setShow(false)
        setSelectedBlog(null)
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

            <CreateFormModal handleCloseCallback={() => {
                setSelectedBlog(null)
            }} show={show} setShow={setShow}>
               <BlogForm 
               fetchUpdateCallback={fetchUpdateCallback} 
               fetchCreateCallback={fetchCreateCallback} 
               blog={selectedBlog} 
               setShow={setShow}>
                    {selectors}
                </BlogForm>
            </CreateFormModal>

        </>
    )
}