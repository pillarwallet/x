import React from 'react';

import type ViewProps from './views/view-props';
import NormalView from './views/normal';
import WidgetView from './views/widget';

const Exchange: React.FC<ViewProps & { widget?: boolean }> = ({
    widget,
    ...props
}) => {
    return widget ? <WidgetView {...props} /> : <NormalView {...props} />;
};

export default Exchange;