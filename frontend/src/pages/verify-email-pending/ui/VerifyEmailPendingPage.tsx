import { useLocation, Link } from 'react-router-dom';

import styles from './VerifyEmailPendingPage.module.scss';

const VerifyEmailPendingPage = () => {
    const location = useLocation();
    const email = location.state?.email || 'ваш email';

    return (
        <div className={styles.container}>
            <h1>Подтвердите email</h1>
            <p>Мы отправили письмо на <strong>{email}</strong></p>
            <p>Перейдите по ссылке в письме, чтобы активировать аккаунт</p>
            <Link to="/login">Вернуться ко входу</Link>
        </div>
    );
};

export default VerifyEmailPendingPage;