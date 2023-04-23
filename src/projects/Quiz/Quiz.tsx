import React, { useEffect, useState, useMemo, useRef } from 'react'
import quizStyle from './quiz.module.css'
import getRequest, { QuizResponse } from '../../utils/getRequest'
import shuffleArray from '../../utils/shuffleArray'
import { contructQuizUrl } from '../../urls/url'



export default function Quiz(): JSX.Element {
    const [value, setValue] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [quizNum, setQuizNum] = useState(0)
    const [hasSelected, setHasSelected] = useState(false)
    const [quizData, setQuizData] = useState<QuizResponse['results']>([]);
    const optionsRef = useRef<HTMLDivElement>(null)
    const [formData, setFormData] = useState({ questionQty: 10, difficulty: 'any' })


    function nextQuestion() {
        setHasSelected(false)
        resetOptions()
        if (quizNum <= quizData.length - 2) {
            setQuizNum(prevNum => prevNum + 1)
            return
        }
        setValue(0)
        setQuizNum(0)
        return
    }

    // reset the success and error class on optionsContainer childrens
    function resetOptions() {
        if (optionsRef.current) {
            const childs = (optionsRef.current as HTMLDivElement).children
            Array.from(childs).forEach(element => {
                element.classList.remove('success', 'error')
            });
        }
    }



    function selectAnswer(e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
        if (hasSelected) {
            return
        }
        // making it true here so it skips the check first time selectAnswer is called
        setHasSelected(true)
        const element = e.target as HTMLDivElement
        if (element.textContent === quizData[quizNum].correct_answer) {
            element.classList.add('success')
            return
        }
        element.classList.add('error')

        // if wrong answer then add success class to the right answer
        if (optionsRef.current) {
            const childs = (optionsRef.current as HTMLDivElement).children
            Array.from(childs).forEach(element => {
                if ((element as HTMLDivElement).textContent === quizData[quizNum].correct_answer) {
                    setTimeout(() => {
                        element.classList.add('success')
                    }, 100)
                }
            });
        }
        return
    }

    function startQuiz() {
        const url = contructQuizUrl(formData.questionQty, formData.difficulty)
        setLoading(true)
        getRequest(url).then((data) => {
            if (data.response_code === 0) {
                setQuizData(data.results.map(obj => {
                    return {
                        ...obj,
                        options: shuffleArray([obj.correct_answer, obj.incorrect_answers].flat())
                    }
                }));
            } else {
                setError(true)
            }
            setLoading(false);
        });
        setValue(1)
    }

    function StartQuiz(): JSX.Element {
        return (
            <div className={quizStyle.quiz_start_container}>
                <form className={quizStyle.quiz_form}>
                    <div>
                        <label>
                            Number of Questions:
                        </label>
                        <input type='number' max={50} min={1}
                            onChange={(e) => setFormData({ ...formData, questionQty: parseInt(e.target.value) })}
                            value={formData.questionQty} />
                    </div>
                    <div>
                        <label>
                            Difficulty
                        </label>
                        <select onBlur={(e) => setFormData({ ...formData, difficulty: e.target.value })}>
                            <option> Any </option>
                            <option> Easy </option>
                            <option> Medium </option>
                            <option> Hard </option>
                        </select>
                    </div>
                </form>
                <div className='btn-container'>
                    <button className='btn' onClick={startQuiz}> Start Quiz </button>
                </div>
            </div>
        )
    }



    // Note: !! makes number to boolean 0 === false and other === true

    return (
        <section className='container'>
            <h1 className={quizStyle.heading}> Anime/Manga Quiz App </h1>
            {!!value && loading && <div className='loading'> Loading... </div>}

            {!!value && error && <div> Failed to fetch data! </div>}

            {!value &&
                <StartQuiz />
            }

            {value === 1 && !loading && !error &&
                <div className={quizStyle.card_container}>
                    <div className={quizStyle.card_header}>
                        <span>{quizNum + 1}</span>
                        <h3 className={quizStyle.title} dangerouslySetInnerHTML={{ __html: quizData[quizNum].question }}></h3>
                    </div>
                    <div className={quizStyle.options_container} ref={optionsRef}>
                        {quizData[quizNum].options.map((opt, index) => (
                            <div key={index} data-index={index} className={quizStyle.option} dangerouslySetInnerHTML={{ __html: opt }} onClick={selectAnswer}></div>
                        ))}
                    </div>
                    <div className='btn-container'>
                        <button className='btn' style={{ width: '100%' }} disabled={!hasSelected} onClick={nextQuestion}> {quizNum === quizData.length - 1 ? 'Finish' : 'Next Question'} </button>
                    </div>
                </div>
            }
        </section>
    )
}
