import React, { useState, useEffect } from 'react';
import {
  Button, HStack, Box, Checkbox, Spinner, Avatar, Stack, Text, Tooltip, SimpleGrid, Center
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
          <Text
            as='h3'
            fontSize='xl'
            fontWeight='bold'
            textShadow='1.2px 1px gray'
            display='inline-block'
            animation='marquee 8s linear infinite'
            color='white'
          >
            CHARACTER TABLE
          </Text>
        </Center>

        <Box p={5} pt='5%'>

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
            <Box bgColor='white' position='relative' h='auto' minH={{ base: '60vh', md: '70vh' }} borderRadius='md' boxShadow='dark-lg'>

              {loadings ? (
                <Center p={{ base: 10, md: 250 }} minW={{ base: '85vw', md: '65vw' }}>
                  <Spinner size='xl' />
                </Center>
              ) : (
                <SimpleGrid columns={[2, 4, 5]} spacing={4} padding={{ base: 3, md: 15 }}>
                  {characters.map((character, ind) => (
                    <Tooltip key={character.name} label={`Click the ${character.name} to see the profile`} hasArrow>
                      <Box
                        bg='white'
                        p={4}
                        borderRadius='md'
                        boxShadow='dark-lg'
                        textAlign='center'
                      >
                        <Stack direction='column' spacing='24px'>
                        <Center>
                            
                            {ind % 2 === 0 && ind % 3 === 0
                                  ? <Avatar name={character.name} size='lg' />
                                  : <Avatar size='lg' src={`${ind % 2 === 0
                                    ? 'https://bit.ly/dan-abramov'
                                    : ind % 3 === 0
                                      ? 'https://bit.ly/sage-adebayo'
                                      : 'https://bit.ly/ryan-florence'}`} />
                                }
                          </Center>
                          <Text fontWeight='bold' pt={2} _hover={{ textShadow: '1px 1px gray' }}>
                            <Link to={`/characters/${character.url.split('/').slice(-2, -1)[0]}`}>
                              {character.name}
                            </Link>
                          </Text>
                          <Checkbox
                            colorScheme='orange'
                            borderColor='#f87501ba'
                            isChecked={favorites.some((fav) => fav.name === character.name)}
                            onChange={() => handleCheckboxChange(character)}
                            _hover={{ transform: 'scale(1.05)', transition: '0.3s', boxShadow: 'dark-lg' }}
                          >
                            Add to Favorites
                          </Checkbox>
                        </Stack>
                      </Box>
                    </Tooltip>
                  ))}
                </SimpleGrid>
              )}

              {loadings ? "" : (
                <HStack mt={4} spacing={2} justify='center' position='relative' bottom='2%' >
                  <Button
                    onClick={() => handlePageChange(page - 1)}
                    isDisabled={page === 1}
                    border='1px'
                    borderColor='#f87501ba'
                    bgGradient={page === 1 ? 'gray.200' : 'linear(to-r, #f2c996cf, #9f5019d4)'}
                  >
                    Previous
                  </Button>

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

                  <Button
                    onClick={() => handlePageChange(page + 1)}
                    isDisabled={page === totalPages}
                    border='1px'
                    borderColor='#f87501ba'
                    bgGradient={page === totalPages ? 'gray.200' : 'linear(to-r, #f2c996cf, #9f5019d4)'}
                  >
                    Next
                  </Button>
                </HStack>
              )}

            </Box>

           
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
