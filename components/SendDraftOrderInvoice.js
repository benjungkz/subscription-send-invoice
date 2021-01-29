import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';


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


    const [SendInvoice, { loading, error, data }] = useMutation(SEND_INVOICE,{
        variables:{
            id: draftOrderId
        },
        onCompleted:(data)=>{
            console.log(data);
        }
    })
    

    return(
        draftOrderId == " " ?
        <p>No Need {draftOrderId}</p>
        :
        <p onLoad={SendInvoice}></p>
    )
}

export default SendDarftOrderInvoice;
