import React from 'react';

import type ViewProps from './views/view-props';
import WidgetView from './views/widget';

const Exchange: React.FC<ViewProps & { widget?: boolean }> = ({
    widget,
    ...props
}) => {
    return widget ? <WidgetView {...props} /> : null;
};

export default Exchange;