import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  Button,
  ChakraProvider,
  Divider,
  HStack,
  Link,
} from "@chakra-ui/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <>
        <HStack m={4}>
          <Button colorScheme="blue">
            <Link href="/">Accueil</Link>
          </Button>
        </HStack>
        <Divider />
        <Component {...pageProps} />
      </>
    </ChakraProvider>
  );
}
