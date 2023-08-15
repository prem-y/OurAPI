const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
mongoose.connect('mongodb+srv://premy:Prem%40555@mycluster.rlwbmeg.mongodb.net/questions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB is connected"))
.catch((err) => console.log(err));


const questionSchema = new mongoose.Schema({
  questionId: {type: String},
  question: {type: String},
  option1: {type: String},
  option2: {type: String},
  option3: {type: String},
  option4: {type: String},
  correctOption: {type: String},
  likesnumber: {type: String},
  answered:{type: String},
  correct: {type: String},
  publishedAuthorname: {type: String},
});

const Question = mongoose.model('Question', questionSchema);

app.get('/questions', async (req, res) => {
    try {
      const allQuestions = await Question.find();
      res.json(allQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

app.get('/questions/:questionId', async (req, res) => {
  const questionId = req.params.questionId;

  try {
    const question = await Question.findOne({ questionId });
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/questions', async (req, res) => {
    const newQuestion = req.body;
  
    try {
      const createdQuestion = await Question.create(newQuestion);
      console.log('Question added:', createdQuestion);
      res.status(201).json({ message: 'Question added successfully' });
    } catch (error) {
      console.error('Error adding question:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
app.put('/questions/:questionId', async (req, res) => {
  const questionId = req.params.questionId;
  const updatedQuestion = req.body;

  try {
    await Question.findOneAndUpdate({ questionId }, updatedQuestion);
    res.json({ message: 'Question updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/questions/:questionId', async (req, res) => {
  const questionId = req.params.questionId;

  try {
    await Question.findOneAndDelete({ questionId });
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/questions/:questionId/like', async (req, res) => {
  const questionId = req.params.questionId;

  try {
    const question = await Question.findOne({ questionId });
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    question.likesnumber = (question.likesnumber || 0) + 1;
    await question.save();
    res.json({ message: 'Like updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/questions/published/:publishedAuthorname', async (req, res) => {
  const publishedAuthorname = req.params.publishedAuthorname;

  try {
    const authorQuestions = await Question.find({ publishedAuthorname });
    res.json(authorQuestions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
