import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Page, Button } from "@shopify/polaris";
import { ResourcePicker} from '@shopify/app-bridge-react';

import ResourceListWithCustomersByTag from "../components/ResourceCustomerList";

const Index = () => {
  const [ pickerOpen, setPickerOpen ] = useState(false);

  return(
    <>
    <Page
      title="Customers with using pre-paid card"
      primaryAction={{
        content: 'Select Customers',
        onAction: ()=>{ 
          setPickerOpen(true)
        }
      }}
    >  

      <ResourcePicker
        resourceType="Product"
        open = { pickerOpen }
        onCancel = { ()=>{
          setPickerOpen(false)
        }}
        onSelection = {(resources)=>{
          setPickerOpen(false)
          console.log(resources)
        }}
      />  

      
      
    </Page>
    <ResourceListWithCustomersByTag/>
    </>
  )

  
}

export default Index;
