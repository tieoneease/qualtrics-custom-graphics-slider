// Default slider (shows current choice and both extremes)
var config = {
    currentQuestionInfo: Qualtrics.SurveyEngine.QuestionInfo[this.questionId],
    engineInstance: this,
};

// No Extremes slider (shows current choice and hides both extremes)
var config = {
    currentQuestionInfo: Qualtrics.SurveyEngine.QuestionInfo[this.questionId],
    engineInstance: this,
    hideExtremes: true
};

// Hard-coded Extremes slider (shows current choice and sets both extremes)
var config = {
    currentQuestionInfo: Qualtrics.SurveyEngine.QuestionInfo[this.questionId],
    engineInstance: this,
    leftExtremeText: 'Custom Left Extreme',
    rightExtremeText: 'Custom Right Extreme'
};

// Hide current selected choice
var config = {
    currentQuestionInfo: Qualtrics.SurveyEngine.QuestionInfo[this.questionId],
    engineInstance: this,
    hideCurrentSelection: true
};

