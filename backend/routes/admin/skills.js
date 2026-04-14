const express = require('express');
const router = express.Router();
const Skill = require('../../models/Skill');

// GET all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// POST add new skill
router.post('/', async (req, res) => {
  try {
    const { name, level, category, proficiency } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Skill name required' });

    const validCategories = ['frontend', 'backend', 'tools', 'database', 'soft'];
    const safeCategory = validCategories.includes(category) ? category : 'frontend';
    const parsedProficiency = Number(proficiency ?? level);
    const safeProficiency = Number.isFinite(parsedProficiency)
      ? Math.max(1, Math.min(100, parsedProficiency))
      : 50;

    const skill = new Skill({
      name: name.trim(),
      category: safeCategory,
      proficiency: safeProficiency,
    });
    await skill.save();
    res.status(201).json({ success: true, message: 'Skill added successfully', data: skill });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add skill', error: error.message });
  }
});

// PUT update skill
router.put('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    const updatedData = { ...req.body };
    const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });

    res.json({ success: true, message: 'Skill updated successfully', data: updatedSkill });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update skill', error: error.message });
  }
});

// DELETE skill
router.delete('/:id', async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete skill', error: error.message });
  }
});

module.exports = router;
