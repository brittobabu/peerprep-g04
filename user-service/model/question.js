import QuestionModel from "./question-model.js"

export async function addQuestion(title, description, category, complexity) {
    return new QuestionModel({ title, description, category, complexity }).save()
}

export async function findAllQuestions() {
    return QuestionModel.find();
}

export async function findQuestionByDescription(description) {
    return QuestionModel.findOne({ description });
}

export async function findQuestionByTitle(title) {
    return QuestionModel.findOne({ title });
}

export async function findQuestionByCategory(category) {
    return QuestionModel.find({ description });
}

export async function findQuestionByComplexity(complexity) {
    return QuestionModel.find({ description });
}

export async function findQuestionById(id) {
    return QuestionModel.findOne({ questionId: id});
}

export async function updateQuestion(questionId,title, description, category, complexity) {
    return QuestionModel.findOneAndUpdate(
        {questionId:questionId},
        {
            $set: {
                title,
                description,
                category,
                complexity,
            },
        },
        { new: true },  // return the updated user
    );
}

export async function deleteQuestionById(id) {
    return QuestionModel.findOneAndDelete({questionId: id});
}