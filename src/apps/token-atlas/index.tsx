// styles
import styled from 'styled-components';
import './styles/tailwindTokenAtlas.css';
import HeaderSearch from './components/HeaderSearch/HeaderSeach';
import SearchTokenModal from './components/SearchTokenModal/SearchTokenModal';
import TokenGraphColumn from './components/TokenGraphColumn/TokenGraphColumn';
import TokenInfoColumn from './components/TokenInfoColumn/TokenInfoColumn';

export const App = () => {
  return (
    <Wrapper>
      <SearchTokenModal />
      <HeaderSearch />
      <div className="flex w-full gap-8 mobile:flex-col">
        <TokenGraphColumn className='basis-3/5'/>
        <TokenInfoColumn className='basis-2/5' />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  flex-direction: column;
  background-color: #222222;

  @media (min-width: 768px) {
    padding: 52px 60px;
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

export default App;
