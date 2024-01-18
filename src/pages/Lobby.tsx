import styled from 'styled-components';

const dummyBoxes = [
  { title: 'Analytics', background: 'rgba(73,59,250,0.68)' },
  { title: 'Blog', background: 'rgba(200,23,255,0.87)' },
  { title: 'Help', background: 'rgba(3,228,255,0.68)' },
  { title: 'Notifications', background: 'rgba(147,255,37,0.87)' },
  { title: 'Apps', background: 'rgba(250,59,183,0.68)' },
  { title: 'Support', background: 'rgba(255,42,23,0.87)' },
  { title: 'Docs', background: 'rgba(252,255,0,0.68)' },
  { title: 'Whitepaper', background: 'rgba(42,15,15,0.87)' },
  { title: 'Account', background: 'rgba(147,146,164,0.68)' },
  { title: 'Dashboard', background: 'rgba(255,139,23,0.87)' },
  { title: 'Swaps', background: 'rgba(0,0,0,0.68)' },
  { title: 'Bridge', background: 'rgba(38,136,72,0.87)' },
];

const Lobby = () => {
  return (
    <Wrapper>
      {dummyBoxes.map((box) => (
        <DummyBox
          key={box.title}
          $background={box.background}
          $title={box.title}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
`;

const DummyBox = styled.div<{ $background: string; $title: string; }>`
  width: 220px;
  height: 220px;
  position: relative;
  display: flex;
  background: ${({ $background }) => $background};
  
  &:before {
    content: '${({ $title }) => $title}';
    position: absolute;
    bottom: 20px;
    left: 20px;
    font-size: 20px;
  }
`;

export default Lobby;
