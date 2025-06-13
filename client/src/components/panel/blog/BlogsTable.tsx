'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
                <tr key={blog.id} className="border-b border-gray-700">
                    <td className="py-2 px-4">
                        {blog.title}
                    </td>
                    <td className="py-2 px-4">
                        {blog.category}
                    </td>
                    <td className="py-2 px-4">
                        {blog.status ? 'Active' : 'Inactive'}
                    </td>
                    <td className="py-2 px-4">
                        {blog.create_date}
                    </td>
                    <td className="py-2 px-4">
                        <button
                            type='button'
                            onClick={() => {
                                setSelectedBlog(blog)
                                setShow(true)
                            }}
                            className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm'
                        >
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
            <div className='flex justify-between mb-2'>
                <button onClick={handleClick} className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>
                    <i className="bi bi-arrow-left"></i>
                    <span> Back</span>
                </button>

                <button onClick={handleAddClick} disabled={!categories?.length} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    <i className="bi bi-plus-lg"></i>
                    <span> Add</span>
                </button>
            </div>
            <h2 className="mt-4 text-xl font-bold">Blog</h2>
            <div className='overflow-x-auto'>
                <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="text-left py-2 px-4">Blog</th>
                            <th className="text-left py-2 px-4">Category</th>
                            <th className="text-left py-2 px-4">Status</th>
                            <th className="text-left py-2 px-4">Create</th>
                            <th className="text-left py-2 px-4"></th>
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