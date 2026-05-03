import companyLogo from "@/shared/assets/images/company-image-placeholder.svg";
import profileLogo from "@/shared/assets/images/user-placholder.jpg";

interface PlaceholderLogoProps {
    src: string | null | undefined
    alt?: string
    className?: string
    variant: 'company' | 'profile'
}

const PlaceholderLogo = ({ src, alt, className, variant = 'company' }: PlaceholderLogoProps) => {
    const placeholder = variant === 'company' ? companyLogo : profileLogo;
    return (
        <img
            src={src || placeholder}
            alt={alt ? `Логотип ${alt}` : 'Логотип'}
            className={className}
            loading="lazy"
            onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = placeholder;
            }}
        />
    );
};

export default PlaceholderLogo;