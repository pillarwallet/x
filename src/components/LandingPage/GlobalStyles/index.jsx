import { createGlobalStyle } from 'styled-components';

// fonts
import neueBoldFont from '../../../assets/landing-fonts/NeueHaasDisplayBold.ttf';
import neueRegularFont from '../../../assets/landing-fonts/NeueHaasDisplayRoman.ttf';

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
  
  /* Style */
  .header {
    position: relative;
    z-index: 100;
  }

  @media only screen and (max-width: 1024px) {
    .header  {
      left: 0;
      right: 0;
      position: fixed;
    }
  }

  .header__announcement {
    position: relative;
    background: rgba(94, 0, 255, 0.5);
    backdrop-filter: blur(10px);
    z-index: 101;
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

  .header__announcement__wrapper > a {
    font-size: 1.4rem;
    margin-bottom: 0;
    font-weight: 700;
    text-decoration: none;
    background: rgba(27, 27, 27, 0.5);
    backdrop-filter: blur(5px);
    border-radius: 10px;
    padding: calc(var(--padding) * 1) calc(var(--padding) * 2);
    transition: all ease 0.3s;
  }
  
  .header__announcement__wrapper > a:hover {
    background: var(--white);
    color: var(--light-blue);
  }

  @media only screen and (max-width: 1024px) {
    .header__announcement__wrapper > a {
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
  }

  #menu li.active a {
    opacity: 0.75;
  }

  #menu li a.active {
    opacity: 0.75;
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
  
  
  .home_hero {
    background-image: url("/landing-images/home-hero-bg.svg");
    background-size: contain;
    background-position: center top;
    background-repeat: no-repeat;
    padding: calc(var(--padding) * 10) 0 0 0;
    display: flex;
    align-items: center;
    position: relative;
  }

  @media only screen and (max-width: 767px) {
    .home_hero {
      padding: calc(var(--padding) * 12) 0 0 0;
      background-position: center center;
    }
  }
  
  .home_hero__wrapper {
    padding: calc(var(--padding) * 5) calc(var(--padding) * 4);
    position: relative;
  }

  @media only screen and (max-width: 767px) {
    .home_hero__wrapper {
      padding: calc(var(--padding) * 5) 0;
    }
  }
  
  .home_hero__wrapper::before {
    content: "";
    position: absolute;
    top: 10%;
    bottom: 10%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    transform: translate(-50%);
    background: var(--dark-blue);
    filter: blur(200px);
  }
  
  .home_hero__content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .home_hero__content h1 {
    font-size: 7rem;
  }

  @media only screen and (max-width: 767px) {
    .home_hero__content h1 {
      font-size: 5rem;
    }
  }
  
  .home_hero__content p {
    font-size: 2.4rem;
    margin-bottom: calc(var(--margin) * 8);
    opacity: 0.6;
    letter-spacing: 0.2px;
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
    max-width: 65vw;
  }

  @media only screen and (max-width: 767px) {
    .home_hero__content img {
      max-width: 100%;
    }
  }
  
  .home_intro {
    position: relative;
  }
  
  .home_intro__wrapper {
    padding: calc(var(--padding) * 5) 0;
    position: relative;
  }

  @media only screen and (max-width: 767px) {
    .home_intro__wrapper {
      padding: calc(var(--padding) * 1) 0;
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
  }

  @media only screen and (max-width: 767px) {
    .home_intro__content p {
      font-size: 1.6rem;
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
    max-width: 15ch;
    line-height: 1;
  }
  
  @media only screen and (max-width: 767px) {
    .home_signup__content h1 {
      font-size: 4rem;
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

  /* Waitlist Page Style */
  
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

  /* Home Page Style */
  
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
    background: #d9d9d9;
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
    background: var(--white);
    backdrop-filter: blur(2px);
    font-weight: 700;
    cursor: pointer;
    transition: all ease 0.3s;
  }
  
  .home_signup__content__form__wrapper
    #mc_embed_signup_scroll
    input[type="submit"]:hover {
    transform: translatey(-10%);
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
`;

export { GlobalStyles };