import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Stack,
  Button,
  Center,
  Spinner,
  SimpleGrid,
  Avatar,
  Text,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import './main.css';
import bgItems from '../Assets/Images/bg3.jpg';

const CharacterDetails = () => {
  // Extracting character id from URL params
  const { id } = useParams();

  // State to manage character details, movies, movie details, loading status, error, and navigation
  const [character, setCharacter] = useState(null);
  const [movies, setMovies] = useState([]);
  const [moviesDetails, setMoviesDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch character details when component mounts or id changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://swapi.dev/api/people/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch character details');
        }
        return response.json();
      })
      .then((data) => {
        setCharacter(data);
        setMovies(data.films);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  // Fetch movie details when movies array changes
  useEffect(() => {
    const fetchMoviesDetails = async () => {
      const details = await Promise.all(
        movies.map(async (movieUrl) => {
          try {
            const response = await fetch(movieUrl);
            if (!response.ok) {
              throw new Error('Failed to fetch movie details');
            }
            const data = await response.json();
            return data;
          } catch (error) {
            setError(error.message);
            setLoading(false);
          }
        })
      );
      setMoviesDetails(details);
    };

    if (movies.length > 0) {
      fetchMoviesDetails();
    }
  }, [movies]);

  // Helper function to create centered text items
  const centeredItems = (title, value) => {
    return (
      <Box p='10' h={70} rounded='md' textAlign='center'>
        <Text textShadow='1.5px 1px gray' m='2' noOfLines={1}>
          {title}
        </Text>
        <Text textShadow='1px 1px gray'>{value}</Text>
      </Box>
    );
  };

  return (
    <>
      <Box
        p={4}
        bgImage={`url(${bgItems})`}
        bgSize='cover'
        h='100%'
        minH='100vh'
        position='relative'
      >
        <Button
          mt={3}
          mb={3}
          onClick={() => navigate('/')}
          bgGradient='linear(to-r, #334d6e, #151515)'
          color='white'
          _hover={{
            transform: 'scale(1.05)',
            transition: '0.3s',
            boxShadow: 'dark-lg',
          }}
        >
          Back
        </Button>

        {loading ? (
          <Center p={240}>
            <Spinner size='xl' />
          </Center>
        ) : error ? (
          <Center p={240}>
            <Text color='blue' size='lg'>{error}</Text>
          </Center>
        ) : (
          <Stack spacing={4} >
            <Heading size='lg' color='white' pb={3}>
              Meet {character.name}
            </Heading>

            <Box
              p={4}
              borderRadius='xl'
              boxShadow='lg'
              bgGradient='linear(to-r, #2e918fd4, #37a369d4)'
              color='white'
              position='relative'
              bottom={5}
            >
              <Center>
                <Avatar
                  size={{ base: 'lg', md: 'xl', lg: '2xl' }}
                  name={character.name}
                  // src='https://bit.ly/ryan-florence'
                />
              </Center>
              <Center>
                <Heading mt={3} mb={1} fontSize='xl'>
                  {character.name}
                </Heading>
              </Center>

              <Box>
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

            <Box position='absolute' bottom={5} width='98%'>
              <Heading size='md' pb={2} color='white'>
                Movies:
              </Heading>
              <SimpleGrid
                bg='gray.50'
                templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
                gap={6}
                p={{ base: 5, md: 10 }}
                textAlign='center'
                rounded='lg'
                color='gray.700'
                overflowY='auto'
                maxH={{ base: 'auto', md: 60 }}
                boxShadow='xl'
                backgroundColor='#d3dce269'
                className='scrollable_gridbox'
              >
                {moviesDetails && moviesDetails.map((movie, index) => (
                  <Box
                    key={index}
                    p={6}
                    rounded='md'
                    bgGradient='linear(to-r, #334d6e, #151515)'
                    color='white'
                    _hover={{
                      transform: 'scale(1.05)',
                      transition: '0.3s',
                      boxShadow: 'dark-lg',
                    }}
                    cursor='pointer'
                  >
                    <Text fontSize='xl' fontWeight='bold'>
                      {movie.title}
                    </Text>
                    <Text>{`Director: ${movie.director}`}</Text>
                    <Text>{`Producer: ${movie.producer}`}</Text>
                    <Text>{`Released: ${movie.release_date}`}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Stack>
        )}
      </Box>
    </>
  );
};

export default CharacterDetails;
