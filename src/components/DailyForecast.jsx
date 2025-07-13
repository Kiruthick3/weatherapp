import  {useState} from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,Legend } from 'recharts';
import { weatherCodes } from '../constrants';

const DailyForecast = ({ forecast }) => {
    
    const today = new Date().toISOString().split('T')[0];
    const todayData = forecast.find(day => day.date === today) || forecast[0];
    
    const [selectedDay, setSelectedDay] = useState(todayData?.date); 
    const [hourlyDataForDay, setHourlyDataForDay] = useState(todayData?.fullDay.hour || []);
    const [astroData, setAstroData] = useState(todayData?.fullDay.astro || null);
    const [feelsLike,setFeelsLike] = useState(false);

    const handleDayClick = (dayData) => {
        setSelectedDay(dayData.date);
        setHourlyDataForDay(dayData.hour);
        setAstroData(dayData.astro);
    };

    const data = hourlyDataForDay.map(hour => ({
        time: hour.time.split(" ")[1].substring(0, 5),
        temperature: hour.temp_c,
        feelslike: hour.feelslike_c,
        icon: Object.keys(weatherCodes).find(icon =>  weatherCodes[icon].includes(hour.condition.code)),
    }));

    const CustomTick = ({ x, y, payload }) => {
        const { value } = payload;
        const point = data.find(p => p.time === value);
        if (!point) return null;

        return (
            <g transform={`translate(${x}, ${y - 55})`}>
                <image href={`/icons/${point.icon}.svg`} x={-12} y={0} height={24} width={24}/>
                <text x={0} y={35} fill="#fff" fontSize={12} textAnchor="middle">
                    {Math.floor(point.temperature)}°C
                </text>
                <text x={0} y={50} fill="#fff" fontSize={10} textAnchor="middle">
                    {payload.value}
                </text>
            </g>
        );
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
          const { time, temperature, feelslike, icon } = payload[0].payload;
      
          return (
            <div
              style={{
                background: "#2c314dc7",
                padding: "8px",
                borderRadius: "6px",
                color: "#fff",
                textAlign: "center",
                border: "1px solid #ccc"
              }}
            >
              <p style={{ marginBottom: "4px" }}>{time}</p>
              <img
                src={`/icons/${icon}.svg`}
                alt="weather icon"
                style={{ width: 24, height: 24, marginBottom: "4px" }}
              />
              <p>{Math.floor(temperature)}°C</p>
              {feelsLike && (
                <p>Feels like: {Math.round(feelslike)}°C</p>
                )}
            </div> );
        }
      
        return null;
      };
      
    return (
        <div className="dailyForecast-container">

            <h3 style={{ marginBottom: "1rem" }} >Daily Forecast Data</h3>
            
            <ul className="daily-list">
                {forecast.map((day, index) => {
                    const days = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                    return(
                        <li key={index} className="daily-item" onClick={() => handleDayClick(day.fullDay)}>
                            <p className="day">{days}</p>
                            <img src={`/icons/${day.icon}.svg`} alt={day.condition} className="daily-icon" />
                            <p className="condition">{day.condition}</p>
                            <p className="temp">↑ {day.maxTemp}°C</p>
                            <p className="temp"> ↓ {day.minTemp}°C</p>
                        </li>
                    )
                })}
            </ul>

            {selectedDay && (
                <>
                    <h3 className='graph-heading' > {new Date(selectedDay).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                    <div className="chart-container">
                    <div className='feelslike-container'>
                        <span>feels like</span>
                        <input type="checkbox" id="check" className='toggle-checkbox' checked = {feelsLike} onChange={(e) => setFeelsLike(e.target.checked)}/>
                        <label htmlFor="check" className="toggle-btn"></label>
                    </div>
                        <div style={{ border: '1px solid #2c314d', padding: '10px', borderRadius: '8px' }}>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart  data={data} margin={{ top: 40, right: 0, bottom: 0, left: 0 }} >
                                    <XAxis dataKey="time" stroke="#fff" fontSize={10}  orientation = "top" tick ={<CustomTick/>}/>
                                    <YAxis tickCount={8} stroke="#fff" fontSize={10} domain={['dataMin - 3', 'dataMax + 5']}/>
                                    <Tooltip content={<CustomTooltip feelsLike = {feelsLike} />}/>
                                    <Legend />
                                    <CartesianGrid stroke="#2c314d" />
                                    <Line type="monotone" dataKey="temperature" stroke="#fff" strokeWidth={2} dot={{ r: 0 }}/>
                                    {feelsLike && <Line type="monotone" dataKey="feelslike" stroke="#ffffff7a" strokeWidth={2} dot={{ r: 0 }}/>}
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="chart-footer">
                                <p><img src="/assets/sunrise.png" className="sunrise" /> {astroData.sunrise} </p>
                                <p><img src="/assets/sunset.png" className="sunset" /> {astroData.sunset}</p>
                                <p><img src="/assets/moon.png" className="moonPhase" /> Moon phase: {astroData.moon_phase} </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DailyForecast;
