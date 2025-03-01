import mongoose from "mongoose";

const Schema = mongoose.Schema;

const QuestionModelSchema = new Schema({

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  complexity: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],  // Restrict complexity to these three values
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

export default mongoose.model("QuestionModel", QuestionModelSchema);

