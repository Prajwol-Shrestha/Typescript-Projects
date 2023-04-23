export function contructQuizUrl( qty: number, difficulty: string ):string{
    let quizUrl: string
    if(difficulty !== 'any'){
        quizUrl = `https://opentdb.com/api.php?amount=${qty}&category=31&type=multiple&difficulty=${difficulty.toLowerCase()}`
    } else {
        quizUrl = `https://opentdb.com/api.php?amount=${qty}&category=31&type=multiple`
    }
    return quizUrl
}