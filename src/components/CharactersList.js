import React, { useState, useEffect } from 'react';
import { Button, HStack, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, Heading, Center, Box, Checkbox, Spinner, Avatar, Stack, Text, Tooltip } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import './main.css'

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadings, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  useEffect(() => {
    setLoading(true);
    fetch(`https://swapi.dev/api/people/?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        setCharacters(data.results);
        setTotalPages(Math.ceil(data.count / 10));
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleCheckboxChange = (character) => {

    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav.name === character.name);
      return isFavorite
        ? prevFavorites.filter((fav) => fav.name !== character.name)
        : [...prevFavorites, character];
    });
  };

  return (
    <>
      <Box bgGradient='linear(45deg, #e7dfdf, transparent)' overflow='hidden'>
        <Center h='50px'>
          <Heading as='h3' size='md' textShadow='1.2px 1px gray'
            display="inline-block"
            animation="marquee 8s linear infinite" color='black'>CHARACTER TABLE</Heading>
        </Center>

        <Box p={5}>

          <Center >
            <Box position="absolute" left="0" bottom="65%">
              <Text
                className="scroll-rotate-animation"
                color="black"
                fontWeight="semibold"
                fontSize="xl"
                style={{ transform: "rotate(-90deg)" }}
              >
                The table includes character's name.
              </Text>
            </Box>

            <TableContainer border='1px' borderColor='gray.200' borderRadius='1rem' boxShadow='dark-lg' rounded='md' bg='white' w='60%'>
              <Table variant="striped" size="md" colorScheme="purple">

                <Thead>
                  <Tr h={50}>
                    <Th textShadow='1.2px 1px gray'>Character Name</Th>
                    <Th textShadow='1.2px 1px gray'>Favourite</Th>
                  </Tr>
                </Thead>

                {loadings ?
                  <Center p={240}>
                    <Spinner size='xl' />
                  </Center> :

                  <Tbody>
                    {characters.map((character) => (
                      <Tooltip label={`Click the ${character.name} to see the profile`} hasArrow >
                        <Tr key={character.name} _hover={{ fontWeight: 'semibold' }}>
                          <Td p={2}>
                            <Stack direction={['column', 'row']} spacing='24px'>
                              <Avatar size='sm' name={character.name} p={2} />

                              <Text pt={1} _hover={{ textShadow: '1px 1px gray' }}>
                                <Link to={`/characters/${character.url.split('/').slice(-2, -1)[0]}`} >
                                  {character.name}
                                </Link>
                              </Text>
                            </Stack>
                          </Td>

                          <Td>
                            <Checkbox
                              colorScheme='purple'
                              borderColor="blue"
                              isChecked={favorites.some((fav) => fav.name === character.name)}
                              onChange={() => handleCheckboxChange(character)}
                            />
                          </Td>
                        </Tr>
                      </Tooltip>

                    ))}
                  </Tbody>}

                <Tfoot>
                  <Center p={2}>
                    <HStack mt={2} spacing={2}>
                      <Button onClick={() => handlePageChange(page - 1)} isDisabled={page === 1} border='1px' borderColor='#00b6ffba'>
                        Previous
                      </Button>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                          key={index}
                          onClick={() => handlePageChange(index + 1)}
                          colorScheme={index + 1 === page ? 'teal' : 'gray'}
                          variant={index + 1 === page ? 'solid' : 'outline'}
                          borderColor='#00b6ffba'
                        >
                          {index + 1}
                        </Button>
                      ))}
                      <Button onClick={() => handlePageChange(page + 1)} isDisabled={page === totalPages} border='1px' borderColor='#00b6ffba'>
                        Next
                      </Button>
                    </HStack>
                  </Center>
                </Tfoot>

              </Table>
            </TableContainer>

            <Box position="absolute" right="0" bottom="50%" top="10">
              <Text
                className="scroll-rotate-animation-bottom"
                color="black"
                fontWeight="semibold"
                fontSize="xl"
                style={{ transform: "rotate(-90deg)" }}
              >
                It also includes their details.
              </Text>
            </Box>

          </Center>

        </Box>

      </Box>
    </>
  );
};

export default CharacterList;

