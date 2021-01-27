import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Query } from 'react-apollo';
import { Card, ResourceList, ResourceItem, Button } from '@shopify/polaris';

const FILTER_TAG = "tag:prepaid_card";
const ORDER_TAG = "tag:initial_order";

const GET_CUSTOMERS_BY_TAG = gql`
    query getCustomers($tag: String!){
        customers(first:10, query: $tag){
            edges{
                node{
                    displayName
                    id
                    email
                    createdAt 
                }
            }
        }
    }

`;



const ResourceListWithCustomersByTag = () =>{
    
   

    const { data, error, loading } = useQuery( GET_CUSTOMERS_BY_TAG, {
        variables:{
            tag: FILTER_TAG,
            
            
        }
    })    
                    
   
    return(
        !loading? 
        <Card>
            <ResourceList
                items={data.customers.edges}
                renderItem={(item, id, index)=>{
                    return(
                        <ResourceItem
                            id={id}
                            index={index}
                            name={item.node.displayName}
                            
                        >   
                            <h1>{item.node.displayName}</h1>
                            <h3>{item.node.email}</h3>
                            <h3>{item.node.id}</h3>
                        </ResourceItem>        
                    )
                }}
            />
        </Card>
       : 
        <Card>
          
        </Card>
    );
    

}

export default ResourceListWithCustomersByTag;