export type QuizResponse = {
    response_code: number,
    results: {
        type: string,
        category: string,
        difficulty: string,
        question: string,
        correct_answer: string,
        incorrect_answers: string[],
        options: string[]
    }[]
}

export default async function getRequest(url: string): (Promise<QuizResponse>){
    try{
        const response = await fetch(url)
        const data = await response.json() as QuizResponse
        return data
    } catch (error){
        console.error(error);
        throw new Error('Failed to fetch data')
    }
}