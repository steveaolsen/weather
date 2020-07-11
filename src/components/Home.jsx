import React from 'react';

const Home = (props) => {
    return (
        <div>
            Current Temp: {props.temp}° Fahrenheit
            <br />
            Current Weather: <img src={`http://openweathermap.org/img/wn/${props.icon}@2x.png`} alt=""Weather Icon/>
        </div>
    );
}

export default Home;