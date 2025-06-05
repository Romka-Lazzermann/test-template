export async function fetchChannels(successCallback: any) {
    const res = await fetch('/api/channels', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const json: Array<any> = await res.json();
    if (res.ok) {
        console.log("Fetched channels", json)
        successCallback([...json])
    } else {
        console.error("Fetch error")
    }
}

export async function createChannel(formData: any, successCallback: any) {
    formData.delete('channel_id')
    const json: any = {}
    formData.forEach((v: any, k: any) => {
        json[k] = v;
    })
    const res = await fetch('/api/channels/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    });

    if (res.ok) {
        const data = await res.json();
        successCallback(data)
    } else {
        const data = await res.json();
        console.error("error", data)
    }

}

export async function updateChannel(formData: any, successCallback: any) {
    const channel_id = formData?.get('channel_id')
    formData.delete('channel_id')
    const json: any = {}
    formData.forEach((v: any, k: any) => {
        json[k] = v;
    })
    const res = await fetch(`/api/channels/${channel_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    });
    if (res.ok) {
        const data = await res.json();
        successCallback(data)
    } else {
        const data = await res.json();
        console.error("error", data)
    }
}
