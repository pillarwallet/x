import { Container, TooltipIconContainer, CloseIconContainer } from './styles';
import CloseIcon from '../icons/CloseIcon';
import PropTypes from 'prop-types';

const InformationDialog = (props) => {
  const { message, color, icon, close } = props;

  return (
    <Container $background={color.background} $color={color.circle.active}>
      {message}
      <TooltipIconContainer>{icon}</TooltipIconContainer>
      <CloseIconContainer onClick={close}>
        <CloseIcon color={color.circle.active} />
      </CloseIconContainer>
    </Container>
  );
};

InformationDialog.propTypes = {
  step: PropTypes.number,
  message: PropTypes.string, color: PropTypes.object, icon:PropTypes.node, close: PropTypes.func
}

export default InformationDialog;
