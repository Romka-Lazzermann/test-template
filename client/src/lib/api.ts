export async function fetchData(url: string) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      // cache: 'no-store',
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // console.error('Fetch error:', error);
    // throw error;
  }
}

export async function postData(url: string, json: any) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 3600 },
      body: JSON.stringify(json)
    },);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // console.error('Fetch error:', error);
    // throw error;
  }
}