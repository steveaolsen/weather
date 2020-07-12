//Hello, I don't note like this in real projects but since this is a job interview, i want you to
//see what's going thru my head as i code. my notes in the real world are short, concise and 
//to help guide the next developer thru the project. its also, and you can probably relate,
//to remind myself what the hell i was doing when i go back to code a year later. 

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

  handleCity = (event) => {
    let val = event.target.value.toString().replace(" ", "%20");
    this.setState({ city: val });
  }

  handleRegion = (event) => {
    let val = event.target.value.toString().replace(" ", "%20");
    this.setState({ region: val });
  }

  handleCountry = (event) => {
    let val = event.target.value.toString().replace(" ", "%20");
    this.setState({ country: val });
  }

  getWeather = () => {

    console.log(this.state);

    this.setState({ showError: false });//reset the error for each subission
    let query = '';
    //this api works if i send city,null,null, but is sketchy so i am cleaning up the query
    //in my experience with APIs validation is always required. it usually starts of simple
    //then grows as bugs gets tested and spotted. there is almost no perfect validation, but by
    //using good standards we can cover most of the reasonable use case scenarios.
    if (this.state.city !== null && this.state.city.length > 0) {
      query += this.state.city;
    }
    if (this.state.region !== null && this.state.region.length > 0) {
      query += "," + this.state.region;
    }
    if (this.state.country !== null && this.state.country.length > 0) {
      query += "," + this.state.country;
    }
    console.log("What you sent to the API: " + query);
    //i chose netlify to host the app, i've used it before and it's easy for simple create-react-app
    //projects. it won't work for Next and SSR, but for this project those tools would be over kill.
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=bca2acfb99955947a148c60251369cf9`)
    //obviously, passing a key like this on the front end is a no no. given the risk of someone checking
    //the weather using my key, i am willing to take that risk. in the real world I would write a blind module 
    //in node and call it from the front end, let the back end do the fetch, then pass it to the front as a 
    //resolved promise. just an FYI, I'm not that guy :)
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

    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=imperial&appid=bca2acfb99955947a148c60251369cf9`)
    .then(res => {
      let allDates = [];//empty array, we'll push unique dates into this with the for loop below
      for (let i=0; i<40; i++) {
        let individualDate = res.data.list[i].dt_txt.substring(0, 10);
        if (!allDates.includes(individualDate)) {
          allDates.push(individualDate);
        }
      }
      let day1Temps = [], day2Temps = [], day3Temps = [], day4Temps = [], day5Temps = [];
      let day1Icons = [], day2Icons = [], day3Icons = [], day4Icons = [], day5Icons = [];
      for (let j=0; j<40; j++) {
        //push all highs and lows for day[x] into day[x]Temps.
        //we need to sort by day and figure out daily highs and lows, since there are 7 highs and lows per day
        //since the api doesn't give daily highs and lows on the free version.
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
      console.log("day1Icons in App.js: " + day1Icons);
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
            {this.state.showResults && !this.state.showError &&(
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