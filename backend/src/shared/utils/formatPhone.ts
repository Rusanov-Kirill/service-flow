export const formatPhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');

    if (!digits) {
        return phone;
    }

    if (!digits.startsWith('7') && !digits.startsWith('8')) {
        return phone;
    }

    let normalized = digits;
    if (normalized.startsWith('8')) {
        normalized = '7' + normalized.slice(1);
    }

    if (normalized.length === 11) {
        return `+7 (${normalized.slice(1, 4)}) ${normalized.slice(4, 7)}-${normalized.slice(7, 9)}-${normalized.slice(9, 11)}`;
    }

    return phone;
};