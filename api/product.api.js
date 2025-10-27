import { API } from "./api.js"

export const AllProducts = async() =>{

  try {
      const res = await fetch(`${API}/product/all`,{
          method:'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      if(!res.ok){
        throw new Error(`Error: ${res.status}`)
      }
      const data = await res.json()
      return data
  } catch (error) {
      console.error("Error al traer productos", error)
      return {status:false}
  }
}


export const productsByCategory = async (categoryId) => {
  try {
      const res = await fetch(`${API}/product/productsByCategory`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ _id: categoryId })
      });
      if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();
      return data;
  } catch (error) {
      console.error("Error al filtrar productos", error);
      return { status: false };
  }
};