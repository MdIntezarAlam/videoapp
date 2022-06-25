import React from "react";
import  {AlertIcon} from '@chakra-ui/react'
import { Alert } from "@chakra-ui/react";


const AlertMsg = ({ status, icon, msg }) => {
  return (
    <Alert status={`${status ? status : "info"}`}>
      {icon}
      <AlertIcon ml={10}>{msg}</AlertIcon>
    </Alert>
  );
};

export default AlertMsg;
// 1.01