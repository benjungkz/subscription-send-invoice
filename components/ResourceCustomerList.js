import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Card, ResourceList, ResourceItem, TextStyle, Avatar, Layout, TextContainer, Heading, Button, Stack } from '@shopify/polaris';
import InitialOrderList from '../static/InitialOrderList';
import CreateDraftOrder from './CreateDraftOrder';
import moment from 'moment';


const GET_DATA_FOR_DRAFT_ORDER = gql `
    query getDataForDraftOrder($initial_order_id: [ID!]!){
        nodes(ids:$initial_order_id){
            ... on Order{
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
                    displayName
                }
                lineItems(first:10){
                    edges{
                        node{
                            fulfillableQuantity 
                        }
                    }
                }
                createdAt
                tags
                id
                name
            }
        }
    }

`;



const ResourceListWithCustomersByTag = () =>{
    
    const prepaidOrderIds = InitialOrderList.map((prepaidOrder)=>{
        console.log( prepaidOrder.orderId);
        return prepaidOrder.orderId;                
    })

    const { data, error, loading } = useQuery( GET_DATA_FOR_DRAFT_ORDER, {
        variables:{
            initial_order_id: prepaidOrderIds
        }
    })    

    if(!loading) console.log(data);
    if(error) console.log(error);
                    

    const isDayToCreateDraftOrder = ( createdAt, tags ) =>{
        let maxRecurringNumber = 0;

        // Check privious recurring order by tag
        tags.forEach(tag =>{
            if(tag.slice(0,1) == '#'){
                if(parseInt(tag.slice(1,3)) > maxRecurringNumber){
                    maxRecurringNumber = parseInt(tag.slice(1,3));
                }
            }
        })

        // Confirm it this month is next recurring month
        let reccuringOrderDate = moment(createdAt).add(maxRecurringNumber + 1, 'M').utc().format();
        let today = moment().utc().format();
        //let test = moment("2021-02-20").utc().format();    
        let isDay = moment(reccuringOrderDate).isSame(today, "day");
        return { isDay, maxRecurringNumber, reccuringOrderDate }
    }
   
    return(
        
    !loading? 
        <Layout>
            <Layout.Section>
                <Card title="Customers List" sectioned>
                    <Card.Section>
                        <ResourceList
                        resourceName={{singular: 'customer', plural: 'customer'}}
                        items={data.nodes}
                        renderItem={(item, id, index)=>{

                            const media = <Avatar customer size="medium" name={item.displayName} />;
                            const { isDay, maxRecurringNumber, reccuringOrderDate } = isDayToCreateDraftOrder(item.createdAt, item.tags);
                        
                            
                            return (
                                <ResourceItem
                                    id={id}
                                    media={media}
                                >   
                                    <Stack spacing="loose" vertical>
                                        <TextContainer>
                                            <Heading>{item.customer.displayName} ({item.customer.email})</Heading>
                                            <TextStyle variation="subdued">Initial Order : {item.name} </TextStyle>
                                            <CreateDraftOrder 
                                                order={item} 
                                                recurringNumber={maxRecurringNumber + 1}
                                                isDate={isDay}
                                                recurringDate={reccuringOrderDate}/>  
                                        </TextContainer>
                                    </Stack>
                                    {/* <Stack distribution="trailing">
                                        <Button>Send addtional invoice</Button>
                                    </Stack> */}
                                </ResourceItem>

                            )
                        }}
                        >
                    </ResourceList>
                    </Card.Section>    
                </Card>
            </Layout.Section>
        </Layout>
        :
        null   
    
    );
    

}

export default ResourceListWithCustomersByTag;