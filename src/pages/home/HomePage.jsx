import React from 'react';
import Logo from '../../assets/logo-kana.svg';
import { Link } from 'react-router-dom';
import '../css/HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      
      <div className="home-page__left-section">
        <h1>about us</h1>
        <p>
「Kana Typer」にようこそ！ <br />
Welcome to Kana Typer!<br /><br />

We created this app to help all fellow Japanese learners on their path to fluency. <br /><br />

Learning Japanese might be difficult and monotonous, but in this place we'll speed up a little and have fun... unless you prefer slower pace, then don't worry - everything can be customized. If you wish to read and write like a master, then check out our Typer tool! It'll help you learn to connect kana with its way of reading.<br /><br />

You don't need to track your own progress, the app will adjust to you and cover all basic information in the Progress tab.

Hopefully you'll have a good time learning Japanese and stick with us!

        </p>
      </div>

      
      <div className="home-page__right-section">
        <img src={Logo} alt="Logo" className="home-page__logo" />
        <Link to="/login" className="home-page__join-button">Zaloguj się</Link>
      </div>
    </div>
  );
}

export default HomePage;
