export async function fetchStyles(successCallback: any) {
    const res = await fetch('/proxy/styles', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const json: Array<any> = await res.json();
    if (res.ok) {
        console.log("Fetched styless", json)
        successCallback([...json])
    } else {
        console.error("Fetch error")
    }
}

export async function createStyle(formData: any, successCallback: any) {
    formData.delete('style_id')

    const json: any = {}
    formData.forEach((v: any, k: any) => {
        json[k] = v;
    })

    const res = await fetch('/proxy/styles/', {
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
        console.error("created error", data)
    }
}

export async function updateStyle(formData: any, successCallback: any) {
    const style_id = formData?.get('style_id')
    formData.delete('style_id')
    const json: any = {}
    formData.forEach((v: any, k: any) => {
        json[k] = v;
    })

    const res = await fetch(`/proxy/styles/${style_id}`, {
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
        console.error("created error", data)
    }
}


