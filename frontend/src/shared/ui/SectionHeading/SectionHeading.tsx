import type { ReactNode } from "react"; 

interface SectionHeadingProps {
    children: ReactNode;
    heading: string;
    headingLevel: '1' | '2';
}

const SectionHeading = ({ children, heading, headingLevel }: SectionHeadingProps) => {
    return (
        <>
            {headingLevel === '1' ? <h1 style={{ textAlign: 'center' }}>{heading}</h1> : <h2 style={{ textAlign: 'center' }}>{heading}</h2>}
            <p className='section-desc'>{children}</p>
        </>
    );
};

export default SectionHeading;