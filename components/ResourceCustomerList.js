import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Card, ResourceList, ResourceItem, Button } from '@shopify/polaris';
import InitialOrderList from '../static/InitialOrderList';
import CreateDraftOrder from './CreateDraftOrder';



// const GET_CUSTOMERS_BY_TAG = gql`
//     query getCustomers($tag: String!){
//         customers(first:10, query: $tag){
//             edges{
//                 node{
//                     displayName
//                     id
//                     email
//                     createdAt 
//                 }
//             }
//         }
//     }

// `;

const GET_DATA_FOR_DRAFT_ORDER = gql `
    query getDataForDraftOrder($initial_order_id: ID!){
        order(id: $initial_order_id){
            billingAddress{
                address1
                address2,
                city,
                company,
                country,
                firstName,
                lastName,
                phone,
                zip,
                provinceCode
            } 
            shippingAddress{
                address1
                address2,
                city,
                company,
                country,
                firstName,
                lastName,
                phone,
                zip,
                provinceCode
            }
            customer{
                id
                email
            }
            lineItems(first:10){
                edges{
                    node{
                        fulfillableQuantity 
                    }
                }
            }
        }
    }

`;



const ResourceListWithCustomersByTag = () =>{
    
    console.log(typeof InitialOrderList[0].orderId)


    const { data, error, loading } = useQuery( GET_DATA_FOR_DRAFT_ORDER, {
        variables:{
            initial_order_id: InitialOrderList[0].orderId
        }
    })    

    if(!loading) console.log(data);
                    
   
    return(
    !loading? 
    //     <Card>
    //         <ResourceList
    //             items={data}
    //             renderItem={(item, id, index)=>{
    //                 return(
    //                     <ResourceItem
    //                         id={id}
    //                         index={index}
    //                         name={item.customer.id}
                            
    //                     >   
    //                         <h3>{item.customer.email}</h3>
    //                         <h3>{item.customer.id}</h3>
    //                     </ResourceItem>        
    //                 )
    //             }}
    //         />
    //     </Card>
    //    : 
       <CreateDraftOrder info={data} />
       :
       null

    );
    

}

export default ResourceListWithCustomersByTag;