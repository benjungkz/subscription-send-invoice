import React from 'react';
import { Page } from "@shopify/polaris";
import ResourceListWithCustomersByTag from "../components/ResourceCustomerList";

const Index = () => {

  return(
    <>
    <Page
      title="Customers with using pre-paid card" 
    >        
      <ResourceListWithCustomersByTag/>

    </Page>
    
    </>
  )

  
}

export default Index;
