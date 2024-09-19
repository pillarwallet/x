import { createGlobalStyle } from 'styled-components';

// fonts
import neueBoldFont from '../../../assets/landing-fonts/NeueHaasDisplayBold.ttf';
import neueRegularFont from '../../../assets/landing-fonts/NeueHaasDisplayRoman.ttf';

// Slick Styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const GlobalStyles = createGlobalStyle`

  @font-face {
    font-family: Neue Haas Grotesk Display Pro;
    font-weight: 400;
    src: url(${neueRegularFont}) format("truetype");
  }
  
  @font-face {
    font-family: Neue Haas Grotesk Display Pro;
    font-weight: 700;
    src: url(${neueBoldFont}) format("truetype");
  }
  
  :root {
    --white: #ffffff;
    --black: #000000;
    --body-bg: #101010;
    --dark-blue: #4327b1;
    --light-blue: #5e00ff;
    --cta-bg: linear-gradient(180deg, #D9D9D9 0%, #BDBDBD 100%);
    --cta-hover-bg: linear-gradient(180deg, #5E00FF 0%, rgba(94, 0, 255, 0.58) 100%);
    --container: 140rem;
    --padding: 1rem;
    --margin: 1rem;
    --border-radius: 1rem;
    --font-neue: "Neue Haas Grotesk Display Pro", Sans-serif;
  }
  
  html {
    height: 100%;
    font-size: 10px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  
  body {
    height: 100%;
    font-family: var(--font-neue);
    font-style: normal;
    font-weight: 400;
    text-align: center;
    color: var(--white);
    background: var(--body-bg);
  }
  
  /* Resets */
  
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  
  a[href^="tel"] {
    color: inherit;
    text-decoration: none;
  }
  
  a:hover,
  a:active,
  a:focus {
    outline: 0;
  }
  
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    margin-bottom: 2rem;
    line-height: 1.15;
    font-weight: 700;
  }
  
  p {
    margin: 0;
    margin-bottom: 2rem;
    line-height: 1.5;
    font-size: 2rem;
    font-weight: 400;
  }
  
  p:last-child {
    margin-bottom: 0;
  }
  
  a {
    line-height: inherit;
    font-size: inherit;
    color: inherit;
  }
  
  ul {
    margin: 0;
  }
  
  ul li {
    line-height: 1.5;
    font-size: 1.6rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  ul li:last-child {
    margin-bottom: 0;
  }
  
  /* Components */
  
  .container {
    width: 100%;
    max-width: var(--container);
    padding: 0 calc(var(--padding) * 4);
    margin: 0 auto;
  }
  
  .container--fluid {
    max-width: 100%;
    padding: 0;
  }
  
  .container--no_padding {
    padding: 0;
  }
  
  @media only screen and (max-width: 1023px) {
    .container {
      padding: 0 calc(var(--padding) * 4);
    }
  }
  
  @media only screen and (max-width: 767px) {
    .container {
      padding: 0 calc(var(--padding) * 2.5);
    }
  }

  @media only screen and (max-width: 767px) {
    #root {
      overflow: hidden;
    }
  }

  .cta {
    display: inline-block;
    min-width: calc(var(--padding) * 18);
    text-align: center;
    background: var(--cta-bg);
    color: var(--black);
    border: none;
    padding: calc(var(--padding) * 1.5) calc(var(--padding) * 2);
    border-radius: calc(var(--border-radius) * 1);
    text-decoration: none;
    backdrop-filter: blur(2px);
    cursor: pointer;
    font-size: 2rem;
    font-weight: 700;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    margin-bottom: 0;
  }

  .cta--secondary {
    background: var(--cta-hover-bg);
    color: var(--white);
  }

  .cta span {
    position: relative;
    z-index: 2;
  }

  .cta::before {
    content: "";
    position: absolute;
    top: 70%;
    left: 50%;
    width: 27.5%;
    height: 60px;
    border-radius: calc(var(--border-radius) * 3.5);
    background: var(--cta-hover-bg);
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    transform: translate(-150%, 50%) translateZ(0);
    z-index: 1;
  }

  .cta--secondary::before {
    background: var(--cta-bg);
  }

  @media (hover: hover) and (pointer: fine) {
    .cta:hover {
        color: var(--white);
        box-shadow: 0px 7px 20px rgba(17, 21, 37, 0.6), inset -2px -2px 2px rgba(0, 0, 0, 0.25), inset 2px 2px 2px rgba(255, 255, 255, 0.3);
    }

    .cta--secondary:hover {
        color: var(--black);
    }

    .cta:hover:before {
        transform: translate(-50%, -50%) scale(5) translateZ(0);
        transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
  }
  
  /* Header */

  .header {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 100;
    transform: translateY(0);
    transition: transform 0.3s ease-in-out;
    will-change: transform;
  }

  @media only screen and (max-width: 1024px) {
    .header {
      background: rgba(67, 39, 177, 0.9);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
    }
  }

  .header--hidden {
    transform: translateY(-100%);
  }

  @media only screen and (max-width: 1024px) {
    .header--hidden {
      transform: translateY(0);
    }
  }

  .header__announcement {
    position: relative;
    background: var(--light-blue);
    z-index: 101;
  }

  @media only screen and (max-width: 1024px) {
    .header__announcement {
      background: rgba(94, 0, 255, 0.9);
    }
  }
  
  .header__announcement__wrapper {
    padding: calc(var(--padding) * 1) calc(var(--padding) * 2.5);
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
  }
  
  .header__announcement__wrapper p {
    font-size: 1.4rem;
    margin-bottom: 0;
    font-weight: 700;
  }

  .header__announcement__wrapper p a {
    display: none;
    text-decoration: underline;
  }

  @media only screen and (max-width: 1023px) {
    .header__announcement__wrapper p a {
      display: inline-block;
    }
  }

  .cta--header {
    font-size: 1.4rem;
    background: rgba(27, 27, 27, 0.5);
    border-radius: 5px;
    padding: calc(var(--padding) * 0.75) calc(var(--padding) * 2);
    border: solid 1px #6847A0;
    min-width: auto;
  }

  @media only screen and (max-width: 1024px) {
    .cta--header {
      display: none
    }
  }

  .header .container {
    padding-top: calc(var(--padding) * 3);
    padding-bottom: calc(var(--padding) * 3);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @media only screen and (max-width: 1024px) {
    .header .container {
      padding-top: calc(var(--padding) * 2.5);
      padding-bottom: calc(var(--padding) * 2.5);
    }
  }

  .header__logo {
    display: flex;
    z-index: 101;
  }

  .header__logo img {
    height: auto;
    width: 18rem;
    display: block;
  }

  @media only screen and (max-width: 1024px) {
    .header__logo img {
      width: 15rem;
    }
  }

  .header__menu {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @media only screen and (max-width: 1024px) {
    .header__menu {
      display: none;
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100dvh;
      background: rgb(48,1,71);
      background: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(16,16,16,1) 50%, rgba(67,39,177,1) 100%);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      padding: 0 calc(var(--padding) * 1);
      text-align: center;
      overflow-y: auto;
    }

    .header__menu:before {
      display: none;
    }

    .header__menu--show {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 10rem 0;
    }
  }

  .header__menu:before {
    content: "";
    display: block;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  #menu {
    display: block;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  #menu li {
    display: block;
    float: left;
    margin: 0 3rem;
  }

  #menu li a {
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    position: relative;
    color: var(--white);
    transition: all 0.3s ease 0s;
    text-decoration: none;
    position: relative;
  }

  #menu li a.active:after {
    content: '';
    position: absolute;
    left: -1rem;
    right: -1rem;
    bottom: -1rem;
    height: 1px;
    background: rgb(20,18,28);
    background: linear-gradient(90deg, rgba(20,18,28,1) 0%, rgba(103,99,122,1) 20%, rgba(200,198,204,1) 35%, rgba(200,198,204,1) 65%, rgba(103,99,122,1) 80%, rgba(20,18,28,1) 100%);
  }

  #menu li a:hover {
    opacity: 0.75;
  }

  @media only screen and (max-width: 1024px) {
    #menu {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 auto;
      padding: 0 1.25rem;
    }

    #menu li {
      float: none;
      margin: 0;
      margin-bottom: 1rem;
    }

    #menu li a {
      line-height: 4rem;
    }    
  }

  @media only screen and (max-width: 767px) {
    #menu li a {
      line-height: 4rem;
    }    
  }

  .header__social {
    width: 18rem;
    display: flex;
    justify-content: flex-end;
  }

  @media only screen and (max-width: 1024px) {
    .header__social {
      margin-top: 2rem;
      justify-content: center;
    }
  }

  .header__mobile_menu {
    display: none;
    cursor: pointer;
    z-index: 101;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .bar1,
  .bar2,
  .bar3 {
    width: 30px;
    height: 2px;
    background-color: var(--white);
    transition: 0.4s;
  }

  .bar2 {
    width: 20px;
    height: 2px;
    margin-left: 10px;
  }

  .bar1,
  .bar2 {
    margin-bottom: 6px;
  }

  .header__mobile_menu--change .bar1 {
    transform: rotate(-45deg) translate(-6px, 6px);
    background-color: var(--white);
  }

  .header__mobile_menu--change .bar2 {
    opacity: 0;
  }

  .header__mobile_menu--change .bar3 {
    transform: rotate(45deg) translate(-6px, -6px);
    background-color: var(--white);
  }

  @media only screen and (max-width: 1024px) {
    .header__mobile_menu {
      display: flex;
    }
  }

  /* Footer */

  .footer {
    position: relative;
  }
  
  .footer__wrapper {
    padding: calc(var(--padding) * 10) 0 calc(var(--padding) * 4) 0;
    display: flex;
    justify-content: flex-end;
  }

  @media only screen and (max-width: 767px) {
    .footer__wrapper {
      padding: calc(var(--padding) * 4) 0;
      justify-content: center;
    }
  }
  
  /* Home Page Styles */

  .home_hero {
    background-position: left bottom;
    background-repeat: no-repeat;
    padding: calc(var(--padding) * 18) 0 0 0;
    display: flex;
    align-items: center;
    position: relative;
  }

  @media only screen and (max-width: 767px) {
    .home_hero {
      padding: calc(var(--padding) * 12) 0 0 0;
    }
  }
  
  .home_hero__wrapper {
    padding: calc(var(--padding) * 5) calc(var(--padding) * 4) calc(var(--padding) * 10) calc(var(--padding) * 4);
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 6rem;
  }

  @media only screen and (max-width: 1023px) {
    .home_hero__wrapper {
      flex-direction: column;
    }
  }


  @media only screen and (max-width: 767px) {
    .home_hero__wrapper {
      padding: calc(var(--padding) * 5) 0;
    }
  }
  
  /* .home_hero__wrapper::before {
    content: "";
    position: absolute;
    top: 10%;
    bottom: 10%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    transform: translate(-50%);
    background: var(--dark-blue);
    filter: blur(200px);
  } */

  .home_hero__wrapper::before {
    content: "";
    position: absolute;
    left: 10%;
    right: 10%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    transform: translateY(-40%);
    background: var(--dark-blue);
    filter: blur(200px);
  }
  
  .home_hero__content {
    position: absolute;
    transform: translateY(-90%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media only screen and (max-width: 767px) {
    .home_hero__content {
      transform: translateY(-210%);
    }
  }
  
  .home_hero__content h1 {
    font-size: 1rem;
    opacity: 0;
    visibility: hidden;
  }

  @media only screen and (max-width: 767px) {
    .home_hero__content h1 {
      font-size: 1rem;
    }
  }
  
  .home_hero__content p {
    font-size: 2.4rem;
    margin-top: calc(var(--margin) * 4);
    margin-bottom: calc(var(--margin) * 8);
    opacity: 0.6;
    letter-spacing: 0.2px;
    max-width: 20ch;
  }

  @media only screen and (max-width: 767px) {
    .home_hero__content p {
      font-size: 1.8rem;
      margin-bottom: calc(var(--margin) * 5);
      max-width: 20ch;
    }
  }
  
  .home_hero__content img {
    display: block;
    width: 100%;
    max-width: 24rem;
  }

  @media only screen and (max-width: 767px) {
    .home_hero__content img {
      max-width: 15rem;
    }
  }

  .home_hero__signup {
    width: 100%;
    max-width: 75rem;
    background: rgba(94, 0, 255, 0.2);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    border-radius: calc(var(--border-radius) * 1.6);
    padding: calc(var(--padding) * 3) calc(var(--padding) * 3);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5rem;
    position: relative;
    flex: 1;
  }

  @media only screen and (max-width: 767px) {
    .home_hero__signup {
      flex-direction: column;
      gap: 2rem;
      padding: calc(var(--padding) * 3);
      max-width: 45rem;
    }
  }
  
  .home_hero__signup p {
    width: 65%;
    font-size: 3rem;
    text-align: left;
    margin: 0;
    font-weight: 700;
    line-height: 1.2;
  }

  @media only screen and (max-width: 1023px) {
    .home_hero__signup p {
      font-size: 2.5rem;
    }
  }

  @media only screen and (max-width: 767px) {
    .home_hero__signup p {
      width: 100%;
      font-size: 2.5rem;
      max-width: none;
      text-align: center;
    }
  }

  .home_hero__signup a {
    min-width: 20rem;
  }
  
  .home_intro {
    position: relative;
  }
  
  .home_intro__wrapper {
    padding: calc(var(--padding) * 15) 0 calc(var(--padding) * 5) 0;
    position: relative;
  }

  @media only screen and (max-width: 767px) {
    .home_intro__wrapper {
      padding: calc(var(--padding) * 10) 0 0 0;
    }
  }
  
  .home_intro__content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .home_intro__content h2 {
    font-size: 7rem;
  }

  @media only screen and (max-width: 767px) {
    .home_intro__content h2 {
      font-size: 5rem;
    }
  }
  
  .home_intro__content p {
    font-size: 2rem;
    max-width: 36ch;
    margin-bottom: calc(var(--padding) * 5);
  }

  @media only screen and (max-width: 767px) {
    .home_intro__content p {
      font-size: 1.6rem;
    }
  }

  .home_intro__content img {
    width: 100%;
    max-width: 80%;
  }

  @media only screen and (max-width: 767px) {
    .home_intro__content img {
      max-width: 90%;
    }
  }
  
  .home_feature {
    position: relative;
  }
  
  .home_feature__wrapper {
    padding: calc(var(--padding) * 5) 0 0 0;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .home_feature__detail {
    background: rgba(94, 0, 255, 0.2);
    border-radius: calc(var(--border-radius) * 2.4);
    overflow: hidden;
    width: calc(50% - 0.5rem);
    display: flex;
    background-size: contain;
    background-repeat: no-repeat;
  }

  @media only screen and (max-width: 767px) {
    .home_feature__detail {
      width: 100%;
      flex-direction: column;
    }
  }
  
  .home_feature__detail--flex {
    width: 100%;
  }
  
  .home_feature__detail--one {
    background-image: url("/landing-images/home-feature-bg-1.png");
    background-position: center bottom;
  }
  
  .home_feature__detail--two {
    background-image: url("/landing-images/home-feature-bg-2.png");
    background-position: center center;
  }
  
  .home_feature__detail--three {
    background-image: url("/landing-images/home-feature-bg-3.png");
    background-position: center top;
  }

  @media only screen and (max-width: 767px) {
    .home_feature__detail--three {
      background-image: url("/landing-images/home-feature-bg-3-mobile.png");
      background-position: center bottom;
    }
  }
  
  .home_feature__detail__copy {
    width: 60%;
    padding: calc(var(--padding) * 3) 0 calc(var(--padding) * 3) calc(var(--padding) * 3);
    text-align: left;
  }

  @media only screen and (max-width: 767px) {
    .home_feature__detail__copy {
      width: 100%;
      padding: calc(var(--padding) * 3);
    }
  }
  
  .home_feature__detail__copy h2 {
    font-size: 4.5rem;
    line-height: 0.9;
    max-width: 20ch;
  }

  @media only screen and (max-width: 1079px) {
    .home_feature__detail__copy h2 {
      font-size: 3.6rem;
      max-width: none;
    }
  }
  
  .home_feature__detail__copy p {
    font-size: 2rem;
    max-width: 24ch;
  }

  @media only screen and (max-width: 1079px) {
    .home_feature__detail__copy p {
      font-size: 1.6rem;
      max-width: none;
    }
  }
  
  .home_feature__detail__image {
    width: 40%;
  }

  @media only screen and (max-width: 767px) {
    .home_feature__detail__image {
      width: 80%;
      max-width: 48rem !important;
    }
  }
  
  .home_feature__detail--one .home_feature__detail__image {
    margin: calc(var(--margin) * 4) calc(var(--margin) * 1) 0 0;
    max-width: 25rem;
    filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.5));
    border-radius: 20px 20px 0 0;
    overflow: hidden;
  }

  @media only screen and (max-width: 767px) {
    .home_feature__detail--one .home_feature__detail__image {
      margin: 0 auto;
    }
  }
  
  .home_feature__detail--two {
    align-items: flex-start;
  }

  @media only screen and (max-width: 767px) {
    .home_feature__detail--two {
      flex-direction: column-reverse;
    }
  }
  
  .home_feature__detail--two .home_feature__detail__image {
    margin: 0 0 calc(var(--margin) * 4) 0 calc(var(--margin) * 1);
    max-width: 28rem;
    filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.5));
    border-radius: 0 0 20px 20px;
    overflow: hidden;
  }

  @media only screen and (max-width: 767px) {
    .home_feature__detail--two .home_feature__detail__image {
      margin: 0 auto;
    }
  }

  @media only screen and (max-width: 767px) {
    .home_feature__detail--three {
      flex-direction: column-reverse;
    }
  }
  
  .home_feature__detail--three .home_feature__detail__image {
    margin: 0 calc(var(--margin) * 1) calc(var(--margin) * 5)
      calc(var(--margin) * 1);
    max-width: 28rem;
    filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.5));
    border-radius: 0 0 20px 20px;
    overflow: hidden;
  }

  @media only screen and (max-width: 767px) {
    .home_feature__detail--three .home_feature__detail__image {
      margin: 0 auto;
    }
  }
  
  .home_feature__detail__image img {
    width: 100%;
  }
  
  .home_signup {
    position: relative;
  }
  
  .home_signup__wrapper {
    padding: calc(var(--padding) * 15) 0;
    position: relative;
  }

  @media only screen and (max-width: 767px) {
    .home_signup__wrapper {
      padding: calc(var(--padding) * 10) 0;
      position: relative;
    }
  }
  
  .home_signup__wrapper::before {
    content: "";
    position: absolute;
    top: 20%;
    bottom: 10%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    transform: translate(-50%);
    background: var(--dark-blue);
    filter: blur(200px);
  }
  
  .home_signup__content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .home_signup__content h1 {
    font-size: 7rem;
    max-width: 20ch;
    line-height: 1;
  }

  .home_signup__content h1 span {
    font-size: 4rem;
    vertical-align: top;
  }
  
  @media only screen and (max-width: 767px) {
    .home_signup__content h1 {
      font-size: 4rem;
    }

    .home_signup__content h1 span {
      font-size: 2rem;
    }
  }

  .home_signup__content h2 {
    font-size: 7rem;
    max-width: 18ch;
    line-height: 0.9;
  }

  @media only screen and (max-width: 767px) {
    .home_signup__content h2 {
      font-size: 4rem;
    }
  }  
  
  .home_signup__content p {
    font-size: 2rem;
    opacity: 0.6;
    margin: calc(var(--margin) * 3) 0 calc(var(--margin) * 6) 0;
  }

  @media only screen and (max-width: 767px) {
    .home_signup__content p {
      font-size: 1.8rem;
      margin: calc(var(--margin) * 2) 0 calc(var(--margin) * 4) 0;
      max-width: 24ch;
    }
  }
  
  .home_signup__content__form {
    width: 100%;
    max-width: 95rem;
    background: linear-gradient(180deg, #5e00ff 0%, rgba(94, 0, 255, 0.58) 100%);
    border-radius: calc(var(--border-radius) * 1.6);
    padding: calc(var(--padding) * 3);
    display: flex;
    align-items: center;
    gap: 5rem;
  }

  @media only screen and (max-width: 767px) {
    .home_signup__content__form {
      flex-direction: column;
      gap: 2rem;
    }
  }
  
  .home_signup__content__form__wrapper {
    width: 55%;
  }

  @media only screen and (max-width: 767px) {
    .home_signup__content__form__wrapper {
      width: 100%;
    }
  }
  
  .home_signup__content__form__wrapper #mc_embed_signup_scroll {
    display: flex;
    gap: 0.5rem;
  }

  @media only screen and (max-width: 767px) {
    .home_signup__content__form__wrapper #mc_embed_signup_scroll {
      flex-direction: column;
    }
  }
  
  .home_signup__content__form__wrapper .mc-field-group {
    flex: 1;
  }
  
  .home_signup__content__form__wrapper #mc_embed_signup_scroll input {
    width: 100%;
    background: var(--white);
    border-radius: calc(var(--border-radius) * 1);
    padding: calc(var(--padding) * 1) calc(var(--padding) * 2);
    border: 0;
    width: 100%;
    font-size: 1.6rem;
    color: var(--black);
    font-family: "Neue Haas Grotesk Display Pro";
  }
  
  .home_signup__content__form__wrapper #mc_embed_signup_scroll input:focus {
    outline: none;
    border-color: inherit;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  
  .home_signup__content__form__wrapper
    #mc_embed_signup_scroll
    input[type="submit"] {
    width: 100%;
    min-width: 15rem;
    background: var(--cta-bg);
    backdrop-filter: blur(2px);
    font-weight: 700;
    cursor: pointer;
    transition: all ease 0.3s;
  }
  
  .home_signup__content__form__wrapper
    #mc_embed_signup_scroll
    input[type="submit"]:hover {
    transform: translateY(-10%);
  }
  
  .home_signup__content__form p {
    width: 45%;
    font-size: 1.8rem;
    text-align: left;
    opacity: 1;
    margin: 0;
  }

  .home_signup__content__form p a {
    text-decoration: underline;
  }

  @media only screen and (max-width: 767px) {
    .home_signup__content__form p {
      width: 100%;
      font-size: 1.6rem;
      max-width: none;
    }
  }

  .home_signup_tnc {
    position: relative;
  }
  
  .home_signup_tnc__content {
    padding: calc(var(--padding) * 14) 0 0 0;
    position: relative;
  }

  @media only screen and (max-width: 767px) {
    .home_signup_tnc__content {
      padding: calc(var(--padding) * 5) 0 0 0;
      position: relative;
    }
  }

  .home_signup_tnc__content p {
    font-size: 1.4rem;
    max-width: 110ch;
    opacity: 0.6;
    text-align: left;
  }

  .home_signup_tnc__content p a {
    text-decoration: underline;
  }
  
  .home_build {
    position: relative;
  }
  
  .home_build__wrapper {
    position: relative;
    background: rgba(94, 0, 255, 0.2);
    border-radius: calc(var(--border-radius) * 2.4);
  }
  
  .home_build__content {
    position: relative;
    display: flex;
    z-index: 2;
  }

  @media only screen and (max-width: 767px) {
    .home_build__content {
      flex-direction: column
    }
  }
  
  .home_build__content__left {
    width: 53%;
    padding: calc(var(--padding) * 4);
    text-align: left;
  }

  @media only screen and (max-width: 767px) {
    .home_build__content__left {
      width: 100%;
    }
  }
  
  .home_build__content__left h2 {
    font-size: 4.5rem;
    line-height: 0.9;
    max-width: 16ch;
  }

  @media only screen and (max-width: 767px) {
    .home_build__content__left h2 {
      font-size: 3.6rem;
      max-width: none;
    }
  }
  
  .home_build__content__left p {
    font-size: 2rem;
    max-width: 32ch;
  }

  @media only screen and (max-width: 767px) {
    .home_build__content__left p {
      font-size: 1.6rem;
      max-width: none;
      margin-bottom: calc(var(--margin) * 6);
    }
  }
  
  .home_build__content__right {
    width: 47%;
    background: rgba(94, 0, 255, 0.2);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    border-radius: calc(var(--border-radius) * 2.4);
    transform: translatex(2rem) translatey(-5rem);
    padding: calc(var(--padding) * 4);
    text-align: left;
  }

  @media only screen and (max-width: 767px) {
    .home_build__content__right {
      width: 100%;
      transform: translatex(2rem) translatey(-8rem);
    }
  }
  
  .home_build__content__right h2 {
    font-size: 4.5rem;
    line-height: 0.9;
    max-width: 16ch;
    margin-bottom: calc(var(--margin) * 15);
  }

  @media only screen and (max-width: 767px) {
    .home_build__content__right h2 {
      font-size: 3.6rem;
      max-width: none;
      margin-bottom: calc(var(--margin) * 2);
    }
  }
  
  .home_build__content__right h2 a {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    border-radius: calc(var(--border-radius) * 1.2);
    transition: all ease 0.3s;
  }
  
  .home_build__content__right h2 a:hover {
    background: rgba(255, 255, 255, 1);
    color: var(--dark-blue);
  }
  
  .home_build__logo {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -10%;
    display: flex;
    justify-content: center;
  }

  @media only screen and (max-width: 767px) {
    .home_build__logo {
      position: absolute;
      left: -20px;
      right: 0;
      bottom: 20px;
      display: flex;
      justify-content: flex-start;
    }
  }
  
  .home_build__logo img {
    width: 100%;
    max-width: 30rem;
  }

  @media only screen and (max-width: 767px) {
    .home_build__logo img {
      max-width: 20rem;
    }
  }
  
  .home_footer {
    position: relative;
  }
  
  .home_footer__wrapper {
    padding: calc(var(--padding) * 10) 0 calc(var(--padding) * 4) 0;
    display: flex;
    justify-content: flex-end;
  }

  @media only screen and (max-width: 767px) {
    .home_footer__wrapper {
      padding: calc(var(--padding) * 4) 0;
      justify-content: center;
    }
  }
  
  .popup {
    display: flex;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    align-items: center;
    justify-content: center;
    z-index: 99;
    background: rgba(16, 16, 16, 0.85);
  }
  
  @media only screen and (max-width: 767px) {
    .popup {
      top: unset;
      bottom: 1.5rem;
      left: 1.5rem;
      right: 1.5rem;
      background: none;
    }
  }
  
  .popup__wrapper {
    min-width: 35rem;
    border-radius: calc(var(--border-radius) * 1.6);
    background: #121116;
    backdrop-filter: blur(2px);
    padding: calc(var(--padding) * 2.5) calc(var(--padding) * 2.5);
    position: relative;
    border: solid 1px #80868B;
  }
  
  @media only screen and (max-width: 767px) {
    .popup__wrapper {
      min-width: unset;
      padding: calc(var(--padding) * 1.5);
    }
  }
  
  .popup__close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: none;
    border: none;
    color: var(--white);
    opacity: 0.5;
    cursor: pointer;
    transition: all ease 0.3s;
  }
  
  @media only screen and (max-width: 767px) {
    .popup__close {
      top: 1rem;
      right: 1rem;
    }
  }
  
  .popup__close p {
    font-size: 3rem;
  }
  
  @media only screen and (max-width: 767px) {
    .popup__close p {
      font-size: 2rem;
    }
  }
  
  .popup__close:hover {
    opacity: 1;
  }
  
  .popup__form .gw-text-2xl {
    font-size: 2.4rem !important;
    margin-bottom: 2rem !important;
    font-family: "Neue Haas Grotesk Display Pro";
  }
  
  .popup__form .gw-mt-2 span {
    display: none !important;
  }
  
  .popup__form input.gw-w-full, .popup__form button.gw-w-full {
    font-size: 1.6rem !important;
  }
  
  .popup__form .gw-text-sm {
    font-size: 1.2rem !important;
  }
  
  .popup__form .gw-text-xs {
    font-size: 1.2rem !important;
  }


  /* Waitlist Page Styles */

  .home_signup--waitlist .home_signup__wrapper {
    padding: calc(var(--padding) * 29) 0 calc(var(--padding) * 15) 0;
    position: relative;
  }

  @media only screen and (max-width: 767px) {
    .home_signup--waitlist .home_signup__wrapper {
      padding: calc(var(--padding) * 18) 0 calc(var(--padding) * 5) 0 ;
      position: relative;
    }
  }
  
  .home_signup__content__form--waitlist {
    background: #121116;
    max-width: 55rem;
  }
  
  .home_signup__content__form--waitlist .gw-text-2xl {
    font-size: 2.4rem !important;
    margin-bottom: 2rem !important;
    font-family: "Neue Haas Grotesk Display Pro";
  }
  
  .home_signup__content__form--waitlist .gw-mt-2 span {
    display: none !important;
  }
  
  .home_signup__content__form--waitlist input.gw-w-full, .home_signup__content__form--waitlist button.gw-w-full {
    font-size: 1.6rem !important;
  }
  
  .home_signup__content__form--waitlist .gw-text-sm {
    font-size: 1.2rem !important;
  }
  
  .home_signup__content__form--waitlist .gw-text-xs {
    font-size: 1.2rem !important;
  }

  /* Developers Page Styles */
  
  .developers_hero {
    padding: calc(var(--padding) * 24) 0 0 0;
    position: relative;
  }

  @media only screen and (max-width: 767px) {
    .developers_hero {
      padding: calc(var(--padding) * 12) 0 0 0;
    }
  }
  
  .developers_hero__wrapper {
    padding: calc(var(--padding) * 5) 0;
    position: relative;
  }

  @media only screen and (max-width: 767px) {
    .developers_hero__wrapper {
      padding: calc(var(--padding) * 5) 0;
    }
  }
  
  .developers_hero__wrapper::before {
    content: "";
    position: absolute;
    left: 0;
    top: -20%;
    bottom: -20%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    transform: translateX(-30%) translateY(-30%);
    background: #4327B1;
    filter: blur(150px);
  }
  
  .developers_hero__content {
    position: relative;
    text-align: left
  }
  
  .developers_hero__content h1 {
    font-size: 7rem;
    max-width: 20ch;
  }

  @media only screen and (max-width: 767px) {
    .developers_hero__content h1 {
      font-size: 4rem;
    }
  }
  
  .developers_hero__content p {
    font-size: 2rem;
    margin-top: calc(var(--margin) * 5);
    letter-spacing: 0.2px;
    max-width: 40ch;
  }

  @media only screen and (max-width: 767px) {
    .developers_hero__content p {
      font-size: 1.8rem;
      margin-top: calc(var(--margin) * 3);
    }
  }

  .developers_feature {
    position: relative;
  }

  .developers_feature .container {
    max-width: calc(var(--container) + 10rem);
  }

  .developers_feature__wrapper {
    padding: calc(var(--padding) * 10) 0 0 0;
    display: flex;
    gap: 2rem;
  }

  @media only screen and (max-width: 1079px) {
    .developers_feature__wrapper {
      padding: calc(var(--padding) * 4) 0 0 0;
      flex-direction: column;
      align-items: center;
    }
  }

  .developers_feature__detail {
    background: rgba(94, 0, 255, 0.2);
    border-radius: calc(var(--border-radius) * 2.4);
    overflow: hidden;
    width: calc(33.33% - 2rem);
    background-size: cover;
    background-repeat: no-repeat;
    padding: calc(var(--padding) * 3);
    text-align: left;
  }

  @media only screen and (max-width: 1079px) {
    .developers_feature__detail {
      width: 100%;
      max-width: 40rem;
      padding: calc(var(--padding) * 3);
    }
  }
  
  .developers_feature__detail h3 {
    font-size: 3.8rem;
    line-height: 0.9;
    max-width: 20ch;
  }

  @media only screen and (max-width: 1079px) {
    .developers_feature__detail h3 {
      font-size: 2.8rem;
    }
  }
  
  .developers_feature__detail p {
    font-size: 1.8rem;
    max-width: 24ch;
    opacity: 0.6;
    transition: all ease 0.5s;
  }

  .developers_feature__detail:hover p {
    opacity: 1;
  }
  

  @media only screen and (max-width: 1079px) {
    .developers_feature__detail p {
      font-size: 1.6rem;
    }
  }

  .developers_feature__detail:first-child {
    background-image: url("/landing-images/developer-feature-bg-1.png");
    background-position: center center;
  }

  .developers_feature__detail:nth-child(2) {
    background-image: url("/landing-images/developer-feature-bg-2.png");
    background-position: center center;
  }

  .developers_feature__detail:nth-child(3) {
    background-image: url("/landing-images/developer-feature-bg-3.png");
    background-position: center center;
  }

  .developers_signup {
    position: relative;
    z-index: 2;
  }
  
  .developers_signup__wrapper {
    padding: calc(var(--padding) * 13) 0 0 0;
    position: relative;
  }

  @media only screen and (max-width: 767px) {
    .developers_signup__wrapper {
      padding: calc(var(--padding) * 10) 0 0 0;
      position: relative;
    }
  }
  .developers_signup__content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  } 
  
  .developers_signup__content p {
    font-size: 2rem;
    max-width: 36ch;
    margin: calc(var(--margin) * 3) 0 calc(var(--margin) * 6) 0;
  }

  @media only screen and (max-width: 767px) {
    .developers_signup__content p {
      font-size: 1.8rem;
      margin: calc(var(--margin) * 2) 0 calc(var(--margin) * 4) 0;
    }
  }

  .developers_signup__content__detail {
    width: 100%;
    max-width: 68rem;
    background: linear-gradient(180deg, #5e00ff 0%, rgba(94, 0, 255, 0.58) 100%);
    border-radius: calc(var(--border-radius) * 1.6);
    padding: calc(var(--padding) * 3) calc(var(--padding) * 8);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5rem;
  }

  @media only screen and (max-width: 767px) {
    .developers_signup__content__detail {
      flex-direction: column;
      gap: 2rem;
      padding: calc(var(--padding) * 3);
      max-width: 45rem;
    }
  }
  
  .developers_signup__content__detail p {
    width: 50%;
    font-size: 1.8rem;
    text-align: left;
    margin: 0;
    font-weight: 700;
  }

  @media only screen and (max-width: 767px) {
    .developers_signup__content__detail p {
      width: 100%;
      font-size: 1.6rem;
      max-width: none;
      text-align: center;
    }
  }

  .developers_ui {
    position: relative;
  }

  .developers_ui .container {
    max-width: calc(var(--container) + 10rem);
  }
  
  .developers_ui__wrapper {
    padding: calc(var(--padding) * 16) 0;
    position: relative;
    display: flex;
    align-items: center;
    gap: 4rem;
  }

  @media only screen and (max-width: 1079px) {
    .developers_ui__wrapper {
      padding: calc(var(--padding) * 10) 0;
      position: relative;
      flex-direction: column;
      gap: 6rem
    }
  }

  .developers_ui__wrapper::before {
    content: "";
    position: absolute;
    right: 0;
    top: 15%;
    bottom: 15%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background: #4327B1; 
    filter: blur(150px);
    transform: translateX(-10%);
  }

  @media only screen and (max-width: 1079px) {
    .developers_ui__wrapper::before {
      right: unset;
      transform: translateX(0) translateY(20%);
    }
  }

  .developers_ui__detail {
    width: calc(50% - 2rem);
    text-align: left;
    position: relative;
    padding-left: 5rem;
  }

  @media only screen and (max-width: 1079px) {
    .developers_ui__detail {
      width: 100%;
      padding-left: 0;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .developers_ui__detail h2 {
    font-size: 4.5rem;
    line-height: 0.9;
    max-width: 10ch;
  }

  @media only screen and (max-width: 1079px) {
    .developers_ui__detail h2 {
      font-size: 3.6rem;
    }
  }
  
  .developers_ui__detail p {
    font-size: 2rem;
    max-width: 34ch;
  }

  @media only screen and (max-width: 1079px) {
    .developers_ui__detail p {
      font-size: 1.6rem;
      max-width: 45ch;
    }
  }

  .developers_ui__image {
    width: calc(50% - 2rem);
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 2rem
  }

  @media only screen and (max-width: 1079px) {
    .developers_ui__image {
      width: 100%;
      max-width: 60rem;
    }
  }

  @media only screen and (max-width: 767px) {
    .developers_ui__image {
      gap: 1rem
    }
  }

  .developers_ui__image__wrapper {
    width: calc(50% - 1rem);
    padding: 1rem;
    border-radius: calc(var(--border-radius)* 4);
    background: rgba(94, 0, 255, 0.2);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5); 
    backdrop-filter: blur(5px);
    border: solid 1px #5e5e5e;
  }
  

  @media only screen and (max-width: 767px) {
    .developers_ui__image__wrapper {
      width: calc(50% - 0.5rem);
      padding: 0.5rem;
      border-radius: calc(var(--border-radius)* 2);
    }
  }

  .developers_ui__image__wrapper:nth-child(2) {
    margin-top: 5rem;
  }

  @media only screen and (max-width: 767px) {
    .developers_ui__image__wrapper:nth-child(2) {
      margin-top: 3rem;
    }
  }

  .developers_ui__image__wrapper video {
    border-radius: calc(var(--border-radius)* 3);
    filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.5));
  }

  @media only screen and (max-width: 767px) {
    .developers_ui__image__wrapper video {
      border-radius: calc(var(--border-radius)* 1.5);
    }
  }

  .developers_module {
    position: relative;
  }

  .developers_module .container {
    max-width: calc(var(--container) + 10rem);
  }
  
  .developers_module__wrapper {
    padding: calc(var(--padding) * 5) 0 calc(var(--padding) * 20) 0;
    position: relative;
    display: flex;
    align-items: center;
    gap: 4rem;
  }

  @media only screen and (max-width: 1079px) {
    .developers_module__wrapper {
      padding: 0 0 calc(var(--padding) * 10) 0;
      position: relative;
      flex-direction: column-reverse;
      gap: 6rem
    }
  }

  .developers_module__wrapper::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 20%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background: #4327B1;
    filter: blur(150px);
    transform: translateX(6%);
  }

  @media only screen and (max-width: 1079px) {
    .developers_module__wrapper::before {
      right: unset;
      transform: translateX(0) translateY(20%);
    }
  }

  .developers_module__list {
    position: relative;
    width: calc(50% - 2rem);
    padding: 0 5rem;
  }

  @media only screen and (max-width: 1079px) {
    .developers_module__list {
      width: 100%;
      padding: 0;
      max-width: 59rem;
    }
  }

  .developers_module__list__wrapper {
    padding: 3.6rem 0;
    border-radius: calc(var(--border-radius) * 4);
    background: rgba(94, 0, 255, 0.2);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5); 
    backdrop-filter: blur(5px);
    border: solid 1px #5e5e5e;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rem;
  }

  @media only screen and (max-width: 767px) {
    .developers_module__list__wrapper {
      border-radius: calc(var(--border-radius) * 3);
    }
  }
  

  .developers_module__list__wrapper > p {
    font-size: 1.8rem;
    max-width: 34ch;
    padding: 0 2rem;
    margin-top: 2rem;
  }

  @media only screen and (max-width: 1079px) {
    .developers_module__list__wrapper p {
      font-size: 1.6rem;
      max-width: 45ch;
    }
  }

  .developers_module__list__carousel {
    width: 100%;
    margin: auto;
    position: relative;
  }

  .developers_module__list__carousel__slide {
    padding: 2rem;
    border-radius: 1rem;
    position: relative;
    transition: transform 0.5s;
    box-sizing: border-box;
  }

  @media only screen and (max-width: 767px) {
    .developers_module__list__carousel__slide {
      padding: 1.5rem;
    }
  }

  .developers_module__list__carousel__slide__content {
    background: rgba(94, 0, 255, 0.2); 
    border-radius: calc(var(--border-radius) * 2.4);
    text-align: left;
    padding: 3rem;
    min-height: 26rem;
  }

  @media only screen and (max-width: 767px) {
    .developers_module__list__carousel__slide__content {
      padding: 2rem;
      border-radius: calc(var(--border-radius) * 1.6);
    }
  }

  .developers_module__list__carousel__slide__content--last {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(180deg, rgba(94,0,255,1) 0%, rgba(145,90,239,1) 100%);
  }

  .developers_module__list__carousel__slide__content h3 {
    font-size: 3.5rem;
    line-height: 0.9;
  }

  @media only screen and (max-width: 1079px) {
    .developers_module__list__carousel__slide__content h3 {
      font-size: 2.5rem;
    }
  }
  
  .developers_module__list__carousel__slide__content p {
    font-size: 1.6rem;
    opacity: 0.6;
    max-width: 31ch;
    transition: all ease 0.5s;
    margin-bottom: 0.5rem;
  }

  .developers_module__list__carousel__slide__content:hover p {
    opacity: 1;
  }
  
  @media only screen and (max-width: 1079px) {
    .developers_module__list__carousel__slide__content p {
      font-size: 1.4rem;
    }
  }

  .developers_module__list__carousel__slide__content img {
    margin-left: 90%;
  }

  .developers_module__list__carousel__slide__content--last img{
    height: 50px;
  }

  @media only screen and (max-width: 767px) {
    .developers_module__list__carousel__slide__content img {
      margin-left: 80%;
      margin-top: 2rem;
    }
  }

  .slick-center .developers_module__list__carousel__slide {
    transform: scale(1.1);
  }

  .developers_module__list__carousel .slick-dots li {
    width: 15px;
    height: 15px;
    margin: 0 2px;
  }

  .developers_module__list__carousel .slick-dots li button:before {
    color: rgba(255, 255, 255, 0.5);
  }

  .developers_module__list__carousel .slick-dots li.slick-active button:before {
    color: var(--white);
  }

  .developers_module__list__carousel__nav {
    position: absolute;
    top: 50%;
    left: 3.5rem;
    right: 3.5rem;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    pointer-events: none;
  }

  .developers_module__list__carousel__nav button {
    width: 3rem;
    background: rgba(94, 0, 255, 0.2);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
    border-radius: 50%;
    aspect-ratio: 1/1;
    font-size: 2rem;
    transition: all ease 0.5s;
    pointer-events: all;
  }

  .developers_module__list__carousel__nav button:hover {
    background: rgba(94, 0, 255, 0.8);
  }

  @media only screen and (max-width: 767px) {
    .developers_module__list__carousel__nav {
      display: none;
    }
  }

  .developers_module__detail {
    width: calc(50% - 2rem);
    text-align: left;
    position: relative;
    padding-left: 10rem;
  }

  @media only screen and (max-width: 1079px) {
    .developers_module__detail {
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-left: 0;
    }
  }

  .developers_module__detail h2 {
    font-size: 4.5rem;
    line-height: 0.9;
    max-width: 18ch;
  }

  @media only screen and (max-width: 1079px) {
    .developers_module__detail h2 {
      font-size: 3.6rem;
    }
  }
  
  .developers_module__detail p {
    font-size: 2rem;
    max-width: 34ch;
  }

  @media only screen and (max-width: 1079px) {
    .developers_module__detail p {
      font-size: 1.6rem;
      max-width: 45ch;
    }
  }

  .developers_benefits {
    position: relative;
  }

  .developers_benefits .container {
    max-width: calc(var(--container) + 10rem);
  }
  
  .developers_benefits__wrapper {
    display: flex;
    gap: 4rem;
    background: linear-gradient(180deg, #5E00FF 0%, rgba(94, 0, 255, 0.58) 100%); 
    border-radius: calc(var(--border-radius)* 1.6);
  }

  @media only screen and (max-width: 1079px) {
    .developers_benefits__wrapper {
      flex-direction: column;
      gap: 0;
    }
  }

  .developers_benefits__detail {
    width: calc(50% - 2rem);
    text-align: left;
    position: relative;
    padding: 4rem;
  }

  @media only screen and (max-width: 1079px) {
    .developers_benefits__detail {
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .developers_benefits__detail h2 {
    font-size: 4.5rem;
    line-height: 0.9;
    max-width: 18ch;
  }

  @media only screen and (max-width: 1079px) {
    .developers_benefits__detail h2 {
      font-size: 3.6rem;
    }
  }
  
  .developers_benefits__detail p {
    font-size: 2rem;
    max-width: 34ch;
  }

  @media only screen and (max-width: 1079px) {
    .developers_benefits__detail p {
      font-size: 1.6rem;
      max-width: 45ch;
    }
  }

  .developers_benefits__list {
    width: calc(50% - 2rem);
    text-align: left;
    position: relative;
    padding-right: 10rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: -4rem 0;
  }

  @media only screen and (max-width: 1079px) {
    .developers_benefits__list {
      width: calc(100% + 3rem);
      margin: 0 -1.5rem 3rem -1.5rem;
      padding-right: 0;
      text-align: center;
    }
  }

  .developers_benefits__list__detail {
    background: rgba(94, 0, 255, 0.2);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    border-radius: calc(var(--border-radius)* 2.4);
    padding: 4rem;
  }

  @media only screen and (max-width: 1079px) {
    .developers_benefits__list__detail {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .developers_benefits__list__detail h3 {
    font-size: 3.8rem;
    line-height: 0.9;
    max-width: 20ch;
  }

  @media only screen and (max-width: 1079px) {
    .developers_benefits__list__detail h3 {
      font-size: 2.8rem;
    }
  }
  
  .developers_benefits__list__detail p {
    font-size: 1.8rem;
    max-width: 30ch;
    opacity: 0.6;
    transition: all ease 0.5s;
  }

  .developers_benefits__list__detail:hover p {
    opacity: 1;
  }

  @media only screen and (max-width: 1079px) {
    .developers_benefits__list__detail p {
      font-size: 1.6rem;
    }
  }

  .developers_revenue {
    position: relative;
    z-index: 2;
  }
  
  .developers_revenue__wrapper {
    padding: calc(var(--padding) * 17) 0 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7rem;

  }

  @media only screen and (max-width: 1079px) {
    .developers_revenue__wrapper {
      padding: calc(var(--padding) * 10) 0 0 0;
      gap: 4rem;
    }
  }

  .developers_revenue__wrapper h2 {
    font-size: 4.5rem;
    line-height: 0.9;
    max-width: 18ch;
  }

  @media only screen and (max-width: 1079px) {
    .developers_revenue__wrapper h2 {
      font-size: 3.6rem;
    }
  }

  .developers_revenue__detail {
    display: flex;
    gap: 6rem;
    text-align: left;
    max-width: 101rem;
  }

  @media only screen and (max-width: 767px) {
    .developers_revenue__detail {
      flex-direction: column;
      gap: 3rem;
      text-align: center;
    }
  }

  .developers_revenue__detail p {
    font-size: 2rem;
    width: 50%;
  }

  @media only screen and (max-width: 1079px) {
    .developers_revenue__detail p {
      font-size: 1.6rem;
      width: 100%;
    }
  }

  .developers_choose {
    position: relative;
  }
  
  .developers_choose__wrapper {
    padding: calc(var(--padding) * 17) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7rem;
    position: relative;

  }

  @media only screen and (max-width: 1079px) {
    .developers_choose__wrapper {
      padding: calc(var(--padding) * 10) 0;
      gap: 4rem
    }
  }

  .developers_choose__wrapper::before {
    content: "";
    position: absolute;
    top: 20%;
    bottom: 20%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background: #4327B1; 
    opacity: 0.5;
    filter: blur(150px);
    transform: translateX(0);
  }

  .developers_choose__wrapper h2 {
    font-size: 4.5rem;
    line-height: 0.9;
    position: relative;
  }

  @media only screen and (max-width: 1079px) {
    .developers_choose__wrapper h2 {
      font-size: 3.6rem;
    }
  }

  .developers_choose__list__wrapper {
    position: relative;
  }

  .developers_choose__list__wrapper:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: rgb(20,18,28);
    background: linear-gradient(90deg, rgba(20,18,28,1) 0%, rgba(103,99,122,1) 20%, rgba(200,198,204,1) 35%, rgba(200,198,204,1) 65%, rgba(103,99,122,1) 80%, rgba(20,18,28,1) 100%);
  }

  @media only screen and (max-width: 767px) {
    .developers_choose__list__wrapper:before {
      content: none;
    }
  }

  .developers_choose__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
  }

  @media only screen and (max-width: 767px) {
    .developers_choose__list {
      gap: 4rem;
    }
  }

  @media only screen and (max-width: 540px) {
    .developers_choose__list {
      gap: 6rem;
    }
  }

  .developers_choose__list:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 33.33%;
    width: 1px;
    background: rgb(20,18,28);
    background: linear-gradient(180deg, rgba(20,18,28,1) 0%, rgba(103,99,122,1) 20%, rgba(200,198,204,1) 35%, rgba(200,198,204,1) 65%, rgba(103,99,122,1) 80%, rgba(20,18,28,1) 100%);
  }

  @media only screen and (max-width: 767px) {
    .developers_choose__list:before {
      content: none;
    }
  }

  .developers_choose__list:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 33.33%;
    width: 1px;
    background: rgb(20,18,28);
    background: linear-gradient(180deg, rgba(20,18,28,1) 0%, rgba(103,99,122,1) 20%, rgba(200,198,204,1) 35%, rgba(200,198,204,1) 65%, rgba(103,99,122,1) 80%, rgba(20,18,28,1) 100%);
  }

  @media only screen and (max-width: 767px) {
    .developers_choose__list:after {
      content: none;
    }
  }

  .developers_choose__list__detail {
    width: 33.33%;
    padding: 5rem;
    text-align: left;
  }

  @media only screen and (max-width: 1079px) {
    .developers_choose__list__detail {
      padding: 2.5rem;
    }
  }

  @media only screen and (max-width: 767px) {
    .developers_choose__list__detail {
      padding: 0;
      width: calc(50% - 2rem);
    }
  }

  @media only screen and (max-width: 540px) {
    .developers_choose__list__detail {
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .developers_choose__list__detail h3 {
    font-size: 2.4rem;
    line-height: 0.9;
    max-width: 20ch;
    margin-top: 3rem;
  }

  @media only screen and (max-width: 1079px) {
    .developers_choose__list__detail h3 {
      font-size: 2rem;
    }
  }
  
  .developers_choose__list__detail p {
    font-size: 1.8rem;
    max-width: 28ch;
    opacity: 0.6;
    transition: all ease 0.5s;
  }

  .developers_choose__list__detail:hover p {
    opacity: 1;
  }

  @media only screen and (max-width: 1079px) {
    .developers_choose__list__detail p {
      font-size: 1.6rem;
    }
  }

  .developers_join {
    position: relative;
  }

  .developers_join .container {
    max-width: calc(var(--container) + 10rem);
  }
  
  .developers_join__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(94, 0, 255, 0.2);
    border-radius: calc(var(--border-radius)* 1.6);
    padding: 0 4rem 6rem 4rem;
    position: relative;
  }

  @media only screen and (max-width: 1079px) {
    .developers_join__wrapper {
      padding: 0 3rem 3rem 3rem;
    }
  }

  .developers_join__wrapper img {
    width: 100%;
    max-width: 25rem;
    margin-top: -4rem;
  }

  @media only screen and (max-width: 1079px) {
    .developers_join__wrapper img {
      max-width: 20rem;
      margin-top: -3rem;
    }
  }

  .developers_join__wrapper p {
    font-size: 2rem;
    max-width: 38ch;
    margin: 2rem 0 5rem 0;
  }

  @media only screen and (max-width: 1079px) {
    .developers_join__wrapper p {
      font-size: 1.6rem;
      margin: 1rem 0 4rem 0;
    }
  }

  .developers_join__cta {
    display: flex;
    gap: 2rem;
  }

  @media only screen and (max-width: 767px) {
    .developers_join__cta {
      flex-direction: column;
    }
  }

`;

export { GlobalStyles };
