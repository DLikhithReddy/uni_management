import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Curriculum", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define the Mongoose schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  password: { type: String, required: true },
});
  
// Model based on the schema, specifying the collection name "data"
const User = mongoose.model("User", userSchema, "data");
  
const yearSchema = new mongoose.Schema({
  subject: String,
  year:  Number,
  sem: Number,
  credits: Number,
  text: String,
  pname: String, // Added pname to the schema
    imageUrl: String,
    plink: String  

});
const Data = mongoose.model("", yearSchema, "Faculty");

app.get('/api/data/:subject', async (req, res) => {
  const subject = req.params.subject;
  console.log(subject);
  try {
    // Fetch data from MongoDB for the specified subject
    const result = await Data.findOne({ subject: subject });
    // result = result.text;
    console.log(result['text']);
    if (!result) {
      return res.status(404).json({ message: 'Data not found for the specified subject' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const data = mongoose.model("",yearSchema, "Faculty");
app.get('/api/data/:year/:sem', async (req, res) => {
    const year = req.params.year;
    const sem = req.params.sem;
    try {
        const result = await data.find({year: year,  sem: sem});
        const subjects = result.map(item => item.subject);
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/data/:subject', async (req, res) => {
  const subject = req.params.subject;
  try {
    // Fetch image URL from MongoDB for the specified subject
    const result = await Data.findOne({ subject: subject });
    if (!result || !result.imageURL) {
      return res.status(404).json({ message: 'Image not found for the specified subject' });
    }
    res.json({ imageURL: result.imageURL });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/home.html");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/about.html");
});

// Serve other HTML pages
app.get("/first", (req, res) => {
  res.sendFile(__dirname + "/first.html");
});

app.get("/second", (req, res) => {
  res.sendFile(__dirname + "/second.html");
});

app.get("/third", (req, res) => {
  res.sendFile(__dirname + "/third.html");
});

app.get("/fourth", (req, res) => {
  res.sendFile(__dirname + "/fourth.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/faculty", (req, res) => {
  res.sendFile(__dirname + "/faculty.html");
});
app.get("/circ", (req, res) => {
  res.sendFile(__dirname + "/circ.html");
});

app.get("/courses", (req, res) => {
  res.sendFile(__dirname + "/courses.html");
});

// Handle form submission
app.post("/submit", async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ userId });

    if (!user) {
      res.redirect("/login"); // Redirect to login page if user does not exist
      return;
    }

    // Check if the password matches
    if (user.password === password) {
      // Redirect users based on their user ID
      if (userId.startsWith("se21ucse") || userId.startsWith("se21uari")) {
        res.redirect("/third");
      } else if (userId.startsWith("se20ucse") || userId.startsWith("se20uari")) {
        res.redirect("/fourth");
      } else if (userId.startsWith("se22ucse") || userId.startsWith("se22uari")) {
        res.redirect("/second");
      } else if (userId.startsWith("se23ucse") || userId.startsWith("se23uari")) {
        res.redirect("/first");
      } else {
        res.redirect("/login"); // Redirect to login page if user ID doesn't match any condition
      }
    } else {
      res.redirect("/login"); // Redirect to login page if password is incorrect
    }
  } catch (error) {
    console.error("Error:", error);
    res.redirect("/login"); // Redirect to login page in case of error
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
