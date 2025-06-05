'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/index.module.css';
import CreateFormModal from '@/components/modals/CreateFormModal';
import { fetchChannels, createChannel, updateChannel } from './fetchCalls';

interface Channel {
    id: string,
    channel_key: string,
    channel_value: string,
}

export default function ChannelTable() {
    const router = useRouter();
    const [channels, setChannels] = useState<Array<Channel>>([])
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    const [show, setShow] = useState(false);


    const generate_rows = (channels: Array<Channel>) => {
        return channels?.map((channel: Channel) => {
            return (
                <tr key={channel.id}>
                    <td>
                        #{channel.id}
                    </td>
                    <td>
                        {channel.channel_key}
                    </td>
                    <td>
                        {channel.channel_value}
                    </td>
                    <td>
                        <button type='button' onClick={() => handleEditClick(channel)} className='btn btn-sm btn-danger'>
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

    const handleEditClick = (Channel: Channel) => {
        setSelectedChannel(Channel);
        setShow(true);
    }

    const rows = useMemo(() => generate_rows(channels), [channels])


    useEffect(() => {
        fetchChannels((channels: Array<Channel>) => {
            setChannels(channels)
        });
    }, [])


    const handleCreateFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        if (selectedChannel) {
            await updateChannel(formData, (data: Channel) => {
                const _channels = channels.map((item, i) => (item.id === data.id ? data : item));
                setChannels([..._channels])
            })
        } else {
            await createChannel(formData, (data: Channel) => {
                setChannels([...channels, data])
            })
        }
        setShow(false);
        setSelectedChannel(null)
    }

    if (!channels) {
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
                            <th>Id</th>
                            <th>Channel ID</th>
                            <th>Channel Name</th>
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
                        <h2>Add Channel</h2>
                        <button type="button" onClick={() => setShow(false)}>×</button>
                    </div>

                    <div className={styles.modal_body}>
                        <label className="form-label">
                            Channel ID
                            <input className='form-control w-100' type="text" defaultValue={selectedChannel?.channel_key || ''} name="channel_key" required />
                        </label>
                        <label>
                            Channel Name:
                            <input className='form-control w-100' name="channel_value" defaultValue={selectedChannel?.channel_value || ''} required />
                        </label>

                        <input type="hidden" id="channel_id" name="channel_id" defaultValue={selectedChannel?.id || ''} />
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