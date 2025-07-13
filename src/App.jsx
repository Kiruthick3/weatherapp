import  { useState, useEffect, useRef } from 'react'
import './app.css'
import SearchSection from './components/SearchSection';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import { weatherCodes } from './constrants';
import LoadingSection from './components/LoadingSection';
import NoResult from './components/NoResult';


function App() {
  const [backgroundVideo, setBackgroundVideo] = useState('');
  const [currentWeather, setCurrentWeather] = useState({});
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);
  const API_KEY = import.meta.env.VITE_API_KEY;
  const searchRef = useRef();

  const filterHourlyForecast = (hourlyData) => {
    const currentHour = new Date().setMinutes(0, 0, 0);
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;

    const next24HoursData = hourlyData.filter( ({time}) => {
      const forecastTime = new Date(time).getTime();
      return forecastTime >= currentHour && forecastTime <= next24Hours;
    });
    setHourlyForecast(next24HoursData);
  }

  const getWeatherDetails = async (url) =>{
    setLoading(true);
    setCityNotFound(false);
    try {
      const res = await fetch(url);
      if(!res.ok) throw new Error();
      const data = await res.json();
      console.log(data);
      
      const weatherData = {
        temp: data.current.temp_c,
        desc: data.current.condition.text,
        cityName: data.location.name,
        coun: data.location.country,
        lon: data.location.lon,
        lat: data.location.lat,
        humidity: data.current.humidity,
        wind: data.current.wind_kph,
        sunrise: data.forecast.forecastday[0].astro.sunrise,
        sunset: data.forecast.forecastday[0].astro.sunset,
        weatherIcon: Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(data.current.condition.code)),
      };
      setCurrentWeather(weatherData);

      const video = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(data.current.condition.code)) || "default";
      setBackgroundVideo(video);

      const combinedHourlyData = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour];

      filterHourlyForecast(combinedHourlyData);

      const dailyData = data.forecast.forecastday.map(forecast => ({
        date: forecast.date,
        maxTemp: forecast.day.maxtemp_c,
        minTemp: forecast.day.mintemp_c,
        condition: forecast.day.condition.text,
        icon: Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(forecast.day.condition.code)),
        fullDay: forecast,
      }));

      setDailyForecast(dailyData);
      console.log(dailyData)

    } catch {
      setCityNotFound(true);
    } finally{
      setLoading(false);
    }
  }

  const handleLocationSearch = () =>{ 
      navigator.geolocation.getCurrentPosition(
        (position) =>{
          const {latitude, longitude} = position.coords;
          const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=10`;
          getWeatherDetails(url);
          if (searchRef.current) {
            searchRef.current.clearInput();
            searchRef.current.clearSuggestion();
            searchRef.current.clearHoveredSuggestion();
          }
          console.log(position)
        },
        () =>{
          alert("Location access denied! Please enable the permission");
        },
        {
          enableHighAccuracy: true,    
          timeout: 10000,              
          maximumAge: 0                 
        }
      );
    };

  useEffect(  ()=>{
    setLoading(true);
    handleLocationSearch();
  }, []);
  return (
    <>
      <div className="container">
        {backgroundVideo && (
          <video
            className="background-video"
            autoPlay
            muted
            loop
            playsInline
            key={backgroundVideo}
          >
            <source src={`/assets/${backgroundVideo}.mp4`} type="video/mp4" />
          </video>
        )}
        <SearchSection ref={searchRef} getWeatherDetails={getWeatherDetails} locationSearch={handleLocationSearch}/>
        {!loading && !cityNotFound && <>
          <CurrentWeather currentWeather={currentWeather}/>
          <HourlyForecast hourlyWeather = {hourlyForecast}/> 
          <DailyForecast forecast={dailyForecast} />
        </>}
        {loading && <LoadingSection/>}
        {cityNotFound && <NoResult/>}
      </div>
    </>
  )
}

export default App