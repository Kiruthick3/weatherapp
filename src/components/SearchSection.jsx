import  { forwardRef, useImperativeHandle, useState, useRef } from 'react'
import { IoMdSearch } from "react-icons/io";
import { BiCurrentLocation } from "react-icons/bi";

const SearchSection = forwardRef(({getWeatherDetails, locationSearch},ref) => {
  const [text,setText] = useState("");
  const [hoveredText, setHoveredText] = useState("");
  const [citySuggestion,setCitySuggestion] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimer = useRef(null);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useImperativeHandle(ref, ()=>({
    clearInput: () => setText(""),
    clearSuggestion: () => setCitySuggestion([]),
    clearHoveredSuggestion: () => setHoveredText(""),
  }));

  const handleSearch= async() =>{
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${text}&days=10`;
    getWeatherDetails(url);
    setHoveredText("");
    setCitySuggestion([]);
    setText("");
  }

  const handleSearchCity = (e) =>{
    e.preventDefault();
    const searchInput = e.target.value;
    setText(searchInput);
    setHoveredText("");

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout( async () =>{
      if (searchInput.length > 2){
        try{
          const suggestionUrl = `http://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${searchInput}`

          const res = await fetch(suggestionUrl);
          const data = await res.json();
          console.log(data);
          setCitySuggestion(data)
          
        }catch (error){
          setCitySuggestion([]);
        }
      } else {
        setCitySuggestion([]);
      }
    }, 500);
    console.log(text)
  };

  
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = prev < citySuggestion.length - 1 ? prev + 1 : 0;
        setHoveredText(citySuggestion[next]?.name || "");
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : citySuggestion.length - 1;
        setHoveredText(citySuggestion[next]?.name || "");
        return next;
      });
    } else if (e.key === "Enter") {
      if (citySuggestion.length && selectedIndex >= 0) {
        const selectedCity = citySuggestion[selectedIndex];
        setText(selectedCity.name);
        const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${selectedCity.name}&days=10`;
        getWeatherDetails(url);
        setCitySuggestion([]);
        setHoveredText("");
        setText('');
        setSelectedIndex(-1);
      } else {
        handleSearch();
        setCitySuggestion([]);
      }
      e.preventDefault(); 
      
    }
  };

  const handleIconSearch = () =>{
    handleSearch();
    setText("");
  };

  const handleSelectSuggestion = (city) =>{
    setText(city.name);
    setCitySuggestion([]);
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city.name}&days=10`;
    getWeatherDetails(url);
    setText("");
    setHoveredText('');
  }

  


  return (
    <>
      <div className="input-container">
          <div className="input-group">
            <input type="search" className='cityInput' placeholder='Search City' onChange={handleSearchCity} onKeyDown={handleKeyDown} value={hoveredText || text} required />
            <div className="search-Icon" onClick={handleIconSearch}><IoMdSearch /></div>
          </div>
          <div className="location-container" onClick={()=>locationSearch()}><BiCurrentLocation /></div>
      </div>
      <div className='citySuggestion-container'>
        {citySuggestion.length > 0 && (
            <ul className="city-suggestion">
              {citySuggestion.map((city,index) => (
                <li key = {index} className={index === selectedIndex ? "selected" : ""} onClick = {() => handleSelectSuggestion(city)}>{city.name}, {city.country}</li>
              ))}
            </ul>
          )}
      </div>
    </>
  )
})

export default SearchSection