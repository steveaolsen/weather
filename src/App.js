
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from 'axios';

import './App.css';
import Nav from './components/Nav';
import Home from './components/Home';
import Forecast from './components/Forecast';
import countryCodes from './data/countryCodes';

export default class App extends Component {

  state = {
    city: null,
    region: null,
    country: "us",
    tempF: null,
    iocn: null,
    dates: [],
    day1High: null,
    day1Low: null,
    day1Icons: [],
    day2High: null,
    day2Low: null,
    day2Icons: [],
    day3High: null,
    day3Low: null,
    day3Icons: [],
    day4High: null,
    day4Low: null,
    day4Icons: [],
    day5High: null,
    day5Low: null,
    day5Icons: [],
    showResults: false,
    showError: false,
    error: null
  }

  //These handlers are for setting state on the succesful response from both fetch calls below
  //Some basic validation, remove spaces since they are used as query params in the fetch calls
  handleCity = (event) => {
    let val = event.target.value.toString().replace(" ", "%20");
    this.setState({ city: val });
  }

  handleRegion = (event) => {
    let val = event.target.value.toString().replace(" ", "%20");
    this.setState({ region: val });
  }

  handleCountry = (event) => {
    let val = event.target.value.substring(0, 2);//we only need to send the 2 letter country code
    this.setState({ country: val });
  }

  getWeather = () => {

    this.setState({ showError: false });//reset the error for each subission
    let query = '';
    //The query could be city or city,state or city,state,country, this determines the proper format
    if (this.state.city !== null && this.state.city.length > 0) {
      query += this.state.city;
    }
    if (this.state.region !== null && this.state.region.length > 0) {
      query += "," + this.state.region;
    }
    if (this.state.country !== null && this.state.country.length > 0) {
      query += "," + this.state.country;
    }
    //the fetch for the current weather
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=bca2acfb99955947a148c60251369cf9`)
    .then(res => {
      this.setState({ 
        tempF: res.data.main.temp,
        icon: res.data.weather[0].icon
      });
      this.setState({ showResults: true });
    })
    .catch(err => {
      this.setState({ error: err, showError: true});
      console.log("Current Weather Error: " + err);
    });
    //the fetch for 5 day forecast
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=imperial&appid=bca2acfb99955947a148c60251369cf9`)
    .then(res => {
      //empty array, we'll push unique dates into this with the for loop below
      let allDates = [];
      //the reason we need this is because the requirement was for highs and lows by day, but the API gives you 8
      //different highs and lows for every day. So we sort them based on unique dates, then do some math to 
      //figure out the daily high and lows.
      for (let i=0; i<40; i++) {
        let individualDate = res.data.list[i].dt_txt.substring(0, 10);
        if (!allDates.includes(individualDate)) {
          allDates.push(individualDate);
        }
      }
      //these arrays below will take all day temps and all day icons for further sorting
      let day1Temps = [], day2Temps = [], day3Temps = [], day4Temps = [], day5Temps = [];
      let day1Icons = [], day2Icons = [], day3Icons = [], day4Icons = [], day5Icons = [];
      for (let j=0; j<40; j++) {
        //push all highs and lows for day[x] into day[x]Temps. same with the icons.
        //save icons to state. we will need to do math before setting the highs and lows to state
        if (res.data.list[j].dt_txt.startsWith(allDates[0])) {
          day1Temps.push(res.data.list[j].main.temp_max);
          day1Temps.push(res.data.list[j].main.temp_min);
          day1Icons.push(res.data.list[j].weather[0].icon);
          this.setState({ day1Icons: day1Icons });
        }
        if (res.data.list[j].dt_txt.startsWith(allDates[1])) {
          day2Temps.push(res.data.list[j].main.temp_max);
          day2Temps.push(res.data.list[j].main.temp_min);
          day2Icons.push(res.data.list[j].weather[0].icon);
          this.setState({ day2Icons: day2Icons });
        }
        if (res.data.list[j].dt_txt.startsWith(allDates[2])) {
          day3Temps.push(res.data.list[j].main.temp_max);
          day3Temps.push(res.data.list[j].main.temp_min);
          day3Icons.push(res.data.list[j].weather[0].icon);
          this.setState({ day3Icons: day3Icons });
        }
        if (res.data.list[j].dt_txt.startsWith(allDates[3])) {
          day4Temps.push(res.data.list[j].main.temp_max);
          day4Temps.push(res.data.list[j].main.temp_min);
          day4Icons.push(res.data.list[j].weather[0].icon);
          this.setState({ day4Icons: day4Icons });
        }
        if (res.data.list[j].dt_txt.startsWith(allDates[4])) {
          day5Temps.push(res.data.list[j].main.temp_max);
          day5Temps.push(res.data.list[j].main.temp_min);
          day5Icons.push(res.data.list[j].weather[0].icon);
          this.setState({ day5Icons: day5Icons });
        }
      }
      //now we have to sort thru these arrays and figure out the high and low for daily temps.
      let day1High = Math.max(...day1Temps); let day1Low = Math.min(...day1Temps);
      let day2High = Math.max(...day2Temps); let day2Low = Math.min(...day2Temps);
      let day3High = Math.max(...day3Temps); let day3Low = Math.min(...day3Temps);
      let day4High = Math.max(...day4Temps); let day4Low = Math.min(...day4Temps);
      let day5High = Math.max(...day5Temps); let day5Low = Math.min(...day5Temps);
      //now lets update state with highs and lows
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
      console.log("5 Day Forecast Error: " + err);
    });
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Nav /> 
            <div className="d-flex flex-column mx-auto my-2">
              <div>
                  <label htmlFor="city" className="col">City: *Required*</label>
                  <input type="text" id="city" onChange={this.handleCity}></input>
              </div>
              <div>
                <label htmlFor="region" className="col">State/Region: *Optional*</label>
                  <input type="text" id="region" onChange={this.handleRegion}></input>
              </div>
              <div>
                  <label htmlFor="country" className="col">Country: *Required*</label>
                  <select onChange={this.handleCountry}>
                    <option value="US - United States of America" selected>US - United States of America</option> 
                    {countryCodes.map((label, index) => (
                      <option key={index}>{label}</option>
                    ))}
                  </select>
              </div>
              <div>
                  <button className="my-2" onClick={this.getWeather}>
                    Check Weather
                  </button>
              </div>
            </div>
            {this.state.showError && (
              <div>ERROR: There was an error, Please make sure you've entered a real city and selected your country
              </div>
            )}
            {this.state.showResults && !this.state.showError && (
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