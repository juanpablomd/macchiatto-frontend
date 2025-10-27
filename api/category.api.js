import { API } from "./api.js"

export const allCategory = async() =>{
    try {
        const res = await fetch(`${API}/category/all`,{
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return res.json()
    } catch (error) {
        console.log(error)
        return {status:false}
    }
}