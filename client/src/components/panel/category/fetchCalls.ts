export async function fetchCategories(successCallback: any) {
    const res = await fetch('/api/categories', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const json: Array<any> = await res.json();
    if (res.ok) {
        console.log("Fetched categories", json)
        successCallback([...json])
    } else {
        console.error("Fetch error")
    }
}

export async function createCategory(formData: any, successCallback: any) {
    formData.delete('category_id')
    const json: any = {}
    formData.forEach((v: any, k: any) => {
        json[k] = v;
    })
    const res = await fetch('/api/categories/', {
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

export async function updateCategory(formData: any, successCallback: any) {
    const category_id = formData?.get('category_id')
    formData.delete('category_id')
    const json: any = {}
    formData.forEach((v: any, k: any) => {
        json[k] = v;
    })
    const res = await fetch(`/api/categories/${category_id}`, {
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
