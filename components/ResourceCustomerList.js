import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import {
  Card,
  ResourceList,
  ResourceItem,
  TextStyle,
  Avatar,
  Layout,
  TextContainer,
  Heading,
  Stack,
} from "@shopify/polaris";
import InitialOrderList from "../static/InitialOrderList";
import CreateDraftOrder from "./CreateDraftOrder";
import moment from "moment";

const GET_DATA_FOR_DRAFT_ORDER = gql`
  query getDataForDraftOrder($initial_order_id: [ID!]!) {
    nodes(ids: $initial_order_id) {
      ... on Order {
        billingAddress {
          address1
          address2
          city
          company
          country
          firstName
          lastName
          phone
          zip
          provinceCode
        }
        shippingAddress {
          address1
          address2
          city
          company
          country
          firstName
          lastName
          phone
          zip
          provinceCode
        }
        customer {
          id
          email
          displayName
        }
        lineItems(first: 10) {
          edges {
            node {
              quantity
            }
          }
        }
        createdAt
        tags
        id
        name
      }
    }
  }
`;

const ResourceListWithCustomersByTag = () => {
  const prepaidOrderIds = InitialOrderList.map((prepaidOrder) => {
    return prepaidOrder.orderId;
  });

  const { data, error, loading } = useQuery(GET_DATA_FOR_DRAFT_ORDER, {
    variables: {
      initial_order_id: prepaidOrderIds,
    },
  });

  // Check data null
  if (!loading) console.log(data?.nodes);
  if (!loading && data?.nodes[0] == null)
    return <Heading>There are no subscriptions with pre-paid card</Heading>;

  const isDayToCreateDraftOrder = (createdAt, tags) => {
    let maxRecurringNumber = 0;

    // Check privious recurring order by tag
    tags.forEach((tag) => {
      if (tag.slice(0, 1) == "#") {
        if (parseInt(tag.slice(1, 3)) > maxRecurringNumber) {
          maxRecurringNumber = parseInt(tag.slice(1, 3));
        }
      }
    });

    //log
    console.log("maxRecurringNumber" + maxRecurringNumber);

    // Confirm it this month is next recurring month
    let reccuringOrderDate = moment(createdAt)
      .add(maxRecurringNumber + 1, "M")
      .utc()
      .format();
    let today = moment().utc().format();

    //let test = moment("2021-02-20").utc().format();
    let isDay = moment(reccuringOrderDate).isSame(today, "day");
    console.log("today: " + today);
    console.log("reccuringOrderDate: " + reccuringOrderDate);
    console.log("isDay: " + isDay);
    return { isDay, maxRecurringNumber, reccuringOrderDate };
  };

  return !loading ? (
    <Layout>
      <Layout.Section>
        <Card title="Customers List" sectioned>
          <Card.Section>
            <ResourceList
              resourceName={{ singular: "customer", plural: "customer" }}
              items={data.nodes}
              renderItem={(item, id, index) => {
                const media = (
                  <Avatar customer size="medium" name={item.displayName} />
                );
                const {
                  isDay,
                  maxRecurringNumber,
                  reccuringOrderDate,
                } = isDayToCreateDraftOrder(item.createdAt, item.tags);

                return (
                  <ResourceItem id={id} media={media}>
                    <Stack spacing="loose" vertical>
                      <TextContainer>
                        <Heading>
                          {item.customer.displayName} ({item.customer.email})
                        </Heading>
                        <TextStyle variation="subdued">
                          Initial Order : {item.name}{" "}
                        </TextStyle>
                        {isDay ? (
                          <CreateDraftOrder
                            order={item}
                            recurringNumber={maxRecurringNumber + 1}
                            isDate={isDay}
                            recurringDate={reccuringOrderDate}
                          />
                        ) : (
                          <p>
                            <TextStyle variation="subdued">
                              Due date is not today, the due date is{" "}
                              {moment(reccuringOrderDate).format(
                                "MMMM Do, YYYY"
                              )}
                            </TextStyle>
                          </p>
                        )}
                      </TextContainer>
                    </Stack>
                    {/* <Stack distribution="trailing">
                                        <Button>Send addtional invoice</Button>
                                    </Stack> */}
                  </ResourceItem>
                );
              }}
            ></ResourceList>
          </Card.Section>
        </Card>
      </Layout.Section>
    </Layout>
  ) : null;
};

export default ResourceListWithCustomersByTag;
