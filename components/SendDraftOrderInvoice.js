import { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const SUCESS_MSG = 'Sending the invoice is sucess';
const FAIL_MSG = 'Sending the invoice is fail';


const SEND_INVOICE = gql`
    mutation SendInvoice($id: ID!){
        draftOrderInvoiceSend(id: $id) {
            draftOrder {
                id
            }
            userErrors {
                field
                message

        
            }
        }
    }
`;

const SendDarftOrderInvoice = ({draftOrderId}) =>{
    const [ result, setResult ] = useState('');

    const [SendInvoice, { loading, error, data }] = useMutation(SEND_INVOICE,{
        variables:{
            id: draftOrderId
        },
        onCompleted:(data)=>{            
            data.draftOrderInvoiceSend.userErrors.length == 0 ? setResult(SUCESS_MSG) : setResult(FAIL_MSG)
        }
    })

    useEffect(()=>{
        handler(draftOrderId);
    },[draftOrderId]);
    
    const handler = ( draftOrderId ) => {
        if(draftOrderId != undefined || draftOrderId != '' ) SendInvoice();
    }

    return(
        <p>{ result != '' ? result : 'The invoice is not sent yet'}</p>
    )
}

export default SendDarftOrderInvoice;
