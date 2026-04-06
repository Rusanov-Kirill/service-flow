import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useRef } from 'react';

import { useCompanyStore } from '@/app/store/useCompanyStore';
import Button from '@/shared/ui/Button';
import InputField from '@/shared/ui/InputField';
import { useClickOutside } from '@/shared/utils/useClickOutside';
import { useDebounce } from '@/shared/utils/useDebounce';

import styles from './CompanySearch.module.scss';

const mockCompanies = [
    {
        "id": "cm0a1b2c3-d4e5-6789-f0g1-h2i3j4k5l6m7",
        "name": "РемонтПро",
        "slug": "remontpro",
        "description": "РемонтПро — это команда профессиональных строителей и дизайнеров с 10-летним опытом работы на рынке ремонтных услуг Москвы и Московской области. Мы специализируемся на комплексном ремонте квартир, домов, офисов и коммерческих помещений под ключ. Наша команда состоит из 25 высококвалифицированных специалистов: прорабы, дизайнеры, электрики, сантехники, штукатуры-маляры, плиточники и отделочники. Мы предлагаем полный спектр услуг: от разработки дизайн-проекта и согласования перепланировки до чистовой отделки и установки мебели. Гарантия на все виды работ составляет 3 года, на используемые материалы — до 5 лет (в зависимости от производителя). Работаем с физическими и юридическими лицами, предоставляем все необходимые документы для налоговой и бухгалтерии. Наши цены фиксируются в договоре и не меняются в процессе ремонта. Ежемесячно мы сдаём более 10 объектов, среди которых как малогабаритные квартиры-студии (от 25 кв.м), так и пентхаусы с авторским дизайном (до 200 кв.м). Используем только сертифицированные материалы от проверенных поставщиков: Knauf, Ceresit, Tikkurila, Roca, Laufen, Egger, Kronospan. В работу берём ограниченное количество объектов, чтобы сохранять высокое качество и соблюдать сроки. Средний срок ремонта однокомнатной квартиры — 45 дней, двухкомнатной — 60 дней, трёхкомнатной — 75 дней. Предоставляем бесплатный выезд замерщика и составление сметы в день обращения. Также у нас есть собственное производство корпусной мебели, что позволяет сэкономить до 30% бюджета на обустройстве кухни и шкафов-купе. Отзывы о нашей работе можно найти на профильных площадках: Яндекс.Услуги, Profi.ru, Houzz, а также в нашем Instagram-аккаунте с более чем 5000 подписчиков, где мы регулярно публикуем фото и видео с объектов до, в процессе и после ремонта. Мы не просто делаем ремонт — мы создаём пространство, в котором комфортно жить и работать. Доверьте свой дом профессионалам — выберите РемонтПро!",
        "tags": ["ремонт", "отделка", "строительство", "дизайн", "под ключ", "электрика", "сантехника", "плитка", "перепланировка", "мебель"],
        "timezone": "Europe/Moscow",
        "currency": "RUB",
        "address": "г. Москва, ул. Тверская, д. 15, офис 304",
        "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKEwl44koeD6dW6_v_RHVLaVcCXN0idRjMvA&s",
        "phone": "+7 (495) 123-45-67"
    },
    {
        id: "22222222-2222-2222-2222-222222222222",
        name: "ДизайнСтудия",
        slug: "designstudio",
        description: "Дизайн интерьеров под ключ",
        tags: ["дизайн", "интерьер"],
        timezone: "Europe/Moscow",
        currency: "RUB",
        address: "г. Москва, ул. Арбат, д. 10",
        logo: "https://www.prorabneva.ru/storage/post_content/April2020/QZ8KZyPITQBHFXaWSjcz.jpg",
        phone: "+7 (495) 987-65-43"
    },
];

type SearchMode = 'name' | 'tags';

const CompanySearch = () => {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<SearchMode>('name');
    const [isOpen, setIsOpen] = useState(false);

    const debouncedQuery = useDebounce(query, 500);

    const { setSelectedCompany } = useCompanyStore();

    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, () => setIsOpen(false));

    const filtered = mockCompanies.filter((c) => {
        if (!debouncedQuery) return false;

        if (mode === 'name') {
            return c.name.toLowerCase().includes(debouncedQuery.toLowerCase());
        }

        return c.tags.some((tag) =>
            tag.toLowerCase().startsWith(debouncedQuery.toLowerCase())
        );
    });

    return (
        <div ref={ref} className={styles.search}>
            <div className={styles.inputWrapper}>
                <InputField
                    className={styles['company-input']}
                    placeholder={
                        mode === 'name'
                            ? 'Введите название компании...'
                            : 'Введите тег (спорт, музыка...)'
                    }
                    value={query}
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                />

                <Button
                    className={styles.modeToggle}
                    onClick={() =>
                        setMode((prev) => (prev === 'name' ? 'tags' : 'name'))
                    }
                >
                    {mode === 'name' ? 'Название' : 'Теги'}
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} className={`${styles.icon} ${mode === 'tags' ? styles.rotated : ''}`} />
                </Button>
            </div>

            {isOpen && query && (
                <div className={styles.results}>
                    {filtered.length > 0 ? (
                        filtered.map((c) => (
                            <div
                                key={c.id}
                                onClick={() => {
                                    setSelectedCompany(c)
                                    setQuery(c.name)
                                    setIsOpen(false)
                                }}
                                className={styles.item}
                            >
                                {c.name}
                            </div>
                        ))
                    ) : (
                        <div className={styles.empty}>
                            По запросу "<span>{query}</span>" ничего не найдено
                        </div>
                    )}
                </div>
            )}
        </div>
    )
};

export default CompanySearch;