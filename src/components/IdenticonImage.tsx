/* eslint-disable @typescript-eslint/no-use-before-define */
import { ethers } from 'ethers';
import Identicon from 'identicon.js';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const IdenticonImage = ({
  text,
  size = 32,
  rounded = false,
}: {
  text: string;
  size?: number;
  rounded?: boolean;
}) => {
  const [imageData, setImageData] = useState('');

  useEffect(() => {
    let hexHash = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(text));

    while (hexHash.length < 15) {
      hexHash = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(hexHash + text));
    }

    const identicon = new Identicon(hexHash, size).toString();

    setImageData(identicon.toString());
  }, [text, size]);

  return (
    <StyledImage
      src={`data:image/png;base64,${imageData}`}
      alt={text}
      $rounded={rounded}
      $size={size}
    />
  );
};

const StyledImage = styled.img<{ $size: number; $rounded: boolean }>`
  border-radius: ${({ $rounded }) => ($rounded ? '50%' : '0')};
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  user-select: none;
`;

export default IdenticonImage;
