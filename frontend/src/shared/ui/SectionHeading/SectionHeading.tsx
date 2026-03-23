import type { ReactNode } from "react"; 

import styles from './SectionHeading.module.scss';

interface SectionHeadingProps {
    children: ReactNode;
    heading: string;
    headingLevel: '1' | '2';
}

const SectionHeading = ({ children, heading, headingLevel }: SectionHeadingProps) => {
    return (
        <div className={styles.container}>
            {headingLevel === '1' ? <h1>{heading}</h1> : <h2>{heading}</h2>}
            <p className='section-desc'>{children}</p>
        </div>
    );
};

export default SectionHeading;