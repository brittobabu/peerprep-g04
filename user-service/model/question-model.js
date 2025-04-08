import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique questionId

const Schema = mongoose.Schema;

const QuestionModelSchema = new Schema({
  questionId: {
    type: String,
    unique: true, // Ensure uniqueness
    default: uuidv4, // Generate a unique ID automatically
  },
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
    enum: ["Easy", "Medium", "Hard"], // Restrict complexity to these values
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

export default mongoose.model("QuestionModel", QuestionModelSchema);
