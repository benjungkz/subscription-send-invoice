import { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import LineItem from '../static/LineItem';
import { Button } from '@shopify/polaris';
import SendDarftOrderInvoice from './SendDraftOrderInvoice';
import moment from 'moment';



const CREATE_DRAFT_ORDER = gql `
    mutation CreateDraftOrderForPrepaid($input: DraftOrderInput!){
        draftOrderCreate(input: $input){
            draftOrder {
                id
                createdAt 
             }
            userErrors {
                field
                message
            }
        }
    }

`;

const CreateDraftOrder = ({order, isDate}) =>{
    const [ sendInvoice, setSendInvoice ] = useState('');
    
    delete order.billingAddress.__typename;
    delete order.shippingAddress.__typename;

    const [ CreateDraftOrderForPrepaid, { data, loading } ] = useMutation(CREATE_DRAFT_ORDER,{
        variables:{
            input:{
                appliedDiscount: null,
                customAttributes: [],
                metafields:[],
                note:"",
                privateMetafields:[],
                shippingLine: null,
                tags: [],
                taxExempt: false,
                useCustomerDefaultAddress: true,
                billingAddress: order.billingAddress,
                shippingAddress: order.shippingAddress,
                customerId: order.customer.id,
                email: order.customer.email,
                lineItems:{
                    variantId: LineItem[0].id,
                    quantity: order.lineItems.edges[0].node.fulfillableQuantity
                }
            }
        },

        onCompleted: (data)=>{
            console.log(data?.draftOrderCreate.draftOrder.id);
            setSendInvoice(data?.draftOrderCreate.draftOrder.id);
        }

    })

    useEffect(()=>{
        handler(isDate)
    },[isDate]);

    const handler = (isDate) => {
        if(isDate) CreateDraftOrderForPrepaid();
    }


    return(
        <>
            {
                sendInvoice != '' ? 
                <SendDarftOrderInvoice draftOrderId={sendInvoice} />
                :
                <p>Due date is not today</p>
            }
        </>
    );
}

export default CreateDraftOrder;