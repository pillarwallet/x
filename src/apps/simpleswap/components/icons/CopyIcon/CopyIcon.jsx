import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import * as Styles from './styles';
import TriangleIcon from '../TriangleIcon';
import PropTypes from 'prop-types';

const CopyIcon = (props) => {
  const { text, color, background, hoverBackground, hoverColor } = props;
  const { t } = useTranslation();
  const [activeTimer, setActiveTimer] = useState();

  const onCopy = () => {
    clearTimeout(activeTimer);
    setActiveTimer(
      setTimeout(() => {
        setActiveTimer(null);
      }, 1000),
    );
  };

  return (
    <CopyToClipboard text={text} onCopy={onCopy}>
      <Styles.Container
        $isActive={activeTimer}
        $background={background}
        $hoverBackground={hoverBackground}
        $color={color}
        $hoverColor={hoverColor}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M12.0394 10.4587V12.5997C12.0394 14.3838 11.3257 15.0975 9.54157 15.0975H7.40062C5.61648 15.0975 4.90283 14.3838 4.90283 12.5997V10.4587C4.90283 8.67459 5.61648 7.96094 7.40062 7.96094H9.54157C11.3257 7.96094 12.0394 8.67459 12.0394 10.4587Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.0997 7.4011V9.54206C15.0997 11.3262 14.386 12.0398 12.6019 12.0398H12.0411V10.4596C12.0411 8.67548 11.3275 7.96183 9.54337 7.96183H7.96313V7.4011C7.96313 5.61697 8.67679 4.90332 10.4609 4.90332H12.6019C14.386 4.90332 15.0997 5.61697 15.0997 7.4011Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Styles.Tooltip $hoverBackground={hoverBackground}>
          {t('copied')}
          <Styles.TriangleIcon>
            <TriangleIcon color={hoverBackground} />
          </Styles.TriangleIcon>
        </Styles.Tooltip>
      </Styles.Container>
    </CopyToClipboard>
  );
};

CopyIcon.propTypes = {
  text: PropTypes.string, color: PropTypes.string, background: PropTypes.string, hoverBackground: PropTypes.string, hoverColor: PropTypes.string
}

export default CopyIcon;
