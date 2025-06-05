export async function fetchBlogs(blogCallback: any) {
    const res = await fetch('/api/blogs', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const json: Array<any> = await res.json();
    if (res.ok) {
        console.log("Fetched", json)
        blogCallback([...json])
    } else {
        console.error("Fetch error")
    }
}

export async function createBlog(formData: any, blogCallback: any) {
    const res = await fetch('/api/blogs/', {
        method: 'POST',
        body: formData
    });
    if (res.ok) {
        const data = await res.json();
        console.log("created successfully", data)
        blogCallback(data)
    } else {
        const data = await res.json();
        console.error("created error", data)
    }
}

export async function updateBlog(formData: any, blogCallback: any){
    // title, category_id, description, img, sub_description, keywords [10] 
    const blog_id = formData.get('blog_id')
    formData.delete('blog_id')
    const keywords = [];
    for (let i = 0; i < 10; i++) {
      const kw = formData.get(`keywords[${i}]`);
      if (kw) {
        keywords.push(kw.toString());
      }
      formData.delete(`keywords[${i}]`);
    }
    formData.append("keywords", JSON.stringify(keywords))
    const res = await fetch(`/api/blogs/${blog_id}`, {
        method: 'PUT',
        body: formData
    });
    if (res.ok) {
        const data = await res.json();
        console.log("created successfully", data)
        blogCallback(data)
    } else {
        const data = await res.json();
        console.error("created error", data)
    }
}