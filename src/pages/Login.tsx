import { usePrivy } from '@privy-io/react-auth';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// components
import AnimatedShape from '../components/AnimatedShape';
import Button from '../components/Button';
import { PrimaryTitle } from '../components/Text/Title';
import { createPasskey, getPasskeyData } from '../utils/passkey';

const Login = () => {
  const { login } = usePrivy();
  const [t] = useTranslation();

  /**
   * This is temporary! As part of a technical experiment,
   * we're testing out a passkey-first login method. We will
   * remove this in future and may be replaced with a more
   * permanent passkey solution.
   */
  const showPasskeyLoginWarning = async () => {
    if(confirm('Please read carefully before you continue!\n\n- This passkey is temporary and is stored locally in your browser\n\n- Your passkey directly translates to your wallet within the browser using one-way encryption\n\n- If you remove any website data from your browser, you will also lose your passkey and therefore your wallet\n\n- We cannot see or recover a passkey wallet\n\nProceed with caution - we\'re not responsible for lost funds!')) {
      
      try {
        if (localStorage.getItem('uid')) {
          await getPasskeyData();
        } else {
          await createPasskey();
        }
      } catch (e) {
        alert('Sorry, there was a problem reading or creating your passkey. Please try again.');
      }
    }
  }

  return (
    <Wrapper>
      <HeroTitle>{t`content.welcomeToPillarX`}</HeroTitle>
      <AnimatedShape />
      <Button onClick={login} $fullWidth>{t`action.getStarted`}</Button>
      <p onClick={showPasskeyLoginWarning} className='text-slate-400 font-sans antialiased hover:cursor-pointer hover:text-slate-100'>Or, try our Passkey-first Login</p>
    </Wrapper>
  )
}

const HeroTitle = styled(PrimaryTitle)`
  font-size: 45px;
  line-height: 45px;
  width: 210px;
  text-align: center;
  margin-top: 16vh;
`;

const Wrapper = styled.div`
  height: 100vh;
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
`;

export default Login;
