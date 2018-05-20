this.hideChoices();
var config = {
    currentQuestionInfo: Qualtrics.SurveyEngine.QuestionInfo[this.questionId],
    engineInstance: this
};
var slider = new QualtricsImageSlider('YOUR_DIV_ID', config);
