import { CheckIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Spinner,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { TestResults } from "./api/tests";
import { BiTestTube } from "react-icons/bi";
import Alert from "../components/Alert";
import React from "react";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [alertMessage, setAlertMessage] = useState("");
  const [url, setUrl] = useState<string>("");
  const [firstTestButtonText, setFirstTestButtonText] = useState<string>("");
  const [firstTestTextShown, setFirstTestTextShown] = useState<string>("");
  const [h1Text, setH1Text] = useState<string>("");
  const [testResults, setTestResults] = useState<TestResults>();
  const [isExecutingTests, setIsExecutingTests] = useState<boolean>(false);
  const [doFirstTest, setDoFirstTest] = useState<boolean>(false);
  const [doSecondTest, setDoSecondTest] = useState<boolean>(false);

  const onTest = () => {
    if (url === "") {
      setAlertMessage(
        "Il faut choisir un site web à tester. Veuillez entrer un URL valide."
      );
      onOpen();
    } else if (!doFirstTest && !doSecondTest) {
      setAlertMessage("Veuillez sélectionner au moins un test");
      onOpen();
    } else {
      setIsExecutingTests(true);
      const executeTests = async () => {
        const data = {
          url,
          h1Text,
          firstTestButtonText,
          firstTestTextShown,
          doFirstTest,
          doSecondTest,
        };
        const response = await fetch("/api/tests", {
          method: "POST",
          body: JSON.stringify(data),
        });
        return response.json();
      };
      executeTests().then((data) => {
        console.log(data);
        setTestResults(data);
        setIsExecutingTests(false);
      });
    }
  };

  const calculatePercentageTestsSucceeded = () => {
    let total = 0;
    let succeeded = 0;
    total += testResults?.firstTest != undefined && doFirstTest ? 1 : 0;
    total += testResults?.secondTest != undefined && doSecondTest ? 1 : 0;

    succeeded +=
      testResults?.firstTest != undefined && testResults.firstTest ? 1 : 0;
    succeeded +=
      testResults?.secondTest != undefined && testResults.secondTest ? 1 : 0;

    return (100 * succeeded) / total;
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Tests UI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading>Tests UI</Heading>

        <Alert
          onClose={onClose}
          isOpen={isOpen}
          cancelRef={cancelRef}
          text={alertMessage}
        />

        <VStack my={10}>
          <FormControl>
            <FormLabel>URL</FormLabel>
            <InputGroup>
              <InputLeftAddon children="URL" />
              <Input
                borderColor="blue.500"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </InputGroup>

            <FormHelperText>Entrer l'URL du site web à tester</FormHelperText>
          </FormControl>
          <Divider />
          <VStack>
            <Checkbox
              isChecked={doFirstTest}
              onChange={(e) => setDoFirstTest(e.target.checked)}
              marginRight="auto"
            >
              <Heading as="h2" size="md" marginRight="auto !important">
                Test #1 - <Tag colorScheme="blue">Navigation</Tag>
                {testResults?.firstTest ? <CheckIcon color="green" /> : ""}
              </Heading>
            </Checkbox>
            <Text>
              Si l'utilisateur clique sur un bouton nommé{" "}
              <Input
                borderColor={doFirstTest ? "blue.500" : "lightgray"}
                value={firstTestButtonText}
                onChange={(e) => setFirstTestButtonText(e.target.value)}
                isDisabled={!doFirstTest}
              />
              Alors dans la page du navigateur, ce texte sera affiché:{" "}
              <Input
                borderColor={doFirstTest ? "blue.500" : "lightgray"}
                value={firstTestTextShown}
                onChange={(e) => setFirstTestTextShown(e.target.value)}
                isDisabled={!doFirstTest}
              />
            </Text>
          </VStack>
          <Divider />
          <VStack marginRight="auto !important">
            <Checkbox
              isChecked={doSecondTest}
              onChange={(e) => setDoSecondTest(e.target.checked)}
              marginRight="auto"
            >
              <Heading as="h2" size="md" marginRight="auto !important">
                Test #2 - <Tag colorScheme="blue">Titre sur la page</Tag>
                {testResults?.secondTest ? <CheckIcon color="green" /> : ""}
              </Heading>
            </Checkbox>
            <Text>
              Un élément H1 est présent dans la page et contient le texte
              suivant:{" "}
              <Input
                borderColor={doSecondTest ? "blue.500" : "lightgray"}
                value={h1Text}
                onChange={(e) => {
                  setH1Text(e.target.value);
                }}
                isDisabled={!doSecondTest}
              />
            </Text>
          </VStack>

          <Button
            colorScheme="blue"
            marginRight="auto !important"
            onClick={onTest}
            leftIcon={
              isExecutingTests ? <Spinner /> : <BiTestTube color="white" />
            }
            disabled={isExecutingTests}
          >
            Tester
          </Button>

          {(testResults?.firstTest !== undefined ||
            testResults?.secondTest !== undefined) && (
            <Box p="5" maxW="500px" borderWidth="2px" borderRadius={5}>
              <Flex align="baseline" mt={2} mb={3}>
                <HStack>
                  <Badge colorScheme="blue" fontSize="lg">
                    Résultats
                  </Badge>
                  <CircularProgress value={calculatePercentageTestsSucceeded()} size="50px" color="green.400">
                    <CircularProgressLabel>{calculatePercentageTestsSucceeded()}%</CircularProgressLabel>
                  </CircularProgress>
                </HStack>
              </Flex>

              {doFirstTest && testResults?.firstTest != undefined && (
                <Text>
                  Test #1:{" "}
                  {testResults.firstTest ? (
                    <Tag colorScheme="green" size="sm">
                      Réussi
                    </Tag>
                  ) : (
                    <Tag colorScheme="red" size="sm">
                      Non réussi
                    </Tag>
                  )}
                </Text>
              )}

              {doSecondTest && testResults?.secondTest != undefined && (
                <Text>
                  Test #2:{" "}
                  {testResults.secondTest ? (
                    <Tag colorScheme="green" size="sm">
                      Réussi
                    </Tag>
                  ) : (
                    <Tag colorScheme="red" size="sm">
                      Non réussi
                    </Tag>
                  )}
                </Text>
              )}
            </Box>
          )}
        </VStack>
      </main>

      <footer className={styles.footer}>
        <Text>Par l'équipe 1</Text>
      </footer>
    </div>
  );
}
