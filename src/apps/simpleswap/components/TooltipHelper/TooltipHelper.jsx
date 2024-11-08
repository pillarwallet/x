import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import * as Styles from './styles';
import TooltipIcon from '../icons/TooltipIcon';
import TriangleIcon from '../icons/TriangleIcon';

const TooltipHelper = (props) => {
  // eslint-disable-next-line react/prop-types
  const { tooltipText, direction, color, textColor, Icon, size } = props;
  const theme = useContext(ThemeContext);
  const currentColor = color || theme.text1;
  const currentTextColor = textColor || '#ffffff';
  return (
    <Styles.Container $size={size}>
      {Icon ? <Icon /> : <TooltipIcon color={currentColor} />}
      <Styles.Tooltip $direction={direction} $color={currentColor} $textColor={currentTextColor}>
        {tooltipText}
        <Styles.TriangleIcon $direction={direction}>
          <TriangleIcon color={currentColor} />
        </Styles.TriangleIcon>
      </Styles.Tooltip>
    </Styles.Container>
  );
};

export default TooltipHelper;
