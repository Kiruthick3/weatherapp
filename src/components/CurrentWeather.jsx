import React from 'react'

const CurrentWeather = ({ currentWeather }) => {
  return (
     <div className="weather-container">
        <div className="current-weather">
            <div className="weather-icon">
                <img src = {`/icons/${currentWeather.weatherIcon}.svg`} />
            </div>
            <h3 className="temprature">
                {currentWeather.temp} <span>°C</span>
            </h3>
            <p className="description">{currentWeather.desc}</p>
            <h2 className="cityName">{currentWeather.cityName}</h2>
            <h2 className="country">{currentWeather.coun}</h2>
            <div className="co-ord">
                <div>
                    <span className='lat-text'>latitude</span>
                    <span className="lat">{currentWeather.lat}</span>
                </div>
                <div>
                    <span className='long-text'>longitude</span>
                    <span className="long">{currentWeather.lon}</span>
                </div>
            </div>
            <div className="data-container">
                <div className="element">
                    <img src="/assets/humidity.png" className="humidity" />
                    <div className="data">
                        <span className="humi-per">{currentWeather.humidity}%</span>
                        <span className="humi-text">Humidity</span>
                    </div>
                </div>
                <div className="element">
                    <img src="/assets/sunrise.png" className="sunrise" />
                    <div className="data">
                        <span className="rise-time">{currentWeather.sunrise}</span>
                        <span className="risei-text">Sunrise</span>
                    </div>
                </div>
                <div className="element">
                    <img src="/assets/sunset.png" className="sunset" />
                    <div className="data">
                        <span className="rise-time">{currentWeather.sunset}</span>
                        <span className="rise-text">Sunset</span>
                    </div>
                </div>
                <div className="element">
                    <img src="/assets/wind.png" className="wind" />
                    <div className="data">
                        <span className="wind-speed">{currentWeather.wind}km/h</span>
                        <span className="wind-text">Wind speed</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CurrentWeather