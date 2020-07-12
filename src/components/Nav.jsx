import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Nav = (props) => {
    return (
        <div className="nav">
            <nav className="navba mx-auto">
                <Link to="/" className="p-1">
                    Current Weather
                </Link>
                <span>|</span>
                <Link to="/Forecast" className="p-1">
                    5 Day Forecast
                </Link>
            </nav>
        </div>
    );
}

export default withRouter(Nav);