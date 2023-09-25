const { HttpError, ctrlWrapper } = require("../helpers");
const { Filter } = require("../models/filter");

const getFilters = async (req, res) => {
    const { filter } = req.query;
    const result = await Filter.find({ filter: filter }, " -_id -filter -imgURL");
    if (!result) {
        throw HttpError(404, `The filter with value "${filter}" not found`);
    }
    const namesArr = result.map(el => el.name)
        res.status(200).json(namesArr);    
};


module.exports = {
  getFilters: ctrlWrapper(getFilters),
};

