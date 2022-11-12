import { CheckIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  CircularProgressLabel,
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
import { isValidHttpUrl } from "../utils/helpers";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [alertMessage, setAlertMessage] = useState("");
  const [url, setUrl] = useState<string>("");
  const [firstTestButtonText, setFirstTestButtonText] = useState<string>("");
  const [firstTestTextShown, setFirstTestTextShown] = useState<string>("");
  const [h1Text, setH1Text] = useState<string>("");
  const [htmlSelectorIdentifier, setHtmlSelectorIdentifier] =
    useState<string>("");
  const [htmlSelectorPassword, setHtmlSelectorPassword] = useState<string>("");
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [thirdTestButtonName, setThirdTestButtonName] = useState<string>("");
  const [thirdTestTextShown, setThirdTestTextShown] = useState<string>("");
  const [testResults, setTestResults] = useState<TestResults>();
  const [isExecutingTests, setIsExecutingTests] = useState<boolean>(false);
  const [doFirstTest, setDoFirstTest] = useState<boolean>(false);
  const [doSecondTest, setDoSecondTest] = useState<boolean>(false);
  const [doThirdTest, setDoThirdTest] = useState<boolean>(false);

  const onTest = () => {
    if (url === "") {
      setAlertMessage(
        "Il faut choisir un site web à tester. Veuillez entrer un URL valide."
      );
      onOpen();
    } else if (!doFirstTest && !doSecondTest && !doThirdTest) {
      setAlertMessage("Veuillez sélectionner au moins un test");
      onOpen();
    } else if (!isValidHttpUrl(url)) {
      setAlertMessage("L'URL du site web doit être valide.");
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
          doThirdTest,
          htmlSelectorIdentifier,
          identifier,
          htmlSelectorPassword,
          password,
          thirdTestButtonName,
          thirdTestTextShown,
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
    total += testResults?.thirdTest != undefined && doThirdTest ? 1 : 0;

    succeeded +=
      testResults?.firstTest != undefined && testResults.firstTest ? 1 : 0;
    succeeded +=
      testResults?.secondTest != undefined && testResults.secondTest ? 1 : 0;
    succeeded +=
      testResults?.thirdTest != undefined && testResults.thirdTest ? 1 : 0;

    return (100 * succeeded) / total;
  };

  const getPercentageTestsSucceeded = () => {
    const percentageValue = calculatePercentageTestsSucceeded();
    return !isFinite(percentageValue) || isNaN(percentageValue)
      ? 0
      : percentageValue;
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
            <FormHelperText>
              Entrer l'URL du site web à tester (doit commencer par http:// ou
              https://)
            </FormHelperText>
          </FormControl>

          <VStack p="5" maxW="750px" borderWidth="2px" borderRadius={5}>
            <Checkbox
              isChecked={doFirstTest}
              onChange={(e) => setDoFirstTest(e.target.checked)}
              marginRight="auto"
            >
              <Heading as="h2" size="md" marginRight="auto !important">
                Cas #1 <Tag colorScheme="blue">Navigation</Tag>
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

          <VStack
            marginRight="auto !important"
            p="5"
            maxWidth="750px"
            borderWidth="2px"
            borderRadius={5}
          >
            <Checkbox
              isChecked={doSecondTest}
              onChange={(e) => setDoSecondTest(e.target.checked)}
              marginRight="auto"
            >
              <Heading as="h2" size="md" marginRight="auto !important">
                Cas #2 <Tag colorScheme="blue">Titre sur la page</Tag>
              </Heading>
            </Checkbox>
            <Text>
              Un élément de titre (H1 à H6) est présent dans la page et contient
              le texte suivant:{" "}
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

          <VStack
            marginRight="auto !important"
            p="5"
            borderWidth="2px"
            maxWidth="750px"
            borderRadius={5}
          >
            <Checkbox
              isChecked={doThirdTest}
              onChange={(e) => setDoThirdTest(e.target.checked)}
              marginRight="auto"
            >
              <Heading as="h2" size="md" marginRight="auto !important">
                Cas #3 <Tag colorScheme="blue">Authentification</Tag>
              </Heading>
            </Checkbox>
            <Tag>
              Un sélecteur HTML peut commencer par # ou . (Par exemple:
              #submitButton). Vous pouvez aussi ne rien mettre au début du sélecteur pour
              faire la recherche avec l'attribut 'name'
            </Tag>
            <HStack alignItems="end" marginRight="auto !important">
              <FormControl>
                <FormLabel>Sélecteur HTML de l'identifiant</FormLabel>
                <Input
                  borderColor={doThirdTest ? "blue.500" : "lightgray"}
                  isDisabled={!doThirdTest}
                  value={htmlSelectorIdentifier}
                  onChange={(e) => setHtmlSelectorIdentifier(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Identifiant</FormLabel>
                <Input
                  borderColor={doThirdTest ? "blue.500" : "lightgray"}
                  isDisabled={!doThirdTest}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </FormControl>
            </HStack>

            <HStack alignItems="end" marginRight="auto !important">
              <FormControl>
                <FormLabel>Sélecteur HTML du mot de passe</FormLabel>
                <Input
                  borderColor={doThirdTest ? "blue.500" : "lightgray"}
                  isDisabled={!doThirdTest}
                  value={htmlSelectorPassword}
                  onChange={(e) => setHtmlSelectorPassword(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Mot de passe</FormLabel>
                <Input
                  borderColor={doThirdTest ? "blue.500" : "lightgray"}
                  isDisabled={!doThirdTest}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
            </HStack>
            <VStack marginRight="auto !important">
              <FormControl>
                <FormLabel>Nom du bouton de connexion</FormLabel>
                <Input
                  borderColor={doThirdTest ? "blue.500" : "lightgray"}
                  isDisabled={!doThirdTest}
                  value={thirdTestButtonName}
                  onChange={(e) => setThirdTestButtonName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  Texte affiché suite à l'authentification réussie
                </FormLabel>
                <Input
                  borderColor={doThirdTest ? "blue.500" : "lightgray"}
                  isDisabled={!doThirdTest}
                  value={thirdTestTextShown}
                  onChange={(e) => setThirdTestTextShown(e.target.value)}
                />
              </FormControl>
            </VStack>
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
            Exécuter les tests
          </Button>

          {(testResults?.firstTest !== undefined ||
            testResults?.secondTest !== undefined ||
            testResults?.thirdTest !== undefined) && (
            <Box p="5" maxW="600px" borderWidth="2px" borderRadius={5}>
              <Flex align="baseline" mt={2} mb={3}>
                <HStack>
                  <Badge colorScheme="blue" fontSize="lg">
                    Résultats
                  </Badge>
                  <CircularProgress
                    value={getPercentageTestsSucceeded()}
                    size="50px"
                    color="green.400"
                  >
                    <CircularProgressLabel>
                      {getPercentageTestsSucceeded()}%
                    </CircularProgressLabel>
                  </CircularProgress>
                </HStack>
              </Flex>

              {doFirstTest && testResults?.firstTest != undefined && (
                <Text>
                  Cas #1{" "}
                  <Tag colorScheme="blue" size="sm">
                    Navigation
                  </Tag>
                  {testResults.firstTest ? (
                    <Tag colorScheme="green" size="sm" ml={2}>
                      Réussi <CheckIcon ml={2} />
                    </Tag>
                  ) : (
                    <Tag colorScheme="red" size="sm" ml={2}>
                      Non réussi <SmallCloseIcon ml={2} />
                    </Tag>
                  )}
                </Text>
              )}

              {doSecondTest && testResults?.secondTest != undefined && (
                <Text>
                  Cas #2{" "}
                  <Tag colorScheme="blue" size="sm">
                    Titre sur la page
                  </Tag>
                  {testResults.secondTest ? (
                    <Tag colorScheme="green" size="sm" ml={2}>
                      Réussi <CheckIcon ml={2} />
                    </Tag>
                  ) : (
                    <Tag colorScheme="red" size="sm" ml={2}>
                      Non réussi <SmallCloseIcon ml={2} />
                    </Tag>
                  )}
                </Text>
              )}

              {doThirdTest && testResults?.thirdTest != undefined && (
                <Text>
                  Cas #3{" "}
                  <Tag colorScheme="blue" size="sm">
                    Authentification
                  </Tag>
                  {testResults.thirdTest ? (
                    <Tag colorScheme="green" size="sm" ml={2}>
                      Réussi <CheckIcon ml={2} />
                    </Tag>
                  ) : (
                    <Tag colorScheme="red" size="sm" ml={2}>
                      Non réussi <SmallCloseIcon ml={2} />
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
