import defaultLogo from "@shared/assets/images/company-image-placeholder.svg";

interface CompanyLogoProps {
    src?: string
    alt?: string
    className?: string
}

const CompanyLogo = ({ src, alt, className }: CompanyLogoProps) => {
    return (
        <img
            src={src || defaultLogo}
            alt={alt ? `Логотип ${alt}` : 'Логотип компании'}
            className={className}
            loading="lazy"
            onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = defaultLogo;
            }}
        />
    )
}

export default CompanyLogo;