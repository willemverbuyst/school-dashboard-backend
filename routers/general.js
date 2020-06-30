const { Router } = require('express');
const Teacher = require('../models').teacher;

const router = new Router();

module.exports = router;

router.get('/teachers', async (req, res, next) => {
  try {
    const teachers = await Teacher.findAll({ attributes: ['id', 'name'] });
    res.send(teachers);
  } catch (error) {
    next(error);
  }
});