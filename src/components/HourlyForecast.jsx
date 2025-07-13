import React from 'react';
import { weatherCodes } from '../constrants';


const HourlyForecast = ({hourlyWeather}) => {

  return (
    <div className="hourlyForecast-container">
      <h3 style={{ marginBottom: "1rem" }} >Hourly Forecast Data</h3>
      <ul className="weather-list">
        {hourlyWeather.map((hourlyWeather, index) => {
          const time = hourlyWeather.time.split(" ")[1].substring(0, 5);
          const weatherIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(hourlyWeather.condition.code));
          const condition = hourlyWeather.condition.text
          return(
          <li className="weather-item" key = {index}>
            <p className="time">{time}</p>
            <img src={`/icons/${weatherIcon}.svg`}  className="hourly-weatherIcon" />
            <p className="condition">{condition}</p>
            <p className="temp">{hourlyWeather.temp_c}°c</p>
          </li>)})
        }
      </ul>
    </div>
  )
}

export default HourlyForecast