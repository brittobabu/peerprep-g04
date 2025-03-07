import QuestionModel from "./question-model.js"

export async function addQuestion(title,description,category,complexity) {
    return new QuestionModel({title,description,category,complexity}).save()
}
