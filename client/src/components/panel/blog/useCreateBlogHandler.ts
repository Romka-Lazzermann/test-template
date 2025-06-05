export function useCreateBlogHandler(fetchCallback: any) {
  return async function handleCreate(e: any) {
    console.log("Handle create")
    e.preventDefault();
    const formData = new FormData(e.target);
    // const body : any = Object.fromEntries(formData.entries());
    // body.category_id = Number(body.category_id);
    // const file = formData.get('img');


    fetchCallback(formData)
  };
}
