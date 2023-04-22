import React, { useEffect, useState, useMemo, useRef } from 'react'
import quizStyle from './quiz.module.css'
import getRequest, { QuizResponse } from '../../utils/getRequest'
import shuffleArray from '../../utils/shuffleArray'
import { quizUrl } from '../../urls/url'



export default function Quiz() {
    const [value, setValue] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [retakeQuiz, setRetakeQuiz] = useState(false)
    const [quizNum, setQuizNum] = useState(0)
    const [hasSelected, setHasSelected] = useState(false)
    const [quizData, setQuizData] = useState<QuizResponse['results']>([]);
    const optionsRef = useRef<HTMLDivElement>(null)
    
    // memorizing the function so it doesn't fetch data twice
    const fetchQuizData = useMemo(() => getRequest(quizUrl), [retakeQuiz]);
    
    
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
    }, [retakeQuiz]);


    function nextQuestion() {
        setHasSelected(false)
        resetOptions()
        if (quizNum <= quizData.length - 2) {
            setQuizNum(prevNum => prevNum + 1)
            return
        }
        setValue(2)
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

    function retake(){
        setValue(1)
        setRetakeQuiz(true)
        setQuizNum(0)
    }

    

    function selectAnswer(e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
        if(hasSelected){
            return
        }
        // making it true here so it skips the check first time selectAnswer is called
        setHasSelected(true)
        const element = e.target as HTMLDivElement
        if (element.innerHTML === quizData[quizNum].correct_answer) {
            element.classList.add('success')
            return
        }
        element.classList.add('error')

        // if wrong answer then add success class to the right answer
        if (optionsRef.current) {
            const childs = (optionsRef.current as HTMLDivElement).children
            Array.from(childs).forEach(element => {
                if((element as HTMLDivElement).innerHTML === quizData[quizNum].correct_answer){
                    setTimeout(() => {
                        element.classList.add('success')
                    }, 100)
                }
            });
        }
        return
    }

    function StartQuiz(){
        return (
            <div className='btn-container'>
                <button className='btn' onClick={() => setValue(1)}> Start Quiz </button>
            </div>
        )
    }

    function RetakeQuiz(){
        return (
            <div className='btn-container'>
                <button className='btn' onClick={() => retake()}> Retake Quiz </button>
            </div>
        )
    }

    // Note: !! makes number to boolean 0 === false and other === true

    return (
        <section className='container'>
            <h1 className={quizStyle.heading}> Quiz App </h1>
            { value === 1 && loading && <div className='loading'> Loading... </div>}

            {value === 1 &&  error && <div> Failed to fetch data! </div> }

            { !value &&
                <StartQuiz />
            }
            { value === 2 &&
                <RetakeQuiz />
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
                        <button className='btn' style={{ width: '100%' }} onClick={nextQuestion}> {quizNum === quizData.length - 1 ? 'Finish' : 'Next Question'} </button>
                    </div>
                </div>
            }
        </section>
    )
}
