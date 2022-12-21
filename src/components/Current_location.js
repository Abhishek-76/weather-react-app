import React, { useState } from "react";
import api from "./api_keys";
import Clock from "react-live-clock";
import ReactAnimatedWeather from "react-animated-weather";
import axios from "axios";

const Current_location = () => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState("");
  const search = (evt) => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          setWeather(result);
          setQuery("");
          console.log(result);
        });
    }
  };

  const dateBuilder = (d) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    return `${day} ${date} ${month} ${year}`;
  };
  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };
  class Weather extends React.Component {
    state = {
      lat: undefined,
      lon: undefined,
      errorMessage: undefined,
      temperatureC: undefined,
      temperatureF: undefined,
      city: undefined,
      country: undefined,
      description: undefined,
      icon: "CLEAR_DAY",
      sunrise: undefined,
      sunset: undefined,
      errorMsg: undefined,
    };
    componentDidMount() {
      if (navigator.geolocation) {
        this.getPosition()
          .then((position) => {
            this.getWeather(
              position.coords.latitude,
              position.coords.longitude
            );
          })
          .catch((err) => {
            this.getWeather(28.67, 77.22);
            alert(
              "You have disabled location service.Allow 'This APP' to access your location."
            );
          });
      } else {
        alert("Geolocation not available");
      }
      this.timerID = setInterval(
        () => this.getWeather(this.state.lat, this.state.lon),
        600000
      );
    }
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
    getPosition = (options) => {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };
    getWeather = async (lat, lon) => {
      const api_call = await fetch(
        `${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`
      );
      const data = await api_call.json();
      this.setState({
        lat: lat,
        lon: lon,
        city: data.name,
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round(data.main.temp * 1.8 + 32),
        humidity: data.main.humidity,
        main: data.weather[0].main,
      });
      switch (this.state.main) {
        case "Haze":
          this.setState({ icon: "CLEAR_DAY" });
          break;
        case "Cloud":
          this.setState({ icon: "CLOUDY" });
          break;
        case "Rain":
          this.setState({ icon: "Rain" });
          break;
        case "Snow":
          this.setState({ icon: "SNOW" });
          break;
        case "Dust":
          this.setState({ icon: "WIND" });
          break;
        case "Drizzle":
          this.setState({ icon: "SLEET" });
          break;
        case "Fog":
          this.setState({ icon: "FOG" });
          break;
        case "Smoke":
          this.setState({ icon: "SMOKE" });
          break;
        case "Tornado":
          this.setState({ icon: "Wind" });
          break;
        default:
          this.setState({ icon: "CLEAR_DAY" });
          break;
      }
    };
    render() {
      if (this.state.temperatureC) {
        return (
          <>
            <div className="title">
              <h2>{this.state.city}</h2>
              <h3>{this.state.country}</h3>
            </div>
            <div className="mb-icon">
              {""}
              <ReactAnimatedWeather
                icon={this.state.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <p>{this.state.main}</p>
            </div>
            <div className="date-time">
              <div className="dmy">
                <div id="txt"></div>
                <div className="current-time">
                  <Clock format="HH:mm:ss" intervsl={1000} ticking={true} />
                </div>
                <div className="current-date">{dateBuilder(new Date())}</div>
              </div>
              <div className="temperature">
                <p>
                  {this.state.temperatureC}°<span>C</span>
                </p>
              </div>
            </div>
          </>
        );
      }
    }
  }
};

export default Current_location;
