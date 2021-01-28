import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import LineItem from '../static/LineItem';
import { Button } from '@shopify/polaris';


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

const CreateDraftOrder = ({info}) =>{
    
    delete info.order.billingAddress.__typename;
    delete info.order.shippingAddress.__typename;


    // const test = {
    //     input:{
    //         appliedDiscount: null,
    //         customAttributes: [],
    //         metafields:[],
    //         note:"",
    //         privateMetafields:[],
    //         shippingLine: null,
    //         tags: [],
    //         taxExempt: false,
    //         useCustomerDefaultAddress: true,

    //         billingAddress: info.order.billingAddress,
    //         shippingAddress: info.order.shippingAddress,
    //         customerId: info.order.customer.id,
    //         email: info.order.customer.email,
    //         lineItems:{
    //             variantId: LineItem[0].id,
    //             quantity: info.order.lineItems.edges[0].node.fulfillableQuantity
    //         }
    //     }
    // }

    // console.log(test);


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
                billingAddress: info.order.billingAddress,
                shippingAddress: info.order.shippingAddress,
                customerId: info.order.customer.id,
                email: info.order.customer.email,
                lineItems:{
                    variantId: LineItem[0].id,
                    quantity: info.order.lineItems.edges[0].node.fulfillableQuantity
                }
            }
        },
        onCompleted: (data)=>{
            console.log(data?.draftOrderCreate);
        }

    })


    

    return(
        
        <Button onClick={
            CreateDraftOrderForPrepaid
            }>
            Create Draft Order
        </Button>
    );
}

export default CreateDraftOrder;