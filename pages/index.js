import React, { useState } from 'react';
import { Page } from "@shopify/polaris";
import ResourceListWithCustomersByTag from "../components/ResourceCustomerList";

const Index = () => {
  const [ send, setSend ] = useState(false);

  return(
    <>
    <Page
      title="Sending invoices to Customers with using pre-paid card"
      subtitle="Made by Alerta Family (v1.0)"
      primaryAction={{
        content: 'Send Invoice',
        onAction: ()=>{
          setSend(true);
        }
      }} 
    >     
      {   
        send? <ResourceListWithCustomersByTag/> : null
      }
    </Page>
    
    </>
  )

  
}

export default Index;
