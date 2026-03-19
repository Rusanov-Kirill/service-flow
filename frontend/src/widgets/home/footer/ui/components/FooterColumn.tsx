import styles from './FooterColumn.module.scss';

interface FooterColumnProps {
    heading: string;
    links: string[];
}

const FooterColumn = ({ heading, links }: FooterColumnProps) => {
    return (
        <div className={styles['footer-col']}>
            <h4>{heading}</h4>
            {
                links.map((link, index) => (
                    <a key={index}>{link}</a>
                ))
            }
        </div>
    );
};

export default FooterColumn;