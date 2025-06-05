export function useUpdateBlogHandler(fetchCallback: any) {
  return async function handleUpdate(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    fetchCallback(formData);
    // const body : any = Object.fromEntries(formData.entries());
    // body.category_id = Number(body.category_id);

    // const keywords = [];
    // for (let i = 0; i < 10; i++) {
    //   const kw = formData.get(`keywords[${i}]`);
    //   if (kw) keywords.push(kw.toString());
    // }
    // body.keywords = keywords;

    // // description и sub_description уже есть
    // const file = formData.get('img');

    // console.log('Updating blog ID', blog.id, 'with:', body, file);
  };
}
