import type { ReactNode } from "react"; 

interface SectionHeadingProps {
    children: ReactNode;
    heading: string;
}

const SectionHeading = ({ children, heading }: SectionHeadingProps) => {
    return (
        <>
            <h2 style={{ textAlign: 'center' }}>{heading}</h2>
            <p className='section-desc'>{children}</p>
        </>
    );
};

export default SectionHeading;