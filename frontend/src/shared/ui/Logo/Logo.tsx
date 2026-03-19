import styles from './Logo.module.scss';
import type { LogoProps } from './Logo.types.ts';

const Logo = ({ type }: LogoProps) => {
    const logoClass = [
        styles.logo,
        styles[`logo-${type}`]
    ].filter(Boolean).join(' ');

    const handlePageUp = () => window.scrollTo(0, 0);

    return (
        <div
            className={logoClass}
            onClick={handlePageUp}
            aria-label="Логотип ServiceFlow"
        >
            Service<span>Flow</span>
        </div>
    );
};

export default Logo;