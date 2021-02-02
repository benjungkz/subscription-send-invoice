import { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import AddRecurringTag  from './AddRecurringTag';
//start
const SEND_INVOICE = gql`
    mutation SendInvoice($id: ID!){
        draftOrderInvoiceSend(id: $id) {
            draftOrder {
                id
                name
            }
            userErrors {
                field
                message

        
            }
        }
    }
`;

const SendDarftOrderInvoice = ({draftOrderId, initialOrderId, recurringNumber}) =>{
    const [ result, setResult ] = useState(false);
    const [ draftOrderName, setDraftOrderName ] = useState('');

    const [SendInvoice, { data, loading, error }] = useMutation(SEND_INVOICE,{
        variables:{
            id: draftOrderId
        },
        onCompleted:(data)=>{            
            console.log(data);
            data.draftOrderInvoiceSend.userErrors.length == 0 ? setDraftOrderName(data.draftOrderInvoiceSend.draftOrder.name) : null;
        }
    })

    useEffect(()=>{
        handler(draftOrderId);
    },[draftOrderId]);
    
    const handler = ( draftOrderId ) => {
        if(draftOrderId != undefined || draftOrderId != '' ) SendInvoice();
    }

    return(
        draftOrderName !="" ? <AddRecurringTag name={draftOrderName} id={initialOrderId} number={recurringNumber}/> : <p>'The invoice is not sent yet'</p>
    )
}

export default SendDarftOrderInvoice;
