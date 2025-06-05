'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import modalStyles from '@/components/index.module.css';
import CreateFormModal from '@/components/modals/CreateFormModal';
import { fetchStyles, createStyle, updateStyle } from './fetchCalls'

interface Style {
    id: string,
    style_key: string,
}

export default function StylesTable() {
    const router = useRouter();
    const [styles, setStyles] = useState<Array<Style>>([])
    const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
    const [show, setShow] = useState(false);

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
                        <button type='button' onClick={() => handleEditClick(style)} className='btn btn-sm btn-danger'>
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
    const handleEditClick = (style: Style) => {
        setSelectedStyle(style);
        setShow(true);
    }

    const rows = useMemo(() => generate_rows(styles), [styles])

    useEffect(() => {
        fetchStyles((styles: Array<Style>) => {
            setStyles([...styles])
        });
    }, [])

    const handleCreateFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        if (selectedStyle) {
            updateStyle(formData, (data: Style) => {
                const _categories = styles.map((item, i) => (item.id === data.id ? data : item));
                setStyles([..._categories])
            })
        } else {
            createStyle(formData, (data: Style) => {
                setStyles([...styles, data])
            })
        }
        setShow(false);
        setSelectedStyle(null)
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
            <h2 className="mt-4">Style</h2>
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

            <CreateFormModal handleCloseCallback={() => { setSelectedStyle(null) }} show={show} setShow={setShow}>
                <form onSubmit={handleCreateFormSubmit}>
                    <div className={modalStyles.modal_header}>
                        <h2>{selectedStyle ? 'Edit Style' : 'Add Style'}</h2>
                        <button type="button" onClick={() => {
                            setShow(false)
                            setSelectedStyle(null)
                        }}>×</button>
                    </div>

                    <div className={modalStyles.modal_body}>
                        <label className="form-label">
                            Style Key
                            <input className='form-control w-100' type="text" name="style_key" defaultValue={selectedStyle?.style_key || ''} required />
                            <input type="hidden" id="style_id" name="style_id" defaultValue={selectedStyle?.id || ''} />

                        </label>
                    </div>

                    <div className={modalStyles.modal_footer}>
                        <button className='btn btn-primary' type="submit">{selectedStyle ? 'Edit' : 'Add'}</button>
                        <button className='btn btn-danger' type="button" onClick={() => {
                            setShow(false)
                            setSelectedStyle(null)
                        }}>Close</button>
                    </div>
                </form>
            </CreateFormModal>

        </>
    )
}