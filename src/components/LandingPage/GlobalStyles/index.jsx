import { createGlobalStyle } from 'styled-components';

// fonts
import neueBoldFont from '../../../assets/landing-fonts/NeueHaasDisplayBold.ttf';
import neueRegularFont from '../../../assets/landing-fonts/NeueHaasDisplayRoman.ttf';

// Slick Styles
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

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
  --violet: #8a77ff;
  --cta-bg: linear-gradient(180deg, #f7f7f7 0%, #dcdeff 100%);
  --cta-hover-bg: #8a77ff;
  --container: 123rem;
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
  line-height: 0.9;
  font-weight: 700;
}

p {
  margin: 0;
  margin-bottom: 2rem;
  line-height: 1.3;
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
  min-width: calc(var(--padding) * 12);
  text-align: center;
  background: var(--cta-bg);
  color: var(--black);
  border: none;
  padding: calc(var(--padding) * 1.3) calc(var(--padding) * 2);
  border-radius: calc(var(--border-radius) * 1);
  text-decoration: none;
  backdrop-filter: blur(2px);
  cursor: pointer;
  font-size: 1.6rem;
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
  }

  .cta--secondary:hover {
    color: var(--black);
  }

  .cta:hover:before {
    transform: translate(-50%, -50%) scale(5) translateZ(0);
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
}

.scroll_margin {
  scroll-margin-top: 4rem;
}

.gradient_border {
  z-index: 1;
  position: relative;
}

.gradient_border::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 1px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: -1;
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
    background: rgba(0, 0, 0, 0);
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
  border: solid 1px #6847a0;
  min-width: auto;
}

@media only screen and (max-width: 1024px) {
  .cta--header {
    display: none;
  }
}

.header .container {
  padding-top: calc(var(--padding) * 3);
  padding-bottom: calc(var(--padding) * 3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 136rem;
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
    background: rgb(48, 1, 71);
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 1) 0%,
      rgba(16, 16, 16, 1) 50%,
      rgba(138, 119, 255, 1) 100%
    );
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
  margin-right: 10rem;
}

#menu li {
  display: block;
  float: left;
  margin: 0 3rem;
  position: relative;
}

#menu li a {
  background: none;
  border: none;
  font-size: 1.6rem;
  line-height: 1.2;
  cursor: pointer;
  position: relative;
  color: var(--white);
  transition: all 0.3s ease 0s;
  text-decoration: none;
  position: relative;
  z-index: 2;
}

#menu li a.active:after {
  content: "";
  position: absolute;
  left: -1rem;
  right: -1rem;
  bottom: -1rem;
  height: 1px;
  background: rgb(20, 18, 28);
  background: linear-gradient(
    90deg,
    rgba(20, 18, 28, 1) 0%,
    rgba(103, 99, 122, 1) 20%,
    rgba(200, 198, 204, 1) 35%,
    rgba(200, 198, 204, 1) 65%,
    rgba(103, 99, 122, 1) 80%,
    rgba(20, 18, 28, 1) 100%
  );
}

#menu li a.active--no-style:after {
  content: none;
}

#menu li a:hover {
  opacity: 0.75;
}

#menu li a.active:hover {
  opacity: 1 !important;
}

#menu li a.active--no-style:hover {
  opacity: 0.75 !important;
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

#menu > li > a:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 30%;
  width: 10px;
  height: 10px;
  background: url("https://cdn.pillarx.app/arrow-down.png");
  background-size: contain;
  right: -2rem;
  transition: all 0.3s ease;
}

#menu > li > ul {
  z-index: 1;
  display: none;
  position: absolute;
  top: -1.2rem;
  left: 50%;
  padding: calc(var(--padding) * 4) calc(var(--padding) * 0.5)
    calc(var(--padding) * 0.5) calc(var(--padding) * 0.5);
  margin: 0;
  background: rgba(17, 17, 17, 0.8);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 0.8rem;
  transform: translateX(-42%);
  min-width: 13rem;
}

#menu > li > ul::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 1px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: -1;
  border-radius: 0.8rem;
}

@media only screen and (min-width: 1025px) {
  #menu li:hover > ul {
    display: inherit;
  }

  #menu > li:hover > a::after {
    transform: rotate(180deg);
  }
}

@media only screen and (max-width: 1024px) {
  #menu li > ul {
    display: inherit;
    position: relative;
    margin-top: -18%;
    transform: translateX(-50%);
    min-width: 150px;
  }

  #menu li ul li {
    text-align: center !important;
  }

  #menu li ul li a {
    line-height: 1.2;
  }

  #menu > li > a::after {
    transform: rotate(180deg);
  }
}

#menu li ul li {
  display: block;
  width: 100%;
  margin: 0;
  margin-bottom: calc(var(--margin) * 0.5);
  position: relative;
  white-space: nowrap;
  text-align: left;
}

#menu li ul li a {
  display: block;
  padding: calc(var(--padding) * 0.5) calc(var(--padding) * 0.5);
  transition: none;
}

#menu li ul li:last-child {
  margin-bottom: 0;
}

#menu li ul li a:hover {
  background: linear-gradient(
    93.73deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.03) 22.6%,
    rgba(255, 255, 255, 0.01) 77.88%,
    rgba(255, 255, 255, 0.05) 100%
  );
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 0.4rem;
  opacity: 1 !important;
}

#menu li ul li a.active {
  background: linear-gradient(
    93.73deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.03) 22.6%,
    rgba(255, 255, 255, 0.01) 77.88%,
    rgba(255, 255, 255, 0.05) 100%
  );
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 0.4rem;
}

#menu li ul li a.active::after {
  content: none;
}

.header__login {
  width: 7.5rem;
  min-width: 7.5rem;
  border-radius: 1rem;
  padding: 1.1rem;
  font-size: 1.6rem;
}

@media only screen and (max-width: 1024px) {
  .header__login {
    margin-top: 1rem;
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
  flex-direction: column;
  gap: 3rem;
}

@media only screen and (max-width: 767px) {
  .footer__wrapper {
    padding: calc(var(--padding) * 4) 0;
  }
}

.footer__disclaimer {
  flex: 1;
  width: 100%;
}

.footer__disclaimer p {
  font-size: 1.2rem;
  font-style: italic;
  text-align: left;
  max-width: 120ch;
}

.footer__links_wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}


.footer__links a {
  font-size: 1.4rem;
  transition: all ease 0.3s;
  border-bottom: solid 1px #ffffff;
}

.footer__links a:hover {
  opacity: 0.7;
}

.footer__socials {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.footer__socials a {
  width: 2.5rem;
  transition: all ease 0.3s;
}

.footer__socials a:hover {
  opacity: 0.7;
}

/* Home Page Styles */

.home_hero {
  background: url("https://cdn.pillarx.app/home-hero-bg.svg");
  background-position: center bottom;
  background-position: center calc(100% - 80px);
  background-repeat: no-repeat;
  padding: calc(var(--padding) * 16) 0 0 0;
  position: relative;
}

@media only screen and (max-width: 767px) {
  .home_hero {
    padding: calc(var(--padding) * 7) 0 0 0;
    background-size: 400%;
  }
}

.home_hero__wrapper {
  padding: calc(var(--padding) * 5) 0 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7rem;
}

@media only screen and (max-width: 767px) {
  .home_hero__wrapper {
    padding: calc(var(--padding) * 5) 0;
    gap: 4rem;
  }
}

.home_hero__wrapper::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 10%;
  width: 50%;
  max-width: 59rem;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  transform: translateX(-50%);
  background: var(--violet);
  mix-blend-mode: plus-lighter;
  filter: blur(150px);
}

@media only screen and (max-width: 767px) {
  .home_hero__wrapper::before {
    width: 90%;
  }
}

.home_hero__content {
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

@media only screen and (max-width: 767px) {
  .home_hero__content {
    gap: 2rem;
  }
}

.home_hero__content h1 {
  font-size: 7.5rem;
  max-width: 20ch;
  margin-bottom: 0;
}

@media only screen and (max-width: 767px) {
  .home_hero__content h1 {
    font-size: 4rem;
  }
}

.home_hero__content p {
  font-size: 2.2rem;
  letter-spacing: 0.2px;
  max-width: 44ch;
  opacity: 0.7;
  margin-bottom: 0;
}

@media only screen and (max-width: 767px) {
  .home_hero__content p {
    font-size: 1.8rem;
  }
}

.home_hero__cta {
  margin-top: calc(var(--margin) * 1);
}

.home_hero__image {
  position: relative;
}

.home_hero__image img {
  width: 100%;
  max-width: 105rem;
}

.home_feature {
  position: relative;
}

.home_feature__wrapper {
  padding: calc(var(--padding) * 10) 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media only screen and (max-width: 767px) {
  .home_feature__wrapper {
    padding: 0;
  }
}

.home_feature__detail {
  display: flex;
  gap: 1rem;
}

.home_feature__detail--reverse {
  flex-direction: row-reverse;
}

@media only screen and (max-width: 767px) {
  .home_feature__detail {
    flex-direction: column;
  }
}

.home_feature__detail__image {
  width: 50%;
  display: flex;
  position: relative;
  justify-content: center;
  background: linear-gradient(180deg, #6154b3 0%, #161328 100%);
  border-radius: 2.4rem;
  padding: 4rem;
}

.home_feature__detail__image::before {
  border-radius: 2.4rem;
}

.home_feature__detail__image--large {
  padding: 3rem;
}

@media only screen and (max-width: 767px) {
  .home_feature__detail__image {
    width: 100%;
    padding: 2rem 2rem 11rem 2rem;
    border-radius: 1.2rem;
  }

  .home_feature__detail__image::before {
    border-radius: 1.2rem;
  }
}

.home_feature__detail__image video {
  width: 100%;
  max-width: 17.5rem;
  border-radius: 1.6rem;
  overflow: hidden;
}

.home_feature__detail__image--large video {
  max-width: 23.5rem;
}

@media only screen and (max-width: 767px) {
  .home_feature__detail__image video {
    border-radius: 1.2rem;
  }
}

.home_feature__detail__content {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 4rem 3.6rem;
  filter: drop-shadow(0px 20px 4px rgba(0, 0, 0, 0.1));
}

.home_feature__detail__content::before {
  border-radius: 2.4rem;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.8) 100%
  );
  opacity: 0.1;
  transition: all ease 0.3s;
}

.home_feature__detail__content:hover::before {
  opacity: 0.18;
}

@media only screen and (max-width: 767px) {
  .home_feature__detail__content {
    width: 100%;
    padding: 2rem 1.8rem;
    border-radius: 1.2rem;
    margin-top: -10rem;
    background: rgba(0, 0, 0, 0);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }

  .home_feature__detail__content::before {
    border-radius: 1.2rem;
  }

  .home_feature__detail__content--column {
    margin-top: 0;
  }
}

.home_feature__detail__content h4 {
  font-size: 1.4rem;
  text-align: left;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 4rem;
  background: linear-gradient(
    93.73deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.03) 22.6%,
    rgba(255, 255, 255, 0.01) 77.88%,
    rgba(255, 255, 255, 0.05) 100%
  );
  padding: 1rem 1.2rem;
  margin-top: -0.7rem;
}

@media only screen and (max-width: 767px) {
  .home_feature__detail__content h4 {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
}

.home_feature__detail__content h2 {
  font-size: 4.2rem;
  text-align: left;
  font-weight: 600;
  margin-bottom: 1.6rem;
}

.home_feature__detail__content h2 span {
  opacity: 0.5;
  line-height: 0.9;
}

.home_feature__detail__content--column h2 {
  font-size: 3.2rem;
}

@media only screen and (max-width: 767px) {
  .home_feature__detail__content h2 {
    font-size: 2.6rem;
  }

  .home_feature__detail__content--column h2 {
    font-size: 2rem;
  }
}

.home_feature__detail__content p {
  font-size: 1.6rem;
  letter-spacing: 0.2px;
  max-width: 41.5ch;
  opacity: 0.7;
  margin-bottom: 0;
  text-align: left;
}

.home_feature__detail__content--column p {
  max-width: 39ch;
}

@media only screen and (max-width: 767px) {
  .home_feature__detail__content p br {
    display: none;
  }
}

.home_feature__detail__content__icon {
  margin-top: 4rem;
  flex: 1;
  display: flex;
  width: 100%;
  align-items: flex-end;
}

@media only screen and (max-width: 767px) {
  .home_feature__detail__content__icon {
    margin-top: 2rem;
  }
}

.home_feature__detail__content__icon h4 {
  margin-bottom: 0;
  border-radius: 2.5rem;
}

.home_feature__detail__content__icon__wrapper {
  display: flex;
  flex: 1;
  justify-content: flex-end;
}

@media only screen and (max-width: 767px) {
  .home_feature__detail__content__icon__wrapper img {
    max-height: 2.5rem;
  }
}

.home_app {
  position: relative;
  z-index: 2;
}

.home_app__wrapper {
  padding: calc(var(--padding) * 10) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media only screen and (max-width: 767px) {
  .home_app__wrapper {
    padding: calc(var(--padding) * 4) 0 0 0;
  }
}

.home_app__subscribe {
  padding: 6rem 4rem 1.5rem 4rem;
  background: linear-gradient(
    0deg,
    rgba(138, 119, 255, 0.3) -0.1%,
    #8a77ff 100%
  );
  mix-blend-mode: plus-lighter;
  border-radius: 2.4rem;
  width: 100%;
  max-width: 91.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media only screen and (max-width: 767px) {
  .home_app__subscribe {
    padding: 4rem 1.5rem 2rem 1.5rem;
    border-radius: 1.2rem;
  }
}

.home_app__subscribe h2 {
  font-size: 4.2rem;
  text-align: center;
  font-weight: 600;
  margin-bottom: 1.6rem;
}

@media only screen and (max-width: 767px) {
  .home_app__subscribe h2 {
    font-size: 2.6rem;
  }
}

.home_app__subscribe p {
  font-size: 1.8rem;
  letter-spacing: 0.2px;
  max-width: 34ch;
  margin-bottom: 4.2rem;
  text-align: center;
  opacity: 0.7;
}

@media only screen and (max-width: 767px) {
  .home_app__subscribe p {
    margin-bottom: 3.2rem;
    font-size: 1.6rem;
  }
}

.home_app__subscribe__form {
  min-width: 34rem;
  margin-top: -2em;
  padding-bottom: 3.5rem;
}

@media only screen and (max-width: 767px) {
  .home_app__subscribe__form {
    min-width: 100%;
    padding-bottom: 0;
  }
}

.home_app__subscribe__form input[type=email] {
  width: 100% !important;
  background: #2a244d !important;
  border-radius: 1.2rem !important;
  font-size: 1.6rem !important;
  border: 0 !important;
  padding: 3rem 13.5rem 3rem 1.8rem !important;
  font-family: var(--font-neue) !important;
  color: var(--white) !important;
}

.home_app__subscribe__form input::placeholder {
  color: var(--white) !important;
  opacity: 0.6 !important;
}

.home_app__subscribe__form input[type=submit] {
  position: absolute;
  right: 2px;
  top: 2px;
  bottom: 15px;
  font-family: var(--font-neue) !important;
  border-radius: 1rem !important;
  background: var(--white) !important;
  color: var(--black) !important;
  font-weight: 700 !important;
  font-size: 1.7rem !important;
  min-width: 12rem !important;
}

.emailoctopus-success-message, .emailoctopus-error-message {
  color: var(--white) !important;
}

.home_app__subscribe .mailchimp_form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  z-index: 3;
  position: relative;
  width: 100%;
  align-items: center;
}

@media only screen and (max-width: 767px) {
  .home_app__subscribe .mailchimp_form {
    gap: 1rem;
  }
}

.home_app__subscribe .mailchimp_form form {
  position: relative;
  width: 100%;
  max-width: 34rem;
}

.home_app__subscribe .mailchimp_form form label {
  display: none;
}

.home_app__subscribe .mailchimp_form form input {
  width: 100%;
  background: #2a244d;
  border-radius: 1.2rem;
  font-size: 1.6rem;
  border: 0;
  padding: 1.8rem 13.5rem 1.8rem 1.8rem;
}

.home_app__subscribe .mailchimp_form form input:focus {
  border: none;
  outline: none;
}

.home_app__subscribe .mailchimp_form form input::placholder {
  opacity: 0.6;
}

.home_app__subscribe .mailchimp_form form button {
  position: absolute;
  right: 0.3rem;
  top: 0.3rem;
  bottom: 0.3rem;
  width: 11.5rem;
  border-radius: 1rem;
}

.home_app__subscribe .mailchimp_form__message {
  font-size: 1.8rem;
  letter-spacing: 0.2px;
  max-width: 100%;
  margin-bottom: 0;
  height: 3rem;
  overflow: visible;
}

@media only screen and (max-width: 767px) {
  .home_app__subscribe .mailchimp_form__message {
    font-size: 1.4rem;
    height: 2rem;
  }
}

.home_app__download {
  padding: 20rem 4rem 4.5rem 4rem;
  border-radius: 2.4rem;
  width: 100%;
  max-width: 91.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5rem;
  filter: drop-shadow(0px 20px 4px rgba(0, 0, 0, 0.1));
  margin-top: -14rem;
  position: relative;
  pointer-events: none;
  display: none;
}

.home_app__download::before {
  opacity: 0.1;
  border-radius: 2.4rem;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.8) 100%
  );
}

@media only screen and (max-width: 767px) {
  .home_app__download {
    padding: 16rem 1.5rem 2rem 1.5rem;
    margin-top: -13rem;
    border-radius: 1.2rem;
    flex-direction: column;
    gap: 2rem;
  }

  .home_app__download::before {
    border-radius: 1.2rem;
  }
}

.home_app__download__copy {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media only screen and (max-width: 767px) {
  .home_app__download__copy {
    width: 100%;
  }
}

.home_app__download__copy h3 {
  font-size: 3.2rem;
  text-align: center;
  font-weight: 600;
  margin-bottom: 0;
  text-align: left;
  opacity: 0.5;
}

@media only screen and (max-width: 767px) {
  .home_app__download__copy h3 {
    font-size: 2rem;
  }
}

.home_app__download__copy img {
  max-width: 28rem;
}

@media only screen and (max-width: 767px) {
  .home_app__download__copy img {
    max-width: 18rem;
  }
}

.home_app__download__cta {
  width: 50%;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  pointer-events: all;
}

@media only screen and (max-width: 767px) {
  .home_app__download__cta {
    width: 100%;
  }
}

.home_app__download__cta a {
  filter: drop-shadow(0px 4px 20px rgba(255, 255, 255, 0.1));
  transition: all ease 0.3s;
}

.home_app__download__cta a:hover {
  transform: translateY(-0.2rem);
}

.home_about {
  position: relative;
  background: url("https://cdn.pillarx.app/home-bg.svg");
  background-position: top center;
  background-repeat: no-repeat;
}

@media only screen and (max-width: 767px) {
  .home_about {
    background: none;
  }
}

.home_about::before {
  content: "";
  position: absolute;
  left: 0;
  top: -10%;
  width: 42rem;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  transform: translateX(-50%);
  background: var(--violet);
  mix-blend-mode: plus-lighter;
  filter: blur(150px);
}

@media only screen and (max-width: 767px) {
  .home_about::before {
    top: 50%;
    width: 30rem;
    transform: translateX(-50%) translateY(-50%);
  }
}

.home_about__wrapper {
  padding: calc(var(--padding) * 14.5) 0 calc(var(--padding) * 5) 0;
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  position: relative;
}

@media only screen and (max-width: 767px) {
  .home_about__wrapper {
    padding: calc(var(--padding) * 4) 0;
    flex-direction: column;
  }
}

.home_about__wrapper h2 {
  width: 50%;
  font-size: 4.2rem;
  text-align: left;
  font-weight: 600;
  margin-bottom: 0;
}

@media only screen and (max-width: 767px) {
  .home_about__wrapper h2 {
    width: 100%;
    font-size: 2.6rem;
  }
}

.home_about__wrapper p {
  font-size: 1.6rem;
  letter-spacing: 0.2px;
  max-width: 50ch;
  margin-bottom: 0;
  text-align: left;
}

.home_about__wrapper p a {
  border-bottom: solid 1px var(--white);
}

/* Waitlist Page Styles */

.home_signup--waitlist .home_signup__wrapper {
  padding: calc(var(--padding) * 29) 0 calc(var(--padding) * 15) 0;
  position: relative;
}

@media only screen and (max-width: 767px) {
  .home_signup--waitlist .home_signup__wrapper {
    padding: calc(var(--padding) * 18) 0 calc(var(--padding) * 5) 0;
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

.home_signup__content__form--waitlist input.gw-w-full,
.home_signup__content__form--waitlist button.gw-w-full {
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
  background: #4327b1;
  filter: blur(150px);
}

.developers_hero__content {
  position: relative;
  text-align: left;
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
  background-image: url("https://cdn.pillarx.app/developer-feature-bg-1.png");
  background-position: center center;
}

.developers_feature__detail:nth-child(2) {
  background-image: url("https://cdn.pillarx.app/developer-feature-bg-2.png");
  background-position: center center;
}

.developers_feature__detail:nth-child(3) {
  background-image: url("https://cdn.pillarx.app/developer-feature-bg-3.png");
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
    gap: 6rem;
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
  background: #4327b1;
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
  gap: 2rem;
}

@media only screen and (max-width: 1079px) {
  .developers_ui__image {
    width: 100%;
    max-width: 60rem;
  }
}

@media only screen and (max-width: 767px) {
  .developers_ui__image {
    gap: 1rem;
  }
}

.developers_ui__image__wrapper {
  width: calc(50% - 1rem);
  padding: 1rem;
  border-radius: calc(var(--border-radius) * 4);
  background: rgba(94, 0, 255, 0.2);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  border: solid 1px #5e5e5e;
}

@media only screen and (max-width: 767px) {
  .developers_ui__image__wrapper {
    width: calc(50% - 0.5rem);
    padding: 0.5rem;
    border-radius: calc(var(--border-radius) * 2);
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
  border-radius: calc(var(--border-radius) * 3);
  filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.5));
}

@media only screen and (max-width: 767px) {
  .developers_ui__image__wrapper video {
    border-radius: calc(var(--border-radius) * 1.5);
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
    gap: 6rem;
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
  background: #4327b1;
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
  background: linear-gradient(
    180deg,
    rgba(94, 0, 255, 1) 0%,
    rgba(145, 90, 239, 1) 100%
  );
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

.developers_module__list__carousel__slide__content--last img {
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
  background: linear-gradient(180deg, #5e00ff 0%, rgba(94, 0, 255, 0.58) 100%);
  border-radius: calc(var(--border-radius) * 1.6);
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
  border-radius: calc(var(--border-radius) * 2.4);
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
    gap: 4rem;
  }
}

.developers_choose__wrapper::before {
  content: "";
  position: absolute;
  top: 20%;
  bottom: 20%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: #4327b1;
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
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: rgb(20, 18, 28);
  background: linear-gradient(
    90deg,
    rgba(20, 18, 28, 1) 0%,
    rgba(103, 99, 122, 1) 20%,
    rgba(200, 198, 204, 1) 35%,
    rgba(200, 198, 204, 1) 65%,
    rgba(103, 99, 122, 1) 80%,
    rgba(20, 18, 28, 1) 100%
  );
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
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 33.33%;
  width: 1px;
  background: rgb(20, 18, 28);
  background: linear-gradient(
    180deg,
    rgba(20, 18, 28, 1) 0%,
    rgba(103, 99, 122, 1) 20%,
    rgba(200, 198, 204, 1) 35%,
    rgba(200, 198, 204, 1) 65%,
    rgba(103, 99, 122, 1) 80%,
    rgba(20, 18, 28, 1) 100%
  );
}

@media only screen and (max-width: 767px) {
  .developers_choose__list:before {
    content: none;
  }
}

.developers_choose__list:after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  right: 33.33%;
  width: 1px;
  background: rgb(20, 18, 28);
  background: linear-gradient(
    180deg,
    rgba(20, 18, 28, 1) 0%,
    rgba(103, 99, 122, 1) 20%,
    rgba(200, 198, 204, 1) 35%,
    rgba(200, 198, 204, 1) 65%,
    rgba(103, 99, 122, 1) 80%,
    rgba(20, 18, 28, 1) 100%
  );
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
  border-radius: calc(var(--border-radius) * 1.6);
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

/* Privacy Page Styles */

.privacy {
  padding: calc(var(--padding) * 10) 0 0 0;
  position: relative;
}

@media only screen and (max-width: 767px) {
  .privacy {
    padding: calc(var(--padding) * 8) 0 0 0;
  }
}

/* .privacy::before {
    content: "";
    position: absolute;
    left: 0;
    top: -20%;
    right: 20%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    transform: translateX(-30%) translateY(-30%);
    background: #4327B1;
    filter: blur(150px);
  } */

.privacy__wrapper {
  padding: calc(var(--padding) * 5) 0;
  position: relative;
  text-align: left;
}

@media only screen and (max-width: 767px) {
  .privacy__wrapper {
    padding: calc(var(--padding) * 5) 0;
  }
}

.privacy__wrapper h1 {
  font-size: 3rem;
  font-weight: 600;
}

@media only screen and (max-width: 767px) {
  .privacy__wrapper h1 {
    font-size: 2.4rem;
  }
}

.privacy__wrapper h2 {
  font-size: 2.4rem;
  margin-top: 4rem;
  font-weight: 600;
}

@media only screen and (max-width: 767px) {
  .privacy__wrapper h2 {
    font-size: 2rem;
  }
}

.privacy__wrapper p {
  font-size: 2rem;
  max-width: 80ch;
}

@media only screen and (max-width: 767px) {
  .privacy__wrapper p {
    font-size: 1.8rem;
  }
}

.privacy__wrapper p a {
  border-bottom: solid 1px #cccccc;
}

/* Advertising Page Styles */

.advertising_hero {
  background: url("https://cdn.pillarx.app/advertising-hero-bg.svg");
  background-position: center top;
  background-position: center 160px;
  background-repeat: no-repeat;
  padding: calc(var(--padding) * 16) 0 0 0;
  position: relative;
}

@media only screen and (max-width: 767px) {
  .advertising_hero {
    padding: calc(var(--padding) * 7) 0 0 0;
    background: none;
  }
}

.advertising_hero__wrapper {
  padding: calc(var(--padding) * 5) 0 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 17rem;
}

@media only screen and (max-width: 767px) {
  .advertising_hero__wrapper {
    padding: calc(var(--padding) * 5) 0;
    gap: 5rem;
  }
}

.advertising_hero__wrapper::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 50%;
  max-width: 59rem;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  transform: translateX(-50%) translateY(-50%);
  background: var(--violet);
  mix-blend-mode: plus-lighter;
  filter: blur(150px);
}

@media only screen and (max-width: 767px) {
  .advertising_hero__wrapper::before {
    width: 90%;
  }
}

.advertising_hero__content {
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

@media only screen and (max-width: 767px) {
  .advertising_hero__content {
    gap: 2rem;
  }
}

.advertising_hero__content h1 {
  font-size: 6rem;
  max-width: 20ch;
  margin-bottom: 0;
}

@media only screen and (max-width: 767px) {
  .advertising_hero__content h1 {
    font-size: 4rem;
  }
}

.advertising_hero__content p {
  font-size: 2.2rem;
  letter-spacing: 0.2px;
  max-width: 40ch;
  margin-bottom: 0;
}

.advertising_hero__content p span {
  opacity: 0.7;
}

@media only screen and (max-width: 767px) {
  .advertising_hero__content p {
    font-size: 1.8rem;
  }
}

.advertising_hero__cta {
  margin-top: calc(var(--margin) * 1);
}

.advertising_hero__inapp {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.advertising_hero__inapp__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 80rem;
  background: rgba(78, 68, 138, 0.1);
  background-blend-mode: plus-lighter;
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(7.5px);
  border-radius: 2.4rem;
  padding: 4rem 4rem 4rem 4rem;
  aspect-ratio: 800 / 510;
}

@media only screen and (max-width: 1024px) {
  .advertising_hero__inapp__content {
    aspect-ratio: unset;
    padding-bottom: 11rem;
  }
}

@media only screen and (max-width: 767px) {
  .advertising_hero__inapp__content {
    padding-bottom: 51rem;
  }
}

.advertising_hero__inapp__content h4 {
  font-size: 1.4rem;
  text-align: center;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 2.4rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 1.2rem;
  margin-top: -0.7rem;
}

@media only screen and (max-width: 767px) {
  .advertising_hero__inapp__content h4 {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
}

.advertising_hero__inapp__content h2 {
  font-size: 4.2rem;
  text-align: center;
  font-weight: 600;
  margin-bottom: 1.6rem;
}

@media only screen and (max-width: 767px) {
  .advertising_hero__inapp__content h2 {
    font-size: 2.6rem;
  }
}

.advertising_hero__inapp__images {
  display: flex;
  position: relative;
  margin-top: -32rem;
  max-width: 101rem;
  transform: translateX(-4.5%);
}

@media only screen and (max-width: 1140px) {
  .advertising_hero__inapp__images {
    transform: translateX(0);
  }
}

@media only screen and (max-width: 1024px) {
  .advertising_hero__inapp__images {
    margin-top: -10rem;
  }
}

@media only screen and (max-width: 767px) {
  .advertising_hero__inapp__images {
    flex-direction: column;
    gap: 1rem;
    margin-top: -50rem;
  }
}

.advertising_hero__inapp__images__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.advertising_hero__inapp__images__wrapper img {
  width: 100%;
}

@media only screen and (max-width: 767px) {
  .advertising_hero__inapp__images__wrapper img {
    width: 95%;
  }

  .advertising_hero__inapp__images__wrapper:last-child img {
    max-width: 23.5rem;
  }
}

.advertising_hero__inapp__images__wrapper p {
  font-size: 1.6rem;
  margin-bottom: 0;
  opacity: 0.7;
}

@media only screen and (max-width: 1024px) {
  .advertising_hero__inapp__images__wrapper p {
    font-size: 1.2rem;
  }
}

.advertising_hero__inapp__images__wrapper p a {
  border-bottom: solid 1px rgba(255, 255, 255, 0.7);
}

.advertising_feature {
  position: relative;
}

.advertising_feature__wrapper {
  padding: calc(var(--padding) * 10) 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media only screen and (max-width: 767px) {
  .advertising_feature__wrapper {
    padding: 1rem 0 0 0;
  }
}

.advertising_feature__detail {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 91.5rem;
}

@media only screen and (max-width: 767px) {
  .advertising_feature__detail {
    flex-direction: column;
  }
}

.advertising_feature__detail__content {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 3.2rem;
  filter: drop-shadow(0px 20px 4px rgba(0, 0, 0, 0.1));
}

.advertising_feature__detail__content::before {
  border-radius: 2.4rem;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.8) 100%
  );
  opacity: 0.1;
  transition: all ease 0.3s;
}

.advertising_feature__detail__content:hover::before {
  opacity: 0.18;
}

.advertising_feature__detail:first-child
  .advertising_feature__detail__content:first-child {
  width: 60%;
  background: url("https://cdn.pillarx.app/advertising-feature.webp");
  background-size: 30rem;
  background-position: bottom right;
  background-repeat: no-repeat;
}

.advertising_feature__detail:first-child
  .advertising_feature__detail__content:last-child {
  width: 40%;
}

@media only screen and (max-width: 767px) {
  .advertising_feature__detail__content {
    width: 100% !important;
    padding: 2rem 1.8rem;
    border-radius: 1.2rem;
  }

  .advertising_feature__detail__content::before {
    border-radius: 1.2rem;
  }
}

.advertising_feature__detail__content h2 {
  font-size: 2.8rem;
  text-align: left;
  font-weight: 600;
  margin-bottom: 8.5rem;
}

.advertising_feature__detail__content h2 span {
  opacity: 0.5;
  line-height: 0.9;
}

@media only screen and (max-width: 767px) {
  .advertising_feature__detail__content h2 {
    font-size: 2rem;
    margin-bottom: 3rem;
  }
  .advertising_feature__detail:first-child
    .advertising_feature__detail__content:first-child {
    background-size: 24rem;
  }

  .advertising_feature__detail:first-child
    .advertising_feature__detail__content:first-child
    h2 {
    margin-bottom: 11rem;
  }
}

.advertising_feature__detail__content__icon {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

@media only screen and (max-width: 767px) {
  .advertising_feature__detail__content__icon img {
    max-height: 2.5rem;
  }
}

.advertising_contact {
  position: relative;
}

.advertising_contact__wrapper {
  padding: calc(var(--padding) * 10) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media only screen and (max-width: 767px) {
  .advertising_contact__wrapper {
    padding: calc(var(--padding) * 4) 0;
  }
}

.advertising_contact__content {
  padding: 5rem 4rem 5rem 4rem;
  background: linear-gradient(
    0deg,
    rgba(138, 119, 255, 0.3) -0.1%,
    #8a77ff 100%
  );
  mix-blend-mode: plus-lighter;
  border-radius: 2.4rem;
  width: 100%;
  max-width: 91.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media only screen and (max-width: 767px) {
  .advertising_contact__content {
    padding: 4rem 1.5rem 5rem 1.5rem;
    border-radius: 1.2rem;
  }
}

.advertising_contact__content h2 {
  font-size: 4.2rem;
  text-align: center;
  font-weight: 600;
  margin-bottom: 4.2rem;
  max-width: 20ch;
}

@media only screen and (max-width: 767px) {
  .advertising_contact__content h2 {
    font-size: 2.6rem;
    margin-bottom: 2.1rem;
  }
}

`;

export { GlobalStyles };
