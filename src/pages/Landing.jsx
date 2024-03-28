import React from 'react';
import { useLocation } from 'react-router-dom';
import { Text, Heading, Img, Form } from '../components/LandingPage';

import '../styles/landing/tailwind.css';
import '../styles/landing/index.css';

export default function LandingPage() {
  const searchParams = new URLSearchParams(useLocation().search);
  const signupStatus = searchParams.get('signup');

  let confirmationMessage = '';
  if (signupStatus === 'complete') {
    confirmationMessage = 'Signup process completed successfully!';
  }

  const sectionRef = React.useRef(null);
  const scrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="flex flex-col items-center justify-start w-full sm:pb-5 pb-[30px] bg-black-900">
      <div className="flex flex-col items-center justify-start w-full">
        <div className="h-[1374px] w-full z-[1] relative">
          <div className="flex flex-col items-center justify-start w-full top-0 right-0 left-0 m-auto absolute">
            <div className="h-16 gap-4 w-full  top-0 bg-purple-900 flex justify-center items-center px-4 border-b border-gray-300">
              <div className="items-center gap-4 font-semibold text-white-A700 font-custom">
                Building dApps? Join the PillarX Testing Campaign before April 26th
              </div>
              <button
                onClick={scrollToSection}
                className="w-32 h-10 flex-shrink-0 rounded-lg font-custom border border-gray-300 bg-opacity-50 backdrop-blur-md text-white-A700 font-semibold"
              >
                Register now
              </button>
            </div>
            <Img
              src="/images/topShadow.png"
              alt="top shadow"
              className="h-auto sm:w-full w-full sm:mt-[130px] object-fill"
              loading="lazy"
            />
          </div>
          <div className="h-[270px] md:w-[25%] w-[20%] z-[1] relative">
            <Img
              src="/images/logoBox.png"
              alt="logo box"
              className="justify-center sm:h-[210px] md:h-[250px] h-[220px] sm:mt-[7px] sm:w-full w-full sm:ml-[-20px] left-0 bottom-0 right-0 top-0 m-auto opacity-0.8 absolute rounded-[80px]"
              loading="lazy"
            />
            <Img
              src="/images/pillarXLogo.svg"
              alt="pillarX logo"
              className="sm:h-[12px] md:h-[12px] h-[19px] sm:left-[6%] left-[21%] top-[45%] m-auto absolute"
            />
          </div>
          <div className="flex flex-col items-start justify-start w-[49%] gap-1.5 right-[5%] top-[8%] m-auto absolute">
            <div className="flex flex-row justify-between items-start w-full">
              <button onClick={scrollToSection}>
                <Text as="p" className="mt-[5px] text-center font-custom  sm:ml-[-20px]">
                  For developers
                  <div className="h-px opacity-0.5 bg-gradient rounded-[1px] mt-1 w-90% align-center" />
                </Text>
              </button>
              <a href="https://twitter.com/PX_Web3" target="_blank" rel="noreferrer">
                <Img src="/images/backSide.svg" alt="back side" className="h-[27px] w-[28px]" loading="lazy" />
              </a>
            </div>
          </div>
          {confirmationMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-4 h-16 sm:w-[90%] w-[40%] mt-[10px] sm:ml-[20px] sm:mr-[20px] md:ml-[50px] ml-[100px]">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-lg">{confirmationMessage}</p>
                </div>
              </div>
            </div>
          )}
          <div className="h-[628px] w-full sm:top-[10%] md:top-[10%] top-[5%] sm:mt-[-140px] right-0 left-0 relative">
            <Img
              src="/images/middleShadow.png"
              alt="middle shadow"
              className="justify-center h-[638px] w-full left-0 bottom-0 right-0 top-0 object-fill sm:object-contain sm:mt-[-200px] md:mt-[-130px] absolute rounded-[80px] opacity-0.5"
              loading="lazy"
            />
            <div className="flex flex-col items-center justify-center w-full h-full left-0 bottom-0 right-0 top-0 m-auto absolute">
              <Img
                src="/images/centerLogo.png"
                alt="center logo"
                className="sm:w-[300px] md:w-[35%] w-[25%] md:h-auto sm:w-full object-cover"
                loading="lazy"
              />
              <Text
                size="s"
                as="p"
                className="sm:w-[300px] md:w-[30%] w-[15%] mt-[31px] !text-white-A700_90 text-center opacity-0.9 font-custom"
              >
                Advancing the way you connect with Web3
              </Text>
              <div className="flex md:flex-col flex-row sm:w-[90%]  w-[65%] justify-between items-center w-full sm:mt-[80px] mt-[210px] p-[34px] md:gap-10 sm:p-5 border border-solid border_box bg-gray-900_33 rounded-[21px]">
                <div className="flex sm:flex-col flex-row justify-start md:w-full w-full mr-[21px] sm:gap-5 md:gap-10 gap-20 sm:mr-5">
                  <Heading size="xs" as="h2" className="sm:w-full sm:text-center md:w-full w-[20%] font-custom">
                    Join our exclusive early access list!
                  </Heading>
                  <Form />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col flex-row items-center justify-start sm:px-0 px-50 sm:gap-0 gap-80 sm:mt-[-400px]  mt-[-270px]">
          <Img
            src="/images/pillar_big_logo.png"
            alt="pillar logo"
            className="sm:h-[150px] md:h-[212px] h-[252px] sm:w-[25%] sm:left-0 left-[10%] sm:mt-0 mt-[40px] object-cover mr-5 mb-5 mb-0 sm:ml-0 md:ml-[-30px] ml-[-50px] relative"
            loading="lazy"
          />
          <div className="text-center sm:w-full md:w-[35%] w-[35%] sm:mt-[10px] sm:ml-0 md:ml-[-100px] ml-[170px]">
            <Heading as="h1" className="text-center mb-[50px]">
              What is PX?
            </Heading>
            <Text as="p" className="!text--A700_90 text-center opacity-0.6 font-custom sm:px-6">
              PillarX is the next evolution in the Pillar Project story, built on the pillars of controlling your
              assets and data, PillarX will provide an unparalleled experience in interacting with the Web3 ecosystem.
            </Text>
          </div>
        </div>
        <div className="flex flex-row w-auto items-start right-0 justify-start mt-[50px]">
          <Img
            src="/images/centerLineGradient.png"
            alt="center image"
            className="h-auto w-[80%] mt-[-5px] opacity-0.6 object-cover rounded-[76px]"
            loading="lazy"
          />
          <Img
            src="/images/centerLogo.png"
            alt="center logo"
            className="sm:h-[80px] h-[170px] w-1/2  sm:left-[-150px] left-[-250px] sm:mt-0 mt-[20px]  bottom-0 right-0 m-auto object-fill relative"
            loading="lazy"
          />
        </div>
        <div className="h-[1433px] w-full mt-[-1px] relative">
          <div className="flex flex-col items-center justify-center h-full left-0 bottom-0 right-0 top-0 m-auto absolute">
            <div className="h-[657px] sm:w-full w-[657px]  blue_gray_border rounded-[328px]" />
            <div className="h-[1076px] w-full mt-[-300px] relative">
              <Img
                src="/images/bottomRightShadow.png"
                alt="bottom shadow"
                className="justify-center h-[1076px] w-full sm:w-full left-0 bottom-0 right-0 top-0 m-auto opacity-0.7 object-cover absolute"
                loading="lazy"
              />
              <Heading
                as="h2"
                className="sm:text-3xl top-[33%] right-0 left-0 m-auto text-center absolute font-custom"
              >
                Build with PillarX
              </Heading>
              <a href="https://twitter.com/PX_Web3" target="_blank" rel="noreferrer">
                <Img
                  src="/images/backSide.svg"
                  alt="path1009_three"
                  className="h-[27px] w-[28px] bottom-[12%] right-[5%] m-auto absolute"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
          <div className="h-[370px] w-full bottom-[19%] right-0 left-0 m-auto absolute" ref={sectionRef}>
            <Img
              src="/images/topBottomGradient.png"
              alt="bottom gradient"
              className="justify-center h-[550px] w-full left-0 bottom-0 right-0 top-0 m-auto  object-cover absolute rounded-[80px] opacity-0.6"
              loading="lazy"
            />
            <div className="flex flex-col items-center justify-start sm:mt-[-50px] sm:w-full md:w-[70%] w-[42%] sm:gap-[40px] gap-[63px] top-[10%] right-0 left-0 m-auto absolute">
              <Text as="p" className="w-[78%] !text-white-A700_99 text-center font-custom">
                This is your chance to spotlight your project, engage with 100k+ Pillar community members, and be part
                of the journey towards a more trustless future leveraging Account Abstraction.
              </Text>
              <div className="flex flex-row justify-start">
                <Text size="s" as="p" className="sm:text-lg sm:px-5 text-center font-custom">
                  Fill in the&nbsp;
                  <a
                    className="inline-block underline "
                    href="https://docs.google.com/forms/d/e/1FAIpQLSeFkdFhOh8vVy-qvS7ADyN6J050HAoJU6zLOkLFihE4QZlQvA/viewform"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <u>form</u>
                  </a>
                  &nbsp;to join our groundbreaking testing campaign.
                  &nbsp;<b>Applications will close on April 26th.</b>
                </Text>
              </div>
            </div>
          </div>
          <div className="h-[513px] sm:w-full md:w-[513px] w-[513px] top-[5%] right-0 left-0 m-auto bg-blue_gray-100_05 absolute rounded-[256px]" />
          <div className="h-[417px] sm:w-full md:w-[417px] w-[417px] top-[8%] right-0 left-0 m-auto  white_border bg-black-900 shadow-xs absolute rounded-[208px]" />
          <div className="flex flex-row justify-center w-[80%] top-[6%] right-0 left-0 p-[51px] m-auto md:p-5 border border-solid border_box bg-gray-900_33 absolute rounded-[21px]">
            <div className="flex flex-col items-center justify-start sm:w-[100%] md:w-[100%] w-[48%] mt-[3px] gap-[38px]">
              <Heading as="h3" className="sm:text-2xl text-center font-custom">
                Be One of the First to Experience PX
              </Heading>
              <Text as="p" className="sm:w-full w-[49%] text-center font-custom">
                Secure your place as a pioneer - Sign up for early access!
              </Text>
              <div className="flex flex-col items-center justify-start w-full gap-[45px] md:px-5">
                <div className="flex flex-row sm:flex-col justify-start sm:w-[300px] md:w-full gap-5 sm:gap-2">
                  <Form />
                </div>
                <Text as="p" className="!text-white-A700_90 text-center opacity-0.6 font-custom">
                  Stay tuned! We&#39;ll be unveiling more details as we approach the official launch date.
                  <a href="https://twitter.com/PX_Web3" className="inline-block" target="_blank" rel="noreferrer">
                    &nbsp;<u>Follow us on X.</u>
                  </a>
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
