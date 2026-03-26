import { faTelegram, faVk, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Logo from '@/shared/ui/Logo';

import FooterColumn from './components/FooterColumn';
import styles from './Footer.module.scss';

const Footer = () => {
    const firstLinks = ['Возможности', 'Тарифы', 'Для самозанятых'];
    const secondLinks = ['Найти мастера', 'Популярные услуги', 'Как это работает'];
    const thirdLinks = ['Центр помощи', 'Контакты', 'Блог'];

    return (
        <footer className={styles.footer}>
            <div className={styles.wrapper}>
                <div className={styles['footer-grid']}>
                    <div className={styles['footer-col']}>
                        <Logo type='secondary' />
                        <p>Платформа для специалистов и их клиентов. Бронирование, финансы, коммуникация.</p>
                        <div className={styles['social-links']}>
                            <a aria-label="Telegram">
                                <FontAwesomeIcon icon={faTelegram} size="lg" />
                            </a>
                            <a aria-label="VK">
                                <FontAwesomeIcon icon={faVk} size="lg" />
                            </a>
                            <a aria-label="YouTube">
                                <FontAwesomeIcon icon={faYoutube} size="lg" />
                            </a>
                        </div>
                    </div>
                    <FooterColumn heading='Специалистам' links={firstLinks} />
                    <FooterColumn heading='Клиентам' links={secondLinks} />
                    <FooterColumn heading='Поддержка' links={thirdLinks} />
                </div>
                <div className={styles.copyright}>
                    © 2026 ServiceFlow. Все права защищены
                </div>
            </div>
        </footer>
    );
};

export default Footer;