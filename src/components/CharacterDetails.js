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
import { useSelector } from 'react-redux';

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

  const img = useSelector((state) => { return state.img })

  let imgIndx = Object.values(img)[0];

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
      <Box p='2' textAlign='center'>
        <Text textShadow='1.5px 1px gray' m='2' noOfLines={1}>
          {title}
        </Text>
        <Text textShadow='1px 1px gray'>{value}</Text>
      </Box>
    );
  };

  return (
    <Box
      p={4}
      bgImage={`url(${bgItems})`}
      bgSize='cover'
      maxH='100dvh'
      overflowY='auto'
      overflowX='hidden'
      position='relative'
      className='charcterDetailsContainer'
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
          <Text color='blue' fontSize='lg'>
            {error}
          </Text>
        </Center>
      ) : (
        <Stack spacing={4}>
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
              {imgIndx % 2 === 0 && imgIndx % 3 === 0
                ? <Avatar name={character.name} size='lg' />
                : <Avatar size={{ base: 'md', md: 'lg' }}
                  mb={{ base: 2, md: 0 }} src={`${imgIndx % 2 === 0
                    ? 'https://bit.ly/dan-abramov'
                    : imgIndx % 3 === 0
                      ? 'https://bit.ly/sage-adebayo'
                      : 'https://bit.ly/ryan-florence'}`} />
              }
            </Center>
            <Center>
              <Heading mt={3} mb={1} fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>
                {character.name}
              </Heading>
            </Center>

            <Box>
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 4, lg: 7 }}
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

          <Box position='relative' bottom={5} width='98%'>
            <Heading size='md' pb={2} color='white'>
              Movies:
            </Heading>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
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
              {moviesDetails &&
                moviesDetails.map((movie, index) => (
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
                    <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight='bold'>
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
  );
};

export default CharacterDetails;
