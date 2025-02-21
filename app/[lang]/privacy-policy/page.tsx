"use client";

import Link from "next/link";
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import { useState } from 'react';

export default function PrivacyPolicyPage() {
    const [lang, setLang] = useState<'en' | 'ru'>('en');
    const breadcrumbs: Breadcrumb[] = [
        { title: 'main', link: '/' },
        { title: 'privacy policy', link: '/privacy-policy' },
    ];

    const ruPolicy = (
        <>
            <h2 className="text-3xl font-bold text-center">Политика конфиденциальности</h2>

            <div className="max-w-3xl mx-auto space-y-6 text-foreground">
                <section>
                    <h2 className="text-xl font-semibold">1. Введение</h2>
                    <p>Добро пожаловать на <strong>Natalia&#39;s Next blog</strong>. Мы уважаем вашу конфиденциальность
                        и стремимся защищать ваши персональные данные. Этот документ объясняет, какие данные мы
                        собираем, как их используем и какие у вас есть права.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">2. Какие данные мы собираем</h2>
                    <p>Мы используем Next.js и NextAuth.js. Мы не собираем и не устанавливаем файлы cookie
                        самостоятельно. Однако Next.js и NextAuth могут использовать файлы cookie по умолчанию для
                        аутентификации.</p>
                    <ul className="list-disc list-inside">
                        <li><strong>Технические данные:</strong> IP-адрес, тип браузера, язык, устройство.</li>
                        <li><strong>Файлы cookie:</strong> используются только для аутентификации через NextAuth (JWT).
                        </li>
                        <li><strong>Данные аккаунта:</strong> email (если пользователь зарегистрирован через
                            NextAuth).
                        </li>
                        <li><strong>Данные активности:</strong> посещенные страницы, действия на сайте (без привязки к
                            личности).
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">3. Как мы используем ваши данные</h2>
                    <ul className="list-disc list-inside">
                        <li>Обеспечение работы системы аутентификации (NextAuth).</li>
                        <li>Защита от несанкционированного доступа.</li>
                        <li>Обеспечение работы сайта (файлы cookie Next.js).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">4. Файлы cookie</h2>
                    <p>Наш сайт использует файлы cookie только в рамках стандартной работы Next.js и NextAuth:</p>
                    <ul className="list-disc list-inside">
                        <li><strong>Файлы сессии:</strong> NextAuth устанавливает файлы cookie для управления
                            авторизацией.
                        </li>
                        <li><strong>Без рекламных и аналитических cookie:</strong> мы не используем файлы cookie для
                            отслеживания пользователей или рекламы.
                        </li>
                    </ul>
                    <p>Вы можете управлять cookie через настройки вашего браузера.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">5. С кем мы делимся данными</h2>
                    <p>Мы не передаем персональные данные пользователей третьим лицам, за исключением случаев,
                        предусмотренных законодательством. Обработка и хранение персональных данных осуществляется
                        исключительно на наших серверах и в защищенной базе данных MongoDB, где сохраняются адреса
                        электронной почты и пароли пользователей в зашифрованном виде (используя современный алгоритм
                        хеширования - bcrypt), обеспечивая их конфиденциальность и защиту от
                        несанкционированного доступа.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">6. Как долго хранятся данные</h2>
                    <p>Мы храним ваши данные только в рамках работы NextAuth:</p>
                    <ul className="list-disc list-inside">
                        <li>Файлы сессии (NextAuth) хранятся в течение срока их действия или до выхода из аккаунта.</li>
                        <li>Данные аккаунта (email и защищенный пароль) хранятся в базе данных MongoDB, пока аккаунт
                            активен или пока пользователь не запросит удаление данных.
                        </li>
                    </ul>
                    <p>Вы можете удалить свой аккаунт и данные через настройки профиля.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">7. Ваши права</h2>
                    <p>Вы имеете право:</p>
                    <ul className="list-disc list-inside">
                        <li>Запросить информацию о ваших данных.</li>
                        <li>Удалить или изменить свои данные.</li>
                        <li>Отключить файлы cookie в настройках браузера.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">8. Обратная связь и обработка данных незарегистрированных
                        пользователей</h2>
                    <p>Если вы отправляете сообщение через форму обратной связи, вы предоставляете нам следующие
                        данные:</p>
                    <ul className="list-disc list-inside">
                        <li><strong>Имя и email</strong> (если вы указываете их в форме).</li>
                        <li><strong>Сообщение</strong>, которое вы оставляете в форме.</li>
                        <li><strong>Технические данные</strong> (например, IP-адрес и информация о браузере, если это
                            необходимо для защиты от спама).
                        </li>
                    </ul>
                    <p>Отправляя сообщение, вы соглашаетесь с нашей Политикой конфиденциальности и даете согласие на
                        обработку ваших персональных данных.</p>
                    <p>Мы используем эти данные исключительно для ответа на ваш запрос и не передаем их третьим
                        лицам.</p>
                </section>


                <section>
                    <h2 className="text-xl font-semibold">9. Изменения в политике</h2>
                    <p>Мы можем обновлять эту политику, например, если изменятся законы. Дата последнего
                        обновления: <strong>14.02.2025</strong>.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">10. Контакты</h2>
                    <p>Если у вас есть вопросы, напишите нам через&nbsp;
                        <Link href="/contact" className="text-blue-500 underline">форму обратной связи</Link>
                    </p>
                </section>
            </div>
        </>
    );

    const enPolicy = (
        <>
            <h2 className="text-3xl font-bold text-center">Privacy Policy</h2>

            <div className="max-w-3xl mx-auto space-y-6 text-foreground">
                <section>
                    <h2 className="text-xl font-semibold">1. Introduction</h2>
                    <p>Welcome to <strong>Natalia&#39;s Next blog</strong>. We respect your privacy and are committed to
                        protecting your personal data. This document explains what data we collect, how we use it, and
                        what rights you have.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">2. What Data We Collect</h2>
                    <p>We use Next.js and NextAuth.js. We do not collect or set cookies manually. However, Next.js and
                        NextAuth may use default cookies for authentication.</p>
                    <ul className="list-disc list-inside">
                        <li><strong>Technical data:</strong> IP address, browser type, language, device.</li>
                        <li><strong>Cookies:</strong> Used only for authentication via NextAuth.</li>
                        <li><strong>Account data:</strong> Email (if the user is registered via NextAuth).</li>
                        <li><strong>Activity data:</strong> Visited pages, site interactions (without personal
                            identification).
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">3. How We Use Your Data</h2>
                    <ul className="list-disc list-inside">
                        <li>Ensuring the functionality of the authentication system (NextAuth).</li>
                        <li>Protecting against unauthorized access.</li>
                        <li>Ensuring site operation (Next.js cookies).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">4. Cookies</h2>
                    <p>Our site uses cookies only as part of the standard operation of Next.js and NextAuth:</p>
                    <ul className="list-disc list-inside">
                        <li><strong>Session cookies:</strong> NextAuth sets cookies to manage authentication.</li>
                        <li><strong>No advertising or analytics cookies:</strong> We do not use cookies for user
                            tracking or advertising.
                        </li>
                    </ul>
                    <p>You can manage cookies through your browser settings.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">5. Who We Share Your Data With</h2>
                    <p>We do not share users&#39; personal data with third parties, except as required by law. Data
                        processing and storage are carried out exclusively on our servers and in a secure MongoDB
                        database, where email addresses and user passwords are stored in encrypted form (using modern
                        hashing algorithms such as bcrypt), ensuring their confidentiality and protection against
                        unauthorized access.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">6. Data Retention</h2>
                    <p>We retain your data only as part of NextAuth operations:</p>
                    <ul className="list-disc list-inside">
                        <li>Session cookies (NextAuth) are stored for their duration or until the user logs out.</li>
                        <li>Account data (email and encrypted password) is stored in our MongoDB database while the
                            account is active or until the user requests data deletion.
                        </li>
                    </ul>
                    <p>You can delete your account and data through your profile settings.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">7. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul className="list-disc list-inside">
                        <li>Request information about your data.</li>
                        <li>Delete or modify your data.</li>
                        <li>Disable cookies in your browser settings.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">8. Contact Form and Data Processing for Unregistered
                        Users</h2>
                    <p>If you send a message through the contact form, you provide us with the following data:</p>
                    <ul className="list-disc list-inside">
                        <li><strong>Name and email</strong> (if provided in the form).</li>
                        <li><strong>Message</strong> content that you submit.</li>
                        <li><strong>Technical data</strong> (such as IP address and browser information, if necessary
                            for spam protection).
                        </li>
                    </ul>
                    <p>By submitting a message, you agree to our Privacy Policy and consent to the processing of your
                        personal data.</p>
                    <p>We use this data exclusively to respond to your inquiry and do not share it with third
                        parties.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">9. Changes to This Policy</h2>
                    <p>We may update this policy if laws change. Last updated: <strong>February 14, 2025</strong>.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">10. Contact</h2>
                    <p>If you have any questions, please contact us through&nbsp;
                        <Link href="/contact" className="text-blue-500 underline">the contact form</Link>
                    </p>
                </section>
            </div>
        </>
    )

    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className='flex gap-1 p-2 rounded-xl bg-primary-contrast/60 dark:bg-dark-soft'>
                <button className={`button button-sm ${lang === 'en' ? 'text-accent' : 'text-foreground'}`}
                        onClick={() => setLang('en')}>EN
                </button>
                <button className={`button button-sm ${lang === 'ru' ? 'text-accent' : 'text-foreground'}`}
                        onClick={() => setLang('ru')}>RU
                </button>
            </div>
            {lang === 'ru' && ruPolicy}
            {lang === 'en' && enPolicy}
        </main>
    );
}