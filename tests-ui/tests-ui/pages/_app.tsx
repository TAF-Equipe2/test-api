import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  Button,
  ChakraProvider,
  Divider,
  HStack,
  Link,
} from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <>
        <HStack p={4} backgroundColor="blue.100">
          <Button colorScheme="blue" leftIcon={<FaHome />}>
            <Link href="/">Accueil</Link>
          </Button>
        </HStack>
        <Divider />
        <Component {...pageProps} />
      </>
    </ChakraProvider>
  );
}
