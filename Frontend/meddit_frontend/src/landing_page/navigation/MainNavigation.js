import React from "react";
import {Link} from 'react-router-dom';

import './MainNavigation.css'
import MainHeader from "./MainHeader";
import logo from './meddit-removebg-preview.png'

const MainNavigation = props => {
    return( 
        <MainHeader>
            <h1 className="main-navigation__title">
                {/* This is the name of your app and link directs it main page when clicked */}
                <Link to="/">
                    <img src={logo} alt="Meddit"></img>
                </Link>
            </h1>
            <div>
                <Link to='/AboutUs'>
                    <input
                        className={"abUs"}
                        type="button"
                        value={"About Us"} />
                </Link>
            </div>
        </ MainHeader>
    )
};

export default MainNavigation;