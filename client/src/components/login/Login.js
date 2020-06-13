import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./login.css";
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }
  render() {
    return (
      <div>
        <form className="login-form" onSubmit={this.onSubmit}>
          <div className="container form-content">
            <h1 className="">Login</h1>
            <div className="form-group" style={{ marginTop: "30px" }}>
              <input
                type="username"
                className="form-control input-text"
                name="username"
                placeholder="username"
                value={this.state.username}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control input-text"
                name="password"
                placeholder="password"
                value={this.state.password}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="button-box" style={{ paddingTop: "30px" }}>
              <button
                type="submit"
                className="btn btn-primary"
                onSubmit={this.onSubmit}
              >
                Login
              </button>
              <Link
                className="btn btn-secondary"
                to="/register"
                style={{ marginLeft: "20px" }}
              >
                Register
              </Link>
            </div>
          </div>
        </form>
      </div>
    );
  }
  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    fetch("/user/login", {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          const error = new Error(res.error);
          throw error;
        }
        return res.json();
      })
      .then((user) => {
        // this.props.setUser(user);
        this.props.history.push("/courses");

        console.log("success");
      })
      .catch((err) => {
        console.error(err);
        alert("Error logging in please try again");
      });
    console.log(this.state);
  };
}
