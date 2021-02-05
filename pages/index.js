import React, { useState } from "react";
import { Page } from "@shopify/polaris";
import ResourceListWithCustomersByTag from "../components/ResourceCustomerList";

const Index = () => {
  const [send, setSend] = useState(false);

  return (
    <>
      <Page
        title="Send invoice for using pre-paid card users"
        subtitle="Made by Alerta Family (v1.0)"
        primaryAction={{
          content: "Send Invoice",
          onAction: () => {
            setSend(true);
          },
        }}
      >
        {send ? <ResourceListWithCustomersByTag /> : null}
      </Page>
    </>
  );
};

export default Index;
