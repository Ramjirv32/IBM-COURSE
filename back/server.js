import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const port = 9000;
app.use(bodyParser.json());
app.use(cors());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000,
    message: "Too many requests from this IP, please try again after an hour"
});
app.use(limiter);

const jwts = "biorenf3ipnjepnf4reipnfrs";

try {
    mongoose.connect("mongodb://localhost:27017/cibm", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connected to database");
    }).catch((error) => {
        console.error("Error in connecting to database", error);
    });
} catch (error) {
    console.log("Error in connecting to database");
}


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, jwts);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token.' });
  }
};

app.get("/", (req, res) => {
    res.send("Working in GET method");
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }

    try {
        const user = await mongoose.connection.collection("users").findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            const token = jwt.sign(
                { 
                    username: user.username, 
                    email: user.email,
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 
                }, 
                jwts
            );
            return res.status(200).json({ 
                message: "Login successful", 
                token,
                username: user.username,
                email: user.email
            });
        } else {
            return res.status(401).json({ error: "Invalid password" });
        }
    } catch (error) {
        console.error("Error during login", error);
        return res.status(500).json({ error: "An error occurred during login" });
    }
});


app.post("/sig", async (req, res) => {
    const { username, password, email } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }

    try {
        const userExists = await mongoose.connection.collection("users").findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });
        
        if (userExists) {
            return res.status(400).json({ error: "User or email already exists" });
        }

        const hashp = await bcrypt.hash(password, 10);
        const result = await mongoose.connection.collection("users").insertOne({
            username,
            email,
            password: hashp
        });
        
        return res.status(201).json({
            message: "User inserted successfully",
            userId: result.insertedId
        });
    } catch (error) {
        console.error("Error in inserting data", error);
        return res.status(500).json({ error: "Error creating user" });
    }
});

app.post('/createpost', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const post = {
      title,
      content,
      author: {
        username: req.user.username,
        email: req.user.email
      },
      createdAt: new Date()
    };

    const result = await mongoose.connection.collection("posts").insertOne(post);
    return res.status(201).json({ 
      message: "Post created successfully", 
      postId: result.insertedId 
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Error creating post' });
  }
});


app.get('/posts', authenticateToken, async (req, res) => {
  try {
    const posts = await mongoose.connection.collection("posts")
      .find()
      .sort({ createdAt: -1 }) 
      .toArray();
    
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ error: 'Error fetching posts' });
  }
});


app.delete('/posts/:postId', authenticateToken, async (req, res) => {
  try {
    const postId = new mongoose.Types.ObjectId(req.params.postId);
    const post = await mongoose.connection.collection("posts").findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.author || post.author.email !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await mongoose.connection.collection("posts").deleteOne({ _id: postId });
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ error: 'Error deleting post' });
  }
});


app.put('/posts/:postId', authenticateToken, async (req, res) => {
  try {
    const postId = new mongoose.Types.ObjectId(req.params.postId);
    const { title, content } = req.body;

    const post = await mongoose.connection.collection("posts").findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }


    if (post.author.email !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized to edit this post' });
    }

    await mongoose.connection.collection("posts").updateOne(
      { _id: postId },
      { 
        $set: { 
          title, 
          content,
          updatedAt: new Date()
        } 
      }
    );

    return res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    return res.status(500).json({ error: 'Error updating post' });
  }
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
