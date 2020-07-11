import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Nav = (props) => {
    return (
        <div className="nav">
            <nav className="navbar">
                <div className="container">
                    <Link to="/" className="mx-5">
                        Current Weather
                    </Link>
                    <Link to="/Forecast" className="mx-5">
                        5 Day Forecast
                    </Link>
                </div>
            </nav>
        </div>
    );
}

export default withRouter(Nav);