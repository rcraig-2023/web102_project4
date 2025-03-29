import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [dogData, setDogData] = useState(null);
  const [banList, setBanList] = useState([]);
  const [breeds, setBreeds] = useState([]);

  const fetchBreeds = async () => {
    try {
      const response = await fetch('https://api.thedogapi.com/v1/breeds', {
        headers: {
          'x-api-key': 'live_xJkFKUf1prEyariE75Le6PZiI8Il15PCMpqEoZuNQlcRuJa9sb7OfQROxZrzD3Al',
        },
      });
      const data = await response.json();
      setBreeds(data);
    } catch (error) {
      console.error('Error fetching breeds:', error);
    }
  };

  const fetchRandomDog = async () => {
    try {
      let dog;
      let attempts = 0;
      const maxAttempts = 10;

      while (!dog && attempts < maxAttempts) {
        const randomIndex = Math.floor(Math.random() * breeds.length);
        const selectedBreed = breeds[randomIndex];

        if (
          !banList.includes(selectedBreed.name) &&
          !banList.includes(selectedBreed.temperament) &&
          !banList.includes(selectedBreed.life_span)
        ) {
          const response = await fetch(
            `https://api.thedogapi.com/v1/images/search?breed_ids=${selectedBreed.id}`,
            {
              headers: {
                'x-api-key': 'live_xJkFKUf1prEyariE75Le6PZiI8Il15PCMpqEoZuNQlcRuJa9sb7OfQROxZrzD3Al',
              },
            }
          );
          const data = await response.json();

          if (data && data.length > 0) {
            dog = { ...selectedBreed, url: data[0].url };
          }
        }
        attempts++;
      }

      if (dog) {
        setDogData(dog);
      } else {
        console.error('Could not find a dog that does not match ban list.');
      }
    } catch (error) {
      console.error('Error fetching dog data:', error);
    }
  };

  const addToBanList = (attribute) => {
    if (!banList.includes(attribute)) {
      setBanList([...banList, attribute]);
    }
  };

  const removeFromBanList = (attribute) => {
    setBanList(banList.filter((item) => item !== attribute));
  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  useEffect(() => {
    if (breeds.length > 0) {
      fetchRandomDog();
    }
  }, [breeds]);

  return (
    <div className="App">
      <h1>Veni Vici! - Dog Edition</h1>
      <button onClick={fetchRandomDog}>Discover!</button>
      {dogData && (
        <div>
          <img src={dogData.url} alt="Random Dog" style={{ maxWidth: '300px' }} />
          <p>Breed: <span onClick={() => addToBanList(dogData.name)}>{dogData.name}</span></p>
          <p>Temperament: <span onClick={() => addToBanList(dogData.temperament)}>{dogData.temperament}</span></p>
          <p>Life Span: <span onClick={() => addToBanList(dogData.life_span)}>{dogData.life_span}</span></p>
        </div>
      )}
      <div>
        <h2>Ban List:</h2>
        <ul>
          {banList.map((item, index) => (
            <li key={index} onClick={() => removeFromBanList(item)}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;