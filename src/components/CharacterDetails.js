import React, { useState, useEffect } from 'react';
import { Box, Heading, Stack, Button, Center, Spinner, SimpleGrid, Avatar, Text } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

const CharacterDetails = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`https://swapi.dev/api/people/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setCharacter(data);
        setMovies(data.films);
      });
  }, [id]);

  const centeredItems = (title, value) => {
    return (
      <Box p='10' h={70} rounded='md'>
        <Center><Text textShadow='1px 1px gray' m='2' noOfLines={1}>{title}</Text></Center>
        <Center><Text textShadow='1px 1px gray' >{value}</Text></Center>
      </Box>
    )
  }

  return (
    <>

      <Box p={4} bgGradient='linear(45deg, #e7dfdf, transparent)' h='100dvh'>
        <Button mt={3} mb={3} onClick={() => navigate('/')} bgGradient='linear(to-r, #abc2e9cf, #141414d4)' color='#000000'>
          Back
        </Button>

        {character ? (
          <>

            <Stack spacing={4}>
              <Heading size="md">About me:</Heading>
              <Box h={{ base: 60, sm: 370, md: 400, lg: 80 }} border='1px' borderColor='gray.200' borderRadius='1rem' boxShadow='2xl' rounded='md'>

                <Box>
                  <Center pt={5}>
                    <Avatar size='lg' name={character.name} p={10} />
                  </Center>
                  <Center>
                    <Heading mb={3} color='gray.400'>{character.name}</Heading>
                  </Center>

                </Box>

                <Box >
                  <SimpleGrid
                    columns={{ base: 1, sm: 4, md: 5, lg: 7 }}
                    spacing={{ base: 4, md: 6 }}
                    p={{ base: 3, md: 5 }}
                  >

                    {centeredItems('Height', character.height)}
                    {centeredItems('Weight', character.mass)}
                    {centeredItems('Gender', character.gender)}
                    {centeredItems('Hair Color', character.hair_color)}
                    {centeredItems('Skin Color', character.skin_color)}
                    {centeredItems('Eye Color', character.eye_color)}
                    {centeredItems('Born', character.birth_year)}

                  </SimpleGrid>
                </Box>

              </Box>

              <Box>
                <Heading size="md" pb={5}>Movies:</Heading>
                <SimpleGrid bg='gray.50'
                  templateColumns="repeat(3, 1fr)" gap={6} p={15}
                  textAlign='center'
                  rounded='lg'
                  color='gray.400'
                  overflowY='auto'
                  maxH={60}
                  boxShadow='2xl'>
                  {movies.map((movie, index) => (
                    <Box boxShadow='2xl' pt={5} pb={5} h={70} rounded='md'
                      bgGradient='linear(to-r, #abc2e9cf, #141414d4)' key={index} color='#000000'
                      _hover={{ boxShadow: 'dark-lg' }}
                      cursor='pointer'>{movie}</Box>
                  ))}
                </SimpleGrid>
              </Box>
            </Stack>
          </>
        ) : (
          <Center p={240}>
            <Spinner size='xl' />
          </Center>
        )}
      </Box>
    </>

  );
};

export default CharacterDetails;
