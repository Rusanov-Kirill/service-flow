import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';

interface WidgetHeadingProps {
    children: ReactNode;
    className?: string;
    icon: IconDefinition;
    heading: string;
}

const WidgetHeading = ({ children, className, icon, heading }: WidgetHeadingProps) => {
    return (
        <>
            <div className={className}>
                <FontAwesomeIcon icon={icon} />
            </div>
            <h3>{heading}</h3>
            <p>{children}</p>
        </>
    );
};

export default WidgetHeading;