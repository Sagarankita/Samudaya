const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/samudaya', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  bio: String,
  memberSince: { type: Date, default: Date.now },
  eventsAttended: { type: Number, default: 0 },
  volunteerHours: { type: Number, default: 0 }
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  capacity: { type: Number, required: true },
  registered: { type: Number, default: 0 },
  imageUrl: String,
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['draft', 'published', 'cancelled'], default: 'draft' },
  tags: [String],
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['Info', 'Emergency', 'Event Update'], required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresOn: Date
}, { timestamps: true });

const ForumThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['Ideas', 'Feedback', 'Help'], required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  isPinned: { type: Boolean, default: false },
  replies: { type: Number, default: 0 },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Event = mongoose.model('Event', EventSchema);
const Announcement = mongoose.model('Announcement', AnnouncementSchema);
const ForumThread = mongoose.model('ForumThread', ForumThreadSchema);

// Auth Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) throw new Error();
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Admin Middleware
const adminAuth = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', auth, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    bio: req.user.bio,
    memberSince: req.user.memberSince,
    eventsAttended: req.user.eventsAttended,
    volunteerHours: req.user.volunteerHours
  });
});

// ============ EVENT ROUTES ============

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    
    if (category && category !== 'all') filter.category = category;
    if (status) filter.status = status;
    else filter.status = 'published'; // Only show published events by default
    
    const events = await Event.find(filter)
      .populate('creatorId', 'name email')
      .sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creatorId', 'name email')
      .populate('attendees', 'name email')
      .populate('volunteers', 'name email');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create event
app.post('/api/events', auth, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      creatorId: req.user._id
    });
    
    await event.save();
    await event.populate('creatorId', 'name email');
    
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update event
app.put('/api/events/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Check if user is creator or admin
    if (event.creatorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    Object.assign(event, req.body);
    await event.save();
    await event.populate('creatorId', 'name email');
    
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete event
app.delete('/api/events/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Check if user is creator or admin
    if (event.creatorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register for event
app.post('/api/events/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already registered' });
    }
    
    if (event.registered >= event.capacity) {
      return res.status(400).json({ error: 'Event is full' });
    }
    
    event.attendees.push(req.user._id);
    event.registered = event.attendees.length;
    await event.save();
    
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ ANNOUNCEMENT ROUTES ============

// Get all announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    
    if (type && type !== 'all') filter.type = type;
    
    const announcements = await Announcement.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create announcement (admin only)
app.post('/api/announcements', auth, adminAuth, async (req, res) => {
  try {
    const announcement = new Announcement({
      ...req.body,
      author: req.user._id
    });
    
    await announcement.save();
    await announcement.populate('author', 'name email');
    
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete announcement (admin only)
app.delete('/api/announcements/:id', auth, adminAuth, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ FORUM ROUTES ============

// Get all forum threads
app.get('/api/forum', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    
    if (category && category !== 'all') filter.category = category;
    
    const threads = await ForumThread.find(filter)
      .populate('author', 'name email')
      .sort({ isPinned: -1, createdAt: -1 });
    
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create forum thread
app.post('/api/forum', auth, async (req, res) => {
  try {
    const thread = new ForumThread({
      ...req.body,
      author: req.user._id
    });
    
    await thread.save();
    await thread.populate('author', 'name email');
    
    res.status(201).json(thread);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ USER PROFILE ROUTES ============

// Update profile
app.put('/api/users/profile', auth, async (req, res) => {
  try {
    const updates = ['name', 'bio'];
    const allowedUpdates = {};
    
    updates.forEach(update => {
      if (req.body[update] !== undefined) {
        allowedUpdates[update] = req.body[update];
      }
    });
    
    Object.assign(req.user, allowedUpdates);
    await req.user.save();
    
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      bio: req.user.bio,
      role: req.user.role
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's registered events
app.get('/api/users/events', auth, async (req, res) => {
  try {
    const events = await Event.find({
      attendees: req.user._id
    }).populate('creatorId', 'name email');
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});