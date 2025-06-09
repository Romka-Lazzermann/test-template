'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CreateFormModal from '@/components/modals/CreateFormModal';
import { fetchStyles, createStyle, updateStyle } from './fetchCalls';

interface Style {
    id: string;
    style_key: string;
}

export default function StylesTable() {
    const router = useRouter();
    const [styles, setStyles] = useState<Array<Style>>([]);
    const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
    const [show, setShow] = useState(false);

    const generate_rows = (styles: Array<Style>) => {
        return styles?.map((style: Style) => {
            return (
                <tr key={style.id} className="border-b border-gray-700">
                    <td className="py-2 px-4">
                        #{style.id}
                    </td>
                    <td className="py-2 px-4">
                        {style.style_key}
                    </td>
                    <td className="py-2 px-4">
                        <button
                            type='button'
                            onClick={() => handleEditClick(style)}
                            className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm'
                        >
                            <i className="bi bi-pencil-square"></i>
                        </button>
                    </td>
                </tr>
            );
        });
    };

    const handleClick = () => {
        router.push('/panel/');
    };

    const handleAddClick = () => {
        setShow(true);
    };

    const handleEditClick = (style: Style) => {
        setSelectedStyle(style);
        setShow(true);
    };

    const rows = useMemo(() => generate_rows(styles), [styles]);

    useEffect(() => {
        fetchStyles((styles: Array<Style>) => {
            setStyles([...styles]);
        });
    }, []);

    const handleCreateFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        if (selectedStyle) {
            updateStyle(formData, (data: Style) => {
                const _styles = styles.map((item, i) => (item.id === data.id ? data : item));
                setStyles([..._styles]);
            });
        } else {
            createStyle(formData, (data: Style) => {
                setStyles([...styles, data]);
            });
        }
        setShow(false);
        setSelectedStyle(null);
    };

    if (!styles) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className='flex justify-between mb-2'>
                <button onClick={handleClick} className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>
                    <i className="bi bi-arrow-left"></i>
                    <span> Back</span>
                </button>

                <button onClick={handleAddClick} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    <i className="bi bi-plus-lg"></i>
                    <span> Add</span>
                </button>
            </div>
            <h2 className="mt-4 text-xl font-bold">Styles</h2>
            <div className='overflow-x-auto'>
                <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="text-left py-2 px-4">Id</th>
                            <th className="text-left py-2 px-4">Style Key</th>
                            <th className="text-left py-2 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>

            <CreateFormModal handleCloseCallback={() => { setSelectedStyle(null) }} show={show} setShow={setShow}>
                <form onSubmit={handleCreateFormSubmit}>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                        <h2 className="text-xl font-bold">{selectedStyle ? 'Edit Style' : 'Add Style'}</h2>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => {
                                setShow(false);
                                setSelectedStyle(null);
                            }}
                        >
                            ×
                        </button>
                    </div>

                    <div className="flex-grow px-6 py-4">
                        <label className="block mb-2 text-sm font-bold ">
                            Style Key
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1' type="text" name="style_key" defaultValue={selectedStyle?.style_key || ''} required />
                            <input type="hidden" id="style_id" name="style_id" defaultValue={selectedStyle?.id || ''} />
                        </label>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-700">
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2' type="submit">{selectedStyle ? 'Edit' : 'Add'}</button>
                        <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' type="button" onClick={() => {
                            setShow(false);
                            setSelectedStyle(null);
                        }}>Close</button>
                    </div>
                </form>
            </CreateFormModal>
        </>
    );
}