const validateHotel = (data) => {
    const {
        name,
        category,
        contactPerson,
        cityId,
    } = data;

    if (!name || !category || !contactPerson || !cityId) {
        return {
            isValid: false,
            message: "Name, category, contactPerson and cityId are required.",
        };
    }

    return {
        isValid: true,
    };
};

module.exports = {
    validateHotel,
};