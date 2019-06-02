import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Box, Heading, Text, Flex } from "rimble-ui";

const TxModal = props => {

  const initialState = {
    isOpen: false,
    action: "none"
  };

  const [state, setState] = useState(initialState);

  const closeModal = e => {
    e.preventDefault();
    setState({ ...state, isOpen: false });
  };

  const openModal = e => {
    e.preventDefault();
    setState({ ...state, isOpen: true });
  };

  return (
    <React.Fragment>
      <Button onClick={openModal}>Open Modal</Button>

      <Modal isOpen={state.isOpen}>
        <Card width={"420px"} p={0}>
          <Button.Text
            icononly
            icon={"Close"}
            color={"moon-gray"}
            position={"absolute"}
            top={0}
            right={0}
            mt={3}
            mr={3}
            onClick={closeModal}
          />
          <Box p={4} mb={3}>
            <Heading.h3>Confirm {state.action}</Heading.h3>
            <Text>Are you sure you want to {state.action}?</Text>
          </Box>
          <Flex
            px={4}
            py={3}
            borderTop={1}
            borderColor={"#E8E8E8"}
            justifyContent={"flex-end"}
          >
            <Button.Outline>Cancel</Button.Outline>
            <Button ml={3}>Confirm</Button>
          </Flex>
        </Card>
      </Modal>
    </React.Fragment>
  );
};

export default TxModal;
