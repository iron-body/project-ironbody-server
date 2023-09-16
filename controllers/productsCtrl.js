const { HttpError, ctrlWrapper } = require('../helpers');
const { Product } = require('../models/productModel');

const categoriesProducts = async (req, res) => {
  //   const { _id: owner } = req.user;
  //   const { page = 1, limit = 10, favorite = false } = req.query;
  //   console.log(favorite);
  //   const skip = (page - 1) * limit;
  //   const contacts = await Contact.find({ owner, favorite: favorite }, '-createdAt -updatedAt', {
  //     skip,
  //     limit,
  //   }).populate('owner', 'name');
  const { query } = req;
  if (query) {
    console.log(query);
  }

  const result = await Product.find(query);

  if (!result.length) {
    return res.status(404).json({ message: 'Not found - please change your query' });
  }

  res.json(result);
};
// const getContactById = async (req, res) => {
//   const { _id: owner } = req.user;
//   const response = await Contact.findById({ owner }, req.params.contactId, '-createdAt -updatedAt');
//   if (!response) {
//     throw HttpError(404, 'Not Found');
//   }
//   res.status(200).json(response);
// };
// const addContact = async (req, res) => {
//   const { email, phone } = req.body;
//   const contactEmail = await Contact.findOne({ email });
//   const contactPhone = await Contact.findOne({ phone });
//   if (contactEmail) {
//     throw HttpError(409, `Contact with email ${email} already exists`);
//   }
//   if (contactPhone) {
//     throw HttpError(409, `Contact with phone ${phone} already exist`);
//   }
//   const { _id: owner } = req.user;
//   const newContact = await Contact.create({ ...req.body, owner });
//   if (!newContact) {
//     throw HttpError(404, 'Unable to add contact');
//   }
//   res.status(201).json(newContact);
// };

// const removeContact = async (req, res) => {
//   const response = await Contact.findByIdAndRemove(req.params.contactId);
//   if (!response) {
//     throw HttpError(404, 'Not Found');
//   }
//   res.status(200).json({ message: 'contact deleted' });
// };
// const updateContact = async (req, res) => {
//   const updatedContact = await Contact.findByIdAndUpdate(req.params.contactId, req.body, {
//     new: true,
//   });
//   if (!updatedContact) {
//     throw HttpError(404, 'Not Found');
//   }
//   res.status(200).json(updatedContact);
// };
// const updateFavorite = async (req, res) => {
//   const updateFavorite = await Contact.findByIdAndUpdate(req.params.contactId, req.body, {
//     new: true,
//   });
//   if (!updateFavorite) {
//     throw HttpError(404, 'Not Found');
//   }
//   res.status(200).json(updateFavorite);
// };

module.exports = {
  categoriesProducts: ctrlWrapper(categoriesProducts),
  //   getContactById: ctrlWrapper(getContactById),
  //   addContact: ctrlWrapper(addContact),
  //   removeContact: ctrlWrapper(removeContact),
  //   updateContact: ctrlWrapper(updateContact),
  //   updateFavorite: ctrlWrapper(updateFavorite),
};
