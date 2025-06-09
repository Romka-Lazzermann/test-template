'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CreateFormModal from '@/components/modals/CreateFormModal';
import {fetchCategories, createCategory, updateCategory} from './fetchCalls'

interface Category {
    id: string,
    title: string,
    description: string,
    status: string,
    create_date: string
}

export default function CategoryTable() {
    const router = useRouter();
    const [categories, setCategories] = useState<Array<Category>>([])
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [show, setShow] = useState(false);

    const generate_rows = (categories: Array<Category>) => {
        return categories?.map((category: Category) => {
            return (
                <tr key={category.id} className="border-b border-gray-700">
                    <td className="py-2 px-4">
                        {category.title}
                    </td>
                    <td className="py-2 px-4">
                        {category.status}
                    </td>
                    <td className="py-2 px-4">
                        {category.create_date}
                    </td>
                    <td className="py-2 px-4">
                        <button type='button' onClick={() => handleEditClick(category)} className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm'>
                            <i className="bi bi-pencil-square"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    const handleBackClick = () => {
        router.push('/panel/')
    };

    const handleAddClick = () => {
        setShow(true);
    }

    const handleEditClick = (category: Category) => {
        setSelectedCategory(category);
        setShow(true);
    }

    const rows = useMemo(() => generate_rows(categories), [categories])

    useEffect(() => {
        fetchCategories((categories: Array<Category>) => {
            setCategories(categories)
        });
    }, [])

    const handleCreateFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        if (selectedCategory) {
            await updateCategory(formData, (data: Category) => {
                const _categories = categories.map((item, i) => (item.id === data.id ? data : item));
                setCategories([..._categories])
            })
        } else {
            await createCategory(formData, (data: Category) => {
                setCategories([...categories, data])
            })
        }
        setShow(false);
        setSelectedCategory(null)
    }

    if (!categories) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className='flex justify-between mb-2'>
                <button onClick={handleBackClick} className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>
                    <i className="bi bi-arrow-left"></i>
                    <span> Back</span>
                </button>

                <button onClick={handleAddClick} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    <i className="bi bi-plus-lg"></i>
                    <span> Add</span>
                </button>
            </div>
            <h2 className="mt-4 text-xl font-bold">Category</h2>
            <div className='overflow-x-auto'>
                <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-700">
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
            <CreateFormModal handleCloseCallback={() => { setSelectedCategory(null) }} show={show} setShow={setShow}>
                <form onSubmit={handleCreateFormSubmit}>
                    <div className=" overflow-y-auto flex-grow px-6 py-4 flex justify-between items-center pb-3 border-b border-gray-700">
                        <h2 className="text-xl font-bold">{selectedCategory ? 'Edit Category' : 'Add Category'}</h2>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => {
                                setShow(false)
                                setSelectedCategory(null)
                            }}
                        >
                            ×
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-grow px-6 py-4 ">
                        <label className="block mb-2 text-sm font-bold">
                            Title
                            <input defaultValue={selectedCategory?.title || ''} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1' type="text" name="title" required />
                        </label>
                        <label className="block mb-2 text-sm font-bold">
                            Description:
                            <textarea defaultValue={selectedCategory?.description || ''} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1' name="description" required />
                        </label>
                        <input type="hidden" id="category_id" name="category_id" defaultValue={selectedCategory?.id || ''} />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-700">
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2' type="submit">{selectedCategory ? 'Update' : 'Add'}</button>
                        <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' type="button" onClick={() => setShow(false)}>Close</button>
                    </div>
                </form>
            </CreateFormModal>
        </>
    )
}