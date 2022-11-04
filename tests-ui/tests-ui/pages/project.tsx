import {Container, FormControl, FormHelperText, FormLabel, Heading, Input, VStack} from "@chakra-ui/react";

const Project = () => {
    return (
        <VStack p={10}>
            <Container>
                <Heading>Créer un nouveau Projet</Heading>
                <VStack>
                    <FormControl>
                        <FormLabel>Nom</FormLabel>
                        <Input />
                        <FormHelperText>Le nom du projet</FormHelperText>
                    </FormControl>
                </VStack>
            </Container>
        </VStack>

    )
};

export default Project;