import { StyledSpinner } from './styles';
import PropTypes from 'prop-types';

const Spinner = (props) => {
  const { size, color } = props;

  return (
    <StyledSpinner $size={size} $color={color}>
      <circle
        className="path"
        cx={size / 2}
        cy={size / 2}
        r={size / 2.5}
        fill="none"
        strokeWidth="2"
      />
    </StyledSpinner>
  );
};

Spinner.propTypes = {
  size: PropTypes.number, color: PropTypes.string
}

export default Spinner;
