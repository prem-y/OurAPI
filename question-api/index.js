const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require("cors");
app.use(cors());
mongoose.set("strictQuery", false);

const { ObjectId } = require("mongodb");


app.use(express.json());


const PORT = 4000;

app.use(bodyParser.json());
mongoose.connect('mongodb+srv://premy:Prem%40555@mycluster.rlwbmeg.mongodb.net/questions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB is connected"))
.catch((err) => console.log(err));


var conn = mongoose.connection;

const questionSchema = new mongoose.Schema({
  question: {type: String},
  option1: {type: String},
  option2: {type: String},
  option3: {type: String},
  option4: {type: String},
  correctOption: {type: String},
  likesnumber: {type: Number},
  answered:{type: Number},
  correct: {type: Number},
  username: {type: String},
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



app.post("/questions/delete", async (req, res) => {
  const id = req.body.id;

  try {
    const result = await Question.deleteOne({ _id: ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).send("No questions found");
    } else {
      res.status(204).send("Success");
    }
  } catch (error) {
    res.status(500).send("Error deleting question");
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

app.get('/questions/:username', async (req, res) => {
  const name = req.params.username;

  try {
    const authorQuestions = await Question.find({
      username: { $eq: name }
    });
    res.json(authorQuestions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.get('/api/random-question', async (req, res) => {
//   const questions = await Question.find();
//   const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

//   res.json(randomQuestion);
// });

app.get('/api/random-question', async (req, res) => {
  const questions = await Question.find();

  // Create a set to store the questions that have already been fetched.
  const fetchedQuestions = new Set();

  // Loop through the questions and find a random question that has not been fetched yet.
  let randomQuestion;
  do {
    randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  } while (fetchedQuestions.has(randomQuestion));

  // Add the random question to the set of fetched questions.
  fetchedQuestions.add(randomQuestion);

  res.json(randomQuestion);
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
