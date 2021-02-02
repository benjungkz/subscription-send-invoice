import "isomorphic-fetch";
import { gql } from "apollo-boost";


export function GET_PRODUCT_BY_ID(){
    return gql`
        query{
            products(first: 2){
                edges{
                    node{
                        title
                    }
                }
            }
        }
    `;
}


export const getProductById = async client =>{
    const confirm = await client
    .query({
        query: GET_PRODUCT_BY_ID()
    })
    .then((response)=>{
        console.log(response.data);
    })

    return confirm;
}