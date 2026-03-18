import type { InputHTMLAttributes } from 'react';

import styles from './SearchBar.module.scss';

const SearchBar = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <input className={className || styles.input}  {...props}></input>
    );
};

export default SearchBar;