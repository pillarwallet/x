
import React from 'react';

import { Link, LinkProps } from 'react-router-dom';

const LinkText: React.FC<React.PropsWithChildren<LinkProps>> = ({
    children,
    ...props
}) => {
    return (
        <Link {...props}>
            <a>{children}</a>
        </Link>
    );
};

export default LinkText;