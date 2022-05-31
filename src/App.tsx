import { ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import { Main } from "./components/Main";
import defaultTheme from "./defaultTheme";

export const App = () => (
  <ChakraProvider theme={defaultTheme}>
    <Main />
  </ChakraProvider>
);
