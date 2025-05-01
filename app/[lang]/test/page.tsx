'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const questions = [
    {
        name: 'q1',
        question: 'Прозвище Дракса из «Стражей Галактики»?',
        options: [
            { label: 'Уничтожитель', value: 'Exterminator' },
            { label: 'Разрушитель', value: 'Destroyer' },
            { label: 'Обвинитель', value: 'Accuser' },
            { label: 'Сладкоежка', value: 'Sweet-tooth' },
        ],
        correctAnswer: 'Destroyer',
    },
    {
        name: 'q2',
        question: 'Кто носит броню из вибраниума?',
        options: [
            { label: 'Человек-паук', value: 'Spider-Man' },
            { label: 'Чёрная Пантера', value: 'Black Panther' },
            { label: 'Халк', value: 'Hulk' },
            { label: 'Железный человек', value: 'Iron Man' },
        ],
        correctAnswer: 'Black Panther',
    },
    {
        name: 'q3',
        question: 'Кто является богом обмана в Marvel?',
        options: [
            { label: 'Тор', value: 'Thor' },
            { label: 'Локи', value: 'Loki' },
            { label: 'Один', value: 'Odin' },
            { label: 'Хеймдалль', value: 'Heimdall' },
        ],
        correctAnswer: 'Loki',
    },
    {
        name: 'q4',
        question: 'Как зовут енота в «Стражах Галактики»?',
        options: [
            { label: 'Бандит', value: 'Bandit' },
            { label: 'Ракета', value: 'Rocket' },
            { label: 'Сплит', value: 'Split' },
            { label: 'Пуля', value: 'Bullet' },
        ],
        correctAnswer: 'Rocket',
    },
    {
        name: 'q5',
        question: 'Что Танос собирал во Вселенной Marvel?',
        options: [
            { label: 'Артефакты Асгарда', value: 'Asgard Artifacts' },
            { label: 'Инфинити Камни', value: 'Infinity Stones' },
            { label: 'Технологии Старка', value: 'Stark Tech' },
            { label: 'Щиты Щ.И.Т.', value: 'SHIELD Shields' },
        ],
        correctAnswer: 'Infinity Stones',
    },
];

const validationSchema = Yup.object(
    Object.fromEntries(
        questions.map((q) => [
            q.name,
            Yup.string()
                .required('Выберите один из вариантов')
                .test(
                    'correct-answer',
                    'Неверный ответ',
                    (value) => value === q.correctAnswer,
                ),
        ]),
    ),
);

export default function QuizForm() {
    const initialValues = Object.fromEntries(
        questions.map((q) => [q.name, '']),
    );

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                alert('Поздравляем! Все ответы верны.');
                setSubmitting(false);
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    {questions.map(({ name, question, options }) => (
                        <fieldset key={name} style={{ marginBottom: '1.5rem' }}>
                            <legend>{question}</legend>
                            {options.map(({ label, value }) => (
                                <label key={value} style={{ display: 'block' }}>
                                    <Field
                                        type="radio"
                                        name={name}
                                        value={value}
                                    />{' '}
                                    {label}
                                </label>
                            ))}
                            <ErrorMessage
                                name={name}
                                component="div"
                                style={{ color: 'red' }}
                            />
                        </fieldset>
                    ))}
                    <button type="submit" disabled={isSubmitting}>
                        Проверить ответы
                    </button>
                </Form>
            )}
        </Formik>
    );
}
