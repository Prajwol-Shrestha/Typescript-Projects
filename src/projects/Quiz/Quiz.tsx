import React, { useEffect, useState, useMemo, useRef } from 'react'
import quizStyle from './quiz.module.css'
import getRequest, { QuizResponse } from '../../utils/getRequest'
import shuffleArray from '../../utils/shuffleArray'


let url = 'https://opentdb.com/api.php?amount=20&category=31&type=multiple'

export default function Quiz() {
    const [quizData, setQuizData] = useState<QuizResponse['results']>([]);
    const [loading, setLoading] = useState<Boolean>(true)
    const [error, setError] = useState<Boolean>(false)
    const [quizNum, setQuizNum] = useState(0)
    const [hasSelected, setHasSelected] = useState<Boolean>(false)
    const optionsRef = useRef<HTMLDivElement>(null)

    // memorizing the function so it doesn't fetch data twice
    const fetchQuizData = useMemo(() => getRequest(url), []);

    useEffect(() => {
        fetchQuizData.then((data) => {
            if(data.response_code === 0){
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
    }, [fetchQuizData]);


    function nextQuestion() {
        setHasSelected(false)
        resetOptions()
        if (quizNum <= quizData.length - 2) {
            setQuizNum(prevNum => prevNum + 1)
            return
        }
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
        if(hasSelected){
            return
        }
        // making it true here so it skips the check first time selectAnswer is called
        setHasSelected(true)
        const element = e.target as HTMLDivElement
        if (element.innerText === quizData[quizNum].correct_answer) {
            element.classList.add('success')
            return
        }
        element.classList.add('error')

        // if wrong answer then add success class to the right answer
        if (optionsRef.current) {
            const childs = (optionsRef.current as HTMLDivElement).children
            Array.from(childs).forEach(element => {
                if((element as HTMLDivElement).innerText === quizData[quizNum].correct_answer){
                    setTimeout(() => {
                        element.classList.add('success')
                    }, 100)
                }
            });
        }
        return
    }



    return (
        <section className='container'>
            <h1 className={quizStyle.heading}> Quiz App </h1>
            {loading && <div className='loading'> Loading... </div>}

            { error && <div> Failed to fetch data! </div> }

            {!loading && !error &&
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
                        <button className='btn' style={{ width: '100%' }} onClick={nextQuestion}> {quizNum === quizData.length - 1 ? 'Finish' : 'Next Question'} </button>
                    </div>
                </div>
            }
        </section>
    )
}
