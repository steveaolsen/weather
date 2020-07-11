import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from 'axios';

import './App.css';
import Nav from './components/Nav';
import Home from './components/Home';
import Forecast from './components/Forecast';

export default class App extends Component {

  state = {
    city: "Royal Oak",
    region: "MI",
    country: "US",
    tempF: null,
    iocn: null,
    dates: [],
    day1High: null,
    day1Low: null,
    day1Icon: null,
    day2High: null,
    day2Low: null,
    day2Icon: null,
    day3High: null,
    day3Low: null,
    day3Icon: null,
    day4High: null,
    day4Low: null,
    day4Icon: null,
    day5High: null,
    day5Low: null,
    day5Icon: null
  }

  handleCity = (event) => {
    this.setState({ city: event.target.value });
  }

  handleRegion = (event) => {
    this.setState({ region: event.target.value });
  }

  handleCountry = (event) => {
    this.setState({ country: event.target.value });
  }

  getWeather = () => {
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${this.state.city},${this.state.region},${this.state.country}&units=imperial&appid=bca2acfb99955947a148c60251369cf9`)
    .then(res => {
      this.setState({ 
        tempF: res.data.main.temp,
        icon: res.data.weather[0].icon
      });
    })
    .catch(err => console.log(err))

    axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${this.state.city},${this.state.region},${this.state.country}&units=imperial&appid=bca2acfb99955947a148c60251369cf9`)
    .then(res => {
      console.log(res.data.list);//all day results by 3 hr intervals
      let allDates = [];//empty array, we'll push unique dates into this with the for loop below
      for (let i=0; i<40; i++) {
        let individualDate = res.data.list[i].dt_txt.substring(0, 10);
        if (!allDates.includes(individualDate)) {
          allDates.push(individualDate);
        }
      }
      allDates.shift();//we end up with 6 days and requirement is for next 5 days, so remove the fist one
      let day1Temps = [], day2Temps = [], day3Temps = [], day4Temps = [], day5Temps = [];
      for (let j=0; j<40; j++) {
        if (res.data.list[j].dt_txt.startsWith(allDates[0])) {
          //push all highs and lows for day 1 into day1Temps
          day1Temps.push(res.data.list[j].main.temp_max);
          day1Temps.push(res.data.list[j].main.temp_min);
        }
        if (res.data.list[j].dt_txt.startsWith(allDates[1])) {
          //push all highs and lows for day 2 into day2Temps
          day2Temps.push(res.data.list[j].main.temp_max);
          day2Temps.push(res.data.list[j].main.temp_min);
        }
        if (res.data.list[j].dt_txt.startsWith(allDates[2])) {
          //push all highs and lows for day 3 into day3Temps
          day3Temps.push(res.data.list[j].main.temp_max);
          day3Temps.push(res.data.list[j].main.temp_min);
        }
        if (res.data.list[j].dt_txt.startsWith(allDates[3])) {
          //push all highs and lows for day 4 into day4Temps
          day4Temps.push(res.data.list[j].main.temp_max);
          day4Temps.push(res.data.list[j].main.temp_min);
        }
        if (res.data.list[j].dt_txt.startsWith(allDates[4])) {
          //push all highs and lows for day 5 into day5Temps
          day5Temps.push(res.data.list[j].main.temp_max);
          day5Temps.push(res.data.list[j].main.temp_min);
        }
      }
      //now we have to sort thru these arrays and figure out the high and low for daily temps.
      //the requirement is highs and lows per day but the API (free one) gives you several highs and lows
      // for each day (one every 3 hours). this will get us the results we are looking for.
      let day1High = Math.max(...day1Temps); let day1Low = Math.min(...day1Temps);
      let day2High = Math.max(...day2Temps); let day2Low = Math.min(...day2Temps);
      let day3High = Math.max(...day3Temps); let day3Low = Math.min(...day3Temps);
      let day4High = Math.max(...day4Temps); let day4Low = Math.min(...day4Temps);
      let day5High = Math.max(...day5Temps); let day5Low = Math.min(...day5Temps);
      //now lets update state
      this.setState({
        dates: [...allDates],
        day1High: day1High,
        day1Low: day1Low,
        day2High: day2High,
        day2Low: day2Low,
        day3High: day3High,
        day3Low: day3Low,
        day4High: day4High,
        day4Low: day4Low,
        day5High: day5High,
        day5Low: day5Low
      });
      //now to figure out the weather icons. there are several weather icons per day on the 5 day API, unlike the
      // temperatures, there will be no way to compare the images or average the images. for example, a day could
      // be rainy in the AM but sunny in the PM. should I show 2 logos? no i don't think so. I think a good
      // comprimise for this requirement would be to add the icon that matches the high temp of the day. this 
      // should be around noon and would be a good indicator of the weather for that day. aside from writing 
      // an advanced algorithm to iterate theu and figure out the icons, this is the next best thing.

    })
    .catch(err => console.log(err));
  }

  componentDidMount = () => {
    this.getWeather();
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Nav /> 
            Your City: {this.state.city},{" "}{this.state.region},{" "}{this.state.country} 
            <div className="d-flex flex-column mx-auto">
            <div>
                <label htmlFor="city">City:</label>
                <input type="text" id="city" onChange={this.handleCity}></input>
            </div>
            <div>
                <label htmlFor="region">Region:</label>
                <input type="text" id="region" onChange={this.handleRegion}></input>
            </div>
            <div>
                <label htmlFor="country">Country:</label>
                <input type="text" id="country" onChange={this.handleCountry}></input>
            </div>
            <div>
                <button onClick={this.getWeather}>
                  Check Weather
                </button>
            </div>
        </div>
            <Switch>
              <Route path="/" exact component={() => <Home temp={this.state.tempF} icon={this.state.icon} />} />
              <Route path="/Forecast" exact component={() => <Forecast forecastData={this.state}/>} />
            </Switch>
        </Router>
      </div>
    );
  }
}