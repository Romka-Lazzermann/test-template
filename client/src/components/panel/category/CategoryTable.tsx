'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './index.module.css';

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
    const [show, setShow] = useState(false);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setShow(false)
        }
    }

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
                        <button type='button' className='btn btn-sm btn-danger'>
                            <i className="bi bi-pencil-square"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    const handleClick = () => {
        router.push('/panel/')
    };
    const handleAddClick = () => {
        setShow(true);
    }

    const rows = useMemo(() => generate_rows(categories), [categories])


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
        fetchCategories();
    }, [])

    const handleCreateFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const json: any = {}
        formData.forEach((v, k) => {
            json[k] = v;
        })

        const res = await fetch('/api/categories/', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(json) 
        });
        if (res.ok) {
            const data = await res.json();
            console.log("created successfully", data)
        } else {
            const data = await res.json();
            console.error("created error", data)
        }
    }

    if (!categories) {
        return <div>Loading...</div>;
    }

    return (
        <>

            <div className='d-flex justify-content-between mb-2'>
                <button onClick={handleClick} className='btn btn-secondary'>
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
                <table className={`${styles.table_rounded} table table-dark`}>
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

            {show && (
                <div className={`${styles.modal_backdrop}`} onClick={handleBackdropClick}>
                    <div className={`${styles.modal}`}>
                        <form onSubmit={handleCreateFormSubmit}>
                            <div className={styles.modal_header}>
                                <h2>Add Category</h2>
                                <button type="button" onClick={() => setShow(false)}>×</button>
                            </div>

                            <div className={styles.modal_body}>
                                <label className="form-label">
                                    Title
                                    <input className='form-control w-100' type="text" name="title" required />
                                </label>
                                <label>
                                    Description:
                                    <textarea className='form-control w-100' name="description" required />
                                </label>
                            </div>

                            <div className={styles.modal_footer}>
                                <button className='btn btn-primary' type="submit">Add</button>
                                <button className='btn btn-danger' type="button" onClick={() => setShow(false)}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </>
    )
}