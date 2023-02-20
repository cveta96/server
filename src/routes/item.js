import { Router } from 'express';
import { check } from 'express-validator';
import item from '../controllers/itemController';

const router = Router();

// @route    POST api/item
// @desc     Create new item and send it back
// @access   Private
router.post(
  '/',
  check('userId', 'UserId is required.').notEmpty(),
  check('name', 'Name is required.').notEmpty(),
  check('description', 'Description is required.').notEmpty(),
  check('price', 'Price is required.').isNumeric({
    min: 0,
  }),
  item.createItem
);

// @route    GET api/item
// @desc     Return items for a specific user
// @access   Private
router.get(
  '/',
  check('userId', 'UserId is required.').notEmpty(),
  item.getAllItems
);

// @route    PATCH api/item
// @desc     Delete all items from user
// @access   Private
router.patch(
  '/',
  check('userId', 'UserId is required.').notEmpty(),
  check('name', 'Name is required.').notEmpty(),
  check('description', 'Description is required.').notEmpty(),
  check('price', 'Price is required.').isNumeric({
    min: 0,
  }),
  item.updateItem
);

// @route    DELETE api/item/:id
// @desc     Delete item
// @access   Private
router.delete('/:id', item.deleteItemById);

// @route    DELETE api/item
// @desc     Delete all items from user
// @access   Private
router.delete('/', check('userId', 'UserId is required'), item.deleteAllItems);

export default router;
