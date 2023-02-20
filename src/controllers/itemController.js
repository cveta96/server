import { validationResult } from 'express-validator';
import Item from '../models/item';
import dotenv from 'dotenv';

dotenv.config();

//Create new item
const createItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { userId, name, description, price } = req.body;

  try {
    let item = await Item.find({ name, userId });

    if (item.length !== 0)
      return res.status(400).json({ msg: 'Item already exists.' });

    let newItem = new Item({
      userId,
      name,
      description,
      price,
    });

    await newItem.save();

    res.json(newItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error.' });
  }
};

//Edit item
const updateItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { itemId, name, description, price, userId } = req.body;

  try {
    let item = await Item.find({ itemId });

    if (item.length === 0)
      return res.status(404).json({ msg: 'Item not found.' });

    item.name = name;
    item.description = description;
    if (item.price !== price)
      item.priceHistory.push({ price: item.price, date: Date() });
    item.price = price;

    await item.save();

    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error.' });
  }
};

//Get all items
const getAllItems = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { userId } = req.body;

  try {
    let items = await Item.find({ userId });

    if (items.length === 0)
      return res.status(404).json({ msg: 'No items found.' });

    res.json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error.' });
  }
};

//Delete item by id
const deleteItemById = async (req, res) => {
  try {
    const item = Item.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found.' });
    await item.remove();
    res.json({ msg: 'Item removed.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error.' });
  }
};

//Delete all items from
const deleteAllItems = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { userId } = req.body;

  try {
    const items = Item.find({ userId });

    if (items.length === 0)
      return res.status(404).json({ msg: 'Items already deleted.' });
    await items.remove();
    res.json({ msg: 'Items removed.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error.' });
  }
};
export default {
  createItem,
  getAllItems,
  deleteItemById,
  deleteAllItems,
  updateItem,
};
