import SuccessStory from '../models/SuccessStory.js';
import User from '../models/User.js';

// POST /api/stories (student submits story - Issue #5)
export const submitStory = async (req, res) => {
  try {
    const { story, featName, imageUrl } = req.body;
    if (!story) {
      return res.status(400).json({ message: 'Story text is required' });
    }

    const user = await User.findById(req.user._id);
    const newStory = await SuccessStory.create({
      userId: req.user._id,
      name: user.name,
      branch: user.branch,
      story,
      featName,
      imageUrl,
      status: 'pending'
    });

    res.status(201).json({ message: 'Story submitted for review', story: newStory });
  } catch (error) {
    console.error('submitStory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/stories/approved (public - for mentor profile)
export const getApprovedStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ status: 'approved' })
      .sort({ approvedAt: -1 });
    res.json(stories);
  } catch (error) {
    console.error('getApprovedStories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/stories/pending (mentor)
export const getPendingStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ status: 'pending' })
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    console.error('getPendingStories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/stories/:id/approve (mentor)
export const approveStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedAt: new Date() },
      { new: true }
    );
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json({ message: 'Story approved', story });
  } catch (error) {
    console.error('approveStory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/stories/:id/reject (mentor)
export const rejectStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json({ message: 'Story rejected', story });
  } catch (error) {
    console.error('rejectStory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
