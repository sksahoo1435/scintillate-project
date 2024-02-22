import React, { useState, useEffect } from 'react';
import {
  Button, HStack, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer,
  Heading, Center, Box, Checkbox, Spinner, Avatar, Stack, Text, Tooltip
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import './main.css'
import moviesBgImage from '../Assets/Images/setup_movie_bg.jpg';

const CharacterList = () => {
  // State for characters, page, total pages, loading status, and favorites
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadings, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  // Fetch characters when the page changes
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

  // Save favorites to local storage when favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handle page change when navigating through pages
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle checkbox change for marking/unmarking characters as favorites
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
      {/* Main Container with background image */}
      <Box bgImage={`url(${moviesBgImage})`} bgSize="cover" overflow='hidden' h='100dvh'>

        {/* Marquee Heading */}
        <Center h='50px'>
          <Heading as='h3' size='md' textShadow='1.2px 1px gray' display="inline-block" animation="marquee 8s linear infinite" color='white'>
            CHARACTER TABLE
          </Heading>
        </Center>

        <Box p={5}>
          <Center>
            {/* Tooltip and Table Container */}
            <Box position="absolute" left="0" bottom="65%">
              <Text
                className="scroll-rotate-animation"
                color="white"
                fontWeight="semibold"
                fontSize="xl"
                style={{ transform: "rotate(-90deg)" }}
              >
                The table includes character's name.
              </Text>
            </Box>

            {/* Character Table */}
            <TableContainer border='1.5px' borderColor='#00b6ffba' borderRadius='1rem' boxShadow='dark-lg' rounded='md' bg='white' w='60%' h='88dvh'>
              <Table variant="striped" size="md" colorScheme="purple">

                {/* Table Header */}
                <Thead>
                  <Tr h={50}>
                    <Th textShadow='1.2px 1px gray'>Character Name</Th>
                    <Th textShadow='1.2px 1px gray'>Favourite</Th>
                  </Tr>
                </Thead>

                {/* Table Body */}
                <Tbody style={{ overflowY: 'auto', maxHeight: '60vh' }}>
                  {loadings ?
                    <Center p={240}>
                      <Spinner size='xl' />
                    </Center> :
                    <>
                      {/* Map through characters to display in the table */}
                      {characters.map((character, ind) => (
                        <Tooltip label={`Click the ${character.name} to see the profile`} hasArrow>
                          <Tr key={character.name} _hover={{ fontWeight: 'semibold' }}>
                            <Td p={2}>
                              {/* Avatar and Character Name */}
                              <Stack direction={['column', 'row']} spacing='24px'>
                                {ind % 2 === 0 && ind % 3 === 0
                                  ? <Avatar name={character.name} size='sm' />
                                  : <Avatar size='sm' src={`${ind % 2 === 0
                                    ? 'https://bit.ly/dan-abramov'
                                    : ind % 3 === 0
                                      ? 'https://bit.ly/sage-adebayo'
                                      : 'https://bit.ly/ryan-florence'}`} />
                                }
                                <Text pt={1} _hover={{ textShadow: '1px 1px gray' }}>
                                  {/* Link to character details page */}
                                  <Link to={`/characters/${character.url.split('/').slice(-2, -1)[0]}`}>
                                    {character.name}
                                  </Link>
                                </Text>
                              </Stack>
                            </Td>

                            {/* Checkbox for marking/unmarking as favorite */}
                            <Td>
                              <Checkbox
                                colorScheme='orange'
                                borderColor="#f87501ba"
                                isChecked={favorites.some((fav) => fav.name === character.name)}
                                onChange={() => handleCheckboxChange(character)}
                                _hover={{ transform: 'scale(1.05)', transition: '0.3s', boxShadow: 'dark-lg' }}
                              />
                            </Td>
                          </Tr>
                        </Tooltip>
                      ))}
                    </>
                  }
                </Tbody>

                {/* Table Footer with Pagination */}
                <Tfoot position='relative'>
                  <Center p={2}>
                    <HStack mt={2} spacing={2} ml={20}>
                      {/* Previous Page Button */}
                      <Button onClick={() => handlePageChange(page - 1)} isDisabled={page === 1} border='1px' borderColor='#f87501ba' bgGradient={page === 1 ? 'gray.200' : 'linear(to-r, #f2c996cf, #9f5019d4)'}>
                        Previous
                      </Button>

                      {/* Page Buttons */}
                      {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                          key={index}
                          onClick={() => handlePageChange(index + 1)}
                          colorScheme={index + 1 === page ? 'orange' : 'gray'}
                          variant={index + 1 === page ? 'solid' : 'outline'}
                          borderColor='#f87501ba'
                        >
                          {index + 1}
                        </Button>
                      ))}

                      {/* Next Page Button */}
                      <Button onClick={() => handlePageChange(page + 1)} isDisabled={page === totalPages} border='1px' borderColor='#f87501ba' bgGradient={page === totalPages ? 'gray.200' : 'linear(to-r, #f2c996cf, #9f5019d4)'}>
                        Next
                      </Button>
                    </HStack>
                  </Center>
                </Tfoot>
              </Table>
            </TableContainer>

            {/* Tooltip for additional information */}
            <Box position="absolute" right="0" bottom="50%" top="10">
              <Text
                className="scroll-rotate-animation-bottom"
                color="white"
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
