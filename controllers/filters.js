const { HttpError, ctrlWrapper } = require("../helpers");
const { Filter } = require("../models/filter");

const getAllFilters = async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Filter.find({skip, limit});
    if (!result) {
        throw HttpError(404, `The filter with value "${filter}" not found`);
    }
   
        res.status(200).json(result);    
};


const getFilters = async (req, res) => {
    const { filter } = req.query;
    
    const result = await Filter.find({ filter: filter }, "-_id");
    if (!result) {
        throw HttpError(404, `The filter with value "${filter}" not found`);
    }
    // const namesArr = result.map(el => el.name)
        res.status(200).json(result);    
};


module.exports = {
    getFilters: ctrlWrapper(getFilters),
    getAllFilters: ctrlWrapper(getAllFilters)
};

