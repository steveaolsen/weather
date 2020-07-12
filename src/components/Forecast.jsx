import React from 'react';


const Forecast = (props) => {
    

    const iconMapper = (iconDay) => {
        let array = [];
        for (let i=0; i<iconDay.length; i++) {
            let url = `https://openweathermap.org/img/wn/${iconDay[i]}@2x.png`;
            array.push(<img src={url} alt="Weather Icon"/>);
        }
        return array;
    }
    
    return (
        <div>
            5 Day Forecast: in Fahrenheit
            <br />
            {props.forecastData.dates[0]}:{" "}Low: {props.forecastData.day1Low}°{" / "}High: {props.forecastData.day1High}°
            {iconMapper(props.forecastData.day1Icons)}
            <br />
            {props.forecastData.dates[1]}:{" "}Low: {props.forecastData.day2Low}°{" / "}High: {props.forecastData.day2High}°
            {iconMapper(props.forecastData.day2Icons)}
            <br />
            {props.forecastData.dates[2]}:{" "}Low: {props.forecastData.day3Low}°{" / "}High: {props.forecastData.day3High}°
            {iconMapper(props.forecastData.day3Icons)}
            <br />
            {props.forecastData.dates[3]}:{" "}Low: {props.forecastData.day4Low}°{" / "}High: {props.forecastData.day4High}°
            {iconMapper(props.forecastData.day4Icons)}
            <br />
            {props.forecastData.dates[4]}:{" "}Low: {props.forecastData.day5Low}°{" / "}High: {props.forecastData.day5High}°
            {iconMapper(props.forecastData.day5Icons)}
        </div>
    );
}

export default Forecast;