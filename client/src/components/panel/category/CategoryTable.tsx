'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CreateFormModal from '@/components/modals/CreateFormModal';
import styles from '@/components/index.module.css'
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
                <tr key={category.id}>
                    <td>
                        {category.title}
                    </td>
                    <td>
                        {category.status}
                    </td>
                    <td>
                        {category.create_date}
                    </td>
                    <td>
                        <button type='button' onClick={() => handleEditClick(category)} className='btn btn-sm btn-danger'>
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

            <div className='d-flex justify-content-between mb-2'>
                <button onClick={handleBackClick} className='btn btn-secondary'>
                    <i className="bi bi-arrow-left"></i>
                    <span> Back</span>
                </button>

                <button onClick={handleAddClick} className='btn btn-primary'>
                    <i className="bi bi-plus-lg"></i>
                    <span> Add</span>
                </button>

            </div>
            <h2 className="mt-4">Category</h2>
            <div className='table-responsive'>
                <table className={`table table-dark`}>
                    <thead>
                        <tr>
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
            <CreateFormModal handleCloseCallback={() => { setSelectedCategory(null) }} show={show} setShow={setShow}>
                <form onSubmit={handleCreateFormSubmit}>
                    <div className={styles.modal_header}>
                        <h2>{selectedCategory ? 'Edit Category' : 'Add Category'}</h2>
                        <button type="button" onClick={() => {
                            setShow(false)
                            setSelectedCategory(null)
                        }}>×</button>
                    </div>

                    <div className={styles.modal_body}>
                        <label className="form-label">
                            Title
                            <input defaultValue={selectedCategory?.title || ''} className='form-control w-100' type="text" name="title" required />
                        </label>
                        <label>
                            Description:
                            <textarea defaultValue={selectedCategory?.description || ''} className='form-control w-100' name="description" required />
                        </label>

                        <input type="hidden" id="category_id" name="category_id" defaultValue={selectedCategory?.id || ''} />
                    </div>

                    <div className={styles.modal_footer}>
                        <button className='btn btn-primary' type="submit">{selectedCategory ? 'Update' : 'Add'}</button>
                        <button className='btn btn-danger' type="button" onClick={() => setShow(false)}>Close</button>
                    </div>
                </form>
            </CreateFormModal>

        </>
    )
}