import {Button, Container, FormControl, FormHelperText, FormLabel, Heading, Input, VStack} from "@chakra-ui/react";

const Project = () => {
    return (
        <VStack p={10}>
            <Container>
                <Heading>Créer un nouveau Projet</Heading>
                <VStack>
                    <FormControl>
                        <FormLabel>Nom</FormLabel>
                        <Input />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Responsable du projet</FormLabel>
                        <Input />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Date de début</FormLabel>
                        <Input type="date"/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Date de fin</FormLabel>
                        <Input type="date"/>
                    </FormControl>
                    <Button colorScheme='blue'>Soumettre</Button>
                </VStack>
            </Container>
        </VStack>

    )
};

export default Project;