import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useState, useEffect } from "react";
import { TextStyle } from "@shopify/polaris";
import moment from "moment";

const ADD_TAG = gql`
  mutation AddTag($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      userErrors {
        field
        message
      }
    }
  }
`;

const AddRecurringTag = ({ name, id, number }) => {
  const [result, setResult] = useState(false);

  const MakeTag = (name, number) => {
    let recurringNumber;
    if (number + 1 < 10) {
      recurringNumber = "0" + (number + 1).toString();
    } else {
      recurringNumber = (number + 1).toString();
    }

    //Log
    console.log("recurringNumber(add tag) : " + recurringNumber);

    return (
      "#" +
      recurringNumber +
      "R" +
      moment().format("YYYYMMDD") +
      name.slice(1) +
      "NP"
    );
  };

  const [AddTag, { data }] = useMutation(ADD_TAG, {
    variables: {
      id: id,
      tags: MakeTag(name, number),
    },

    onCompleted: (data) => {
      console.log(data);
      data.tagsAdd.userErrors.length == 0 ? setResult(true) : null;
    },
  });

  useEffect(() => {
    AddTag(id, number);
  }, [id, number]);

  return result ? (
    <p>
      <TextStyle variation="positive">
        Due date is today. Sending the invoice ({name}) is successful.
      </TextStyle>
    </p>
  ) : null;
};

export default AddRecurringTag;
