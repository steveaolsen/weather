import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from 'axios';

import './App.css';
import Nav from './components/Nav';
import Home from './components/Home';
import Forecast from './components/Forecast';

export default class App extends Component {

  state = {
    city: null,
    region: null,
    country: null,
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
    day5Icon: null,
    showResults: false,
    showError: false,
    error: null
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

    this.setState({ showError: false });

    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.city},${this.state.region},${this.state.country}&units=imperial&appid=bca2acfb99955947a148c60251369cf9`)
    .then(res => {
      this.setState({ 
        tempF: res.data.main.temp,
        icon: res.data.weather[0].icon
      });
      this.setState({ showResults: true });
    })
    .catch(err => {
      this.setState({ error: err, showError: true});
      console.log(err);
    });

    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${this.state.city},${this.state.region},${this.state.country}&units=imperial&appid=bca2acfb99955947a148c60251369cf9`)
    .then(res => {
      let allDates = [];//empty array, we'll push unique dates into this with the for loop below
      for (let i=0; i<40; i++) {
        let individualDate = res.data.list[i].dt_txt.substring(0, 10);
        if (!allDates.includes(individualDate)) {
          allDates.push(individualDate);
        }
      }
      let day1Temps = [], day2Temps = [], day3Temps = [], day4Temps = [], day5Temps = [], day6Temps = [];
      for (let j=0; j<40; j++) {
        //push all highs and lows for day[x] into day[x]Temps
        if (res.data.list[j].dt_txt.startsWith(allDates[0])) {
          day1Temps.push(res.data.list[j].main.temp_max);
          day1Temps.push(res.data.list[j].main.temp_min);
        }
        if (res.data.list[j].dt_txt.startsWith(allDates[1])) {
          day2Temps.push(res.data.list[j].main.temp_max);
          day2Temps.push(res.data.list[j].main.temp_min);
        }
        if (res.data.list[j].dt_txt.startsWith(allDates[2])) {
          day3Temps.push(res.data.list[j].main.temp_max);
          day3Temps.push(res.data.list[j].main.temp_min);
        }
        if (res.data.list[j].dt_txt.startsWith(allDates[3])) {
          day4Temps.push(res.data.list[j].main.temp_max);
          day4Temps.push(res.data.list[j].main.temp_min);
        }
        if (res.data.list[j].dt_txt.startsWith(allDates[4])) {
          day5Temps.push(res.data.list[j].main.temp_max);
          day5Temps.push(res.data.list[j].main.temp_min);
        }
        if (res.data.list[j].dt_txt.startsWith(allDates[5])) {
          day6Temps.push(res.data.list[j].main.temp_max);
          day6Temps.push(res.data.list[j].main.temp_min);
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
      this.setState({ showResults: true });
    })
    .catch(err => {
      this.setState({ error: err, showError: true});
      console.log(err);
    });
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Nav /> 
            <div className="d-flex flex-column mx-auto my-2">
            <div>
                <label htmlFor="city" className="col">City:</label>
                <input type="text" id="city" onChange={this.handleCity}></input>
            </div>
            <div>
              <label htmlFor="region" className="col">State/Region:</label>
                <input type="text" id="region" onChange={this.handleRegion}></input>
            </div>
            <div>
                <label htmlFor="country" className="col">Country:</label>
                <input type="text" id="country" onChange={this.handleCountry}></input>
            </div>
            <div>
                <button className="my-2" onClick={this.getWeather}>
                  Check Weather
                </button>
            </div>
        </div>
            {this.state.showError && (
              <div>ERROR: </div>
            )}
            {this.state.showResults && (
            <Switch>
              <Route path="/" exact component={() => <Home temp={this.state.tempF} icon={this.state.icon} />} />
              <Route path="/Forecast" exact component={() => <Forecast forecastData={this.state} />} />
            </Switch>
            )}
        </Router>
      </div>
    );
  }
}