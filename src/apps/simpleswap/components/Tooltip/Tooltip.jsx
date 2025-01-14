import {useState, useEffect, useMemo} from 'react';
import ReactDOM from 'react-dom';
import { createPopper } from '@popperjs/core';
import PropTypes from 'prop-types';

export const Tooltip = (props) => {
  const {
    trigger = 'hover',
    renderReference: renderReferenceProp,
    renderTooltip: renderTooltipProp,
    offsetTop = 5,
    placement = 'top',
  } = props;

  const [referenceRef, setReferenceRef] = useState(null);
  const [tooltipRef, setTooltipRef] = useState(null);

  const [tooltipIsShown, setTooltipIsShown] = useState(false);

  const { forceUpdate } = useMemo(()=>createPopper(referenceRef, tooltipRef, {
    placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, offsetTop],
        },
      },
    ],
  }),[referenceRef, tooltipRef]);

  const renderTooltip = () => {
    const getProps = () => {
      const ref = setTooltipRef;

      const hide = () => {
        setTooltipIsShown(false);
      };

      return {
        ref,
        hide,
      };
    };

    if (tooltipIsShown) {
      return ReactDOM.createPortal(renderTooltipProp(getProps()), document.body);
    }

    return null;
  };

  const renderReference = () => {
    const getProps = () => {
      if (trigger === 'click') {
        const ref = setReferenceRef;

        const onClick = (value = null) => {
          if (value !== null) {
            setTooltipIsShown(value);
          } else {
            setTooltipIsShown(!tooltipIsShown);
          }
        };

        const actionHandlers = { onClick, $tooltipIsShown: tooltipIsShown };

        return {
          ref,
          actionHandlers,
        };
      }
      if (trigger === 'all') {
        const ref = setReferenceRef;

        // const onClick = (value = null) => {
        //   if (value !== null) {
        //     setTooltipIsShown(value);
        //   } else {
        //     setTooltipIsShown(!tooltipIsShown);
        //   }
        // };

        const onMouseEnter = () => {
          const windowWidth = window.innerWidth;
          if (windowWidth >= 1280) {
            setTooltipIsShown(true);
          }
        };

        const show = () => {
          setTooltipIsShown(true);
        };

        const onMouseLeave = () => {
          const windowWidth = window.innerWidth;
          if (windowWidth < 1280) return;
          setTooltipIsShown(false);
        };

        const actionHandlers = { $tooltipIsShown: tooltipIsShown, onMouseEnter, onMouseLeave };

        return {
          ref,
          actionHandlers,
          show,
        };
      }

      if (trigger === 'memo') {
        const ref = setReferenceRef;

        const onClick = (value = null) => {
          if (value !== null) {
            setTooltipIsShown(value);
          } else {
            setTooltipIsShown(!tooltipIsShown);
          }
        };

        const onMouseEnter = () => {
          const windowWidth = window.innerWidth;
          if (windowWidth >= 1280) {
            setTooltipIsShown(true);
          }
        };

        const show = () => {
          setTooltipIsShown(true);
        };

        const onMouseLeave = () => {
          const windowWidth = window.innerWidth;
          if (windowWidth < 1280) return;
          setTooltipIsShown(false);
        };

        const actionHandlers = { $tooltipIsShown: tooltipIsShown, onMouseEnter, onMouseLeave, onClick };

        return {
          ref,
          actionHandlers,
          show,
        };
      }

      /* по-умолчанию hover */

      const ref = setReferenceRef;

      const onMouseEnter = () => {
        setTooltipIsShown(true);
      };

      const onMouseLeave = () => {
        setTooltipIsShown(false);
      };

      const actionHandlers = { onMouseEnter, onMouseLeave, $tooltipIsShown: tooltipIsShown };

      return {
        ref,
        actionHandlers,
      };
    };

    return renderReferenceProp(getProps());
  };

  useEffect(() => {
    if (forceUpdate) {
      forceUpdate();
    }
  }, [renderReferenceProp, renderTooltipProp]);

  return (
    <>
      {renderTooltip()}
      {renderReference()}
    </>
  );
};

Tooltip.propTypes = {
  trigger: PropTypes.string,
  renderReference: PropTypes.func,
  renderTooltip: PropTypes.func,
  offsetTop: PropTypes.number,
  placement: PropTypes.string
}
