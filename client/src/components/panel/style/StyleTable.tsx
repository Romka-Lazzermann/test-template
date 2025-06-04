'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import modalStyles from '@/components/index.module.css';
import CreateFormModal from '@/components/modals/CreateFormModal';


interface Style {
    id: string,
    style_key: string,
}

export default function StylesTable() {
    const router = useRouter();
    const [styles, setStyles] = useState<Array<Style>>([])
    const [show, setShow] = useState(false);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setShow(false)
        }
    }

    const generate_rows = (styles: Array<Style>) => {
        return styles?.map((style: Style) => {
            return (
                <tr key={style.id}>
                    <td>
                        #{style.id}
                    </td>
                    <td>
                        {style.style_key}
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

    const rows = useMemo(() => generate_rows(styles), [styles])


    useEffect(() => {
        const fetchStyles = async () => {
            const res = await fetch('/api/styles', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json: Array<Style> = await res.json();
            if (res.ok) {
                console.log("Fetched styless", json)
                setStyles([...json])
            } else {
                console.error("Fetch error")
            }
        }
        fetchStyles();
    }, [])

    const handleCreateFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const json: any = {}
        formData.forEach((v, k) => {
            json[k] = v;
        })

        const res = await fetch('/api/styles/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        });
        if (res.ok) {
            const data = await res.json();
            console.log("created successfully", data)
            setStyles([...styles, data])
        } else {
            const data = await res.json();
            console.error("created error", data)
        }
    }

    if (!styles) {
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
                <table className={`${modalStyles.table_rounded} table table-dark`}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Style Key</th>
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
                    <div className={modalStyles.modal_header}>
                        <h2>Add Channel</h2>
                        <button type="button" onClick={() => setShow(false)}>×</button>
                    </div>

                    <div className={modalStyles.modal_body}>
                        <label className="form-label">
                            Style Key
                            <input className='form-control w-100' type="text" name="style_key" required />
                        </label>
                    </div>

                    <div className={modalStyles.modal_footer}>
                        <button className='btn btn-primary' type="submit">Add</button>
                        <button className='btn btn-danger' type="button" onClick={() => setShow(false)}>Close</button>
                    </div>
                </form>
            </CreateFormModal>

        </>
    )
}