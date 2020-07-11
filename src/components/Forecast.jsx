import React from 'react';

const Forecast = (props) => {
    return (
        <div>
            5 Day Forecast: in Fahrenheit
            <br />
            {props.forecastData.dates[0]}:{" "}Low: {props.forecastData.day1Low}°{" / "}High: {props.forecastData.day1High}°
            <br />
            {props.forecastData.dates[1]}:{" "}Low: {props.forecastData.day2Low}°{" / "}High: {props.forecastData.day2High}°
            <br />
            {props.forecastData.dates[2]}:{" "}Low: {props.forecastData.day3Low}°{" / "}High: {props.forecastData.day3High}°
            <br />
            {props.forecastData.dates[3]}:{" "}Low: {props.forecastData.day4Low}°{" / "}High: {props.forecastData.day4High}°
            <br />
            {props.forecastData.dates[4]}:{" "}Low: {props.forecastData.day5Low}°{" / "}High: {props.forecastData.day5High}°
        </div>
    );
}

export default Forecast;