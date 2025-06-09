'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CreateFormModal from '@/components/modals/CreateFormModal';
import { fetchChannels, createChannel, updateChannel } from './fetchCalls';

interface Channel {
    id: string;
    channel_key: string;
    channel_value: string;
}

export default function ChannelTable() {
    const router = useRouter();
    const [channels, setChannels] = useState<Array<Channel>>([]);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [show, setShow] = useState(false);

    const generate_rows = (channels: Array<Channel>) => {
        return channels?.map((channel: Channel) => {
            return (
                <tr key={channel.id} className="border-b border-gray-700">
                    <td className="py-2 px-4">
                        #{channel.id}
                    </td>
                    <td className="py-2 px-4">
                        {channel.channel_key}
                    </td>
                    <td className="py-2 px-4">
                        {channel.channel_value}
                    </td>
                    <td className="py-2 px-4">
                        <button
                            type='button'
                            onClick={() => handleEditClick(channel)}
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

    const handleEditClick = (channel: Channel) => {
        setSelectedChannel(channel);
        setShow(true);
    };

    const rows = useMemo(() => generate_rows(channels), [channels]);

    useEffect(() => {
        fetchChannels((channels: Array<Channel>) => {
            setChannels(channels);
        });
    }, []);

    const handleCreateFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        if (selectedChannel) {
            await updateChannel(formData, (data: Channel) => {
                const _channels = channels.map((item, i) => (item.id === data.id ? data : item));
                setChannels([..._channels]);
            });
        } else {
            await createChannel(formData, (data: Channel) => {
                setChannels([...channels, data]);
            });
        }
        setShow(false);
        setSelectedChannel(null);
    };

    if (!channels) {
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
            <h2 className="mt-4 text-xl font-bold">Channels</h2>
            <div className='overflow-x-auto'>
                <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="text-left py-2 px-4">Id</th>
                            <th className="text-left py-2 px-4">Channel ID</th>
                            <th className="text-left py-2 px-4">Channel Name</th>
                            <th className="text-left py-2 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>

            <CreateFormModal show={show} setShow={setShow} handleCloseCallback={() => setSelectedChannel(null)}>
                <form onSubmit={handleCreateFormSubmit}>
                     <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                        <h2 className="text-xl font-bold">{selectedChannel ? 'Edit Channel' : 'Add Channel'}</h2>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => {
                                setShow(false);
                                setSelectedChannel(null);
                            }}
                        >
                            ×
                        </button>
                    </div>

                    <div className="flex-grow px-6 py-4">
                        <label className="block mb-2 text-sm font-bold">
                            Channel ID
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1' type="text" defaultValue={selectedChannel?.channel_key || ''} name="channel_key" required />
                        </label>
                        <label className="block mb-2 text-sm font-bold">
                            Channel Name:
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1' name="channel_value" defaultValue={selectedChannel?.channel_value || ''} required />
                        </label>
                        <input type="hidden" id="channel_id" name="channel_id" defaultValue={selectedChannel?.id || ''} />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-700">
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2' type="submit">{selectedChannel ? 'Update' : 'Add'}</button>
                        <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' type="button" onClick={() => setShow(false)}>Close</button>
                    </div>
                </form>
            </CreateFormModal>
        </>
    );
}