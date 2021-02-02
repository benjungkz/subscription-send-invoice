import { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import LineItem from '../static/LineItem';
import { TextStyle } from '@shopify/polaris';
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



const CreateDraftOrder = ({order, isDate, recurringNumber, recurringDate}) =>{
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
            
            // Send Invoice
            setSendInvoice(data?.draftOrderCreate.draftOrder.id);

            // Set tag on initail tag
            //AddRecurringTag()
            
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
                <SendDarftOrderInvoice
                    initialOrderId={order.id}
                    recurringNumber={recurringNumber} 
                    draftOrderId={sendInvoice} />
                :
                <p>
                    <TextStyle variation="subdued">Due date is not today, the due date is {moment(recurringDate).format('MMMM Do, YYYY')}</TextStyle>
                </p>
            }
        </>
    );
}

export default CreateDraftOrder;