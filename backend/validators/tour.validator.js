const validateTour = (data) => {
    const { clientId, destination, packageName, travelDate } = data;

    if (!clientId || !destination || !packageName || !travelDate) {
        return {
            isValid: false,
            message: "clientId, destination, packageName, and travelDate are required.",
        };
    }

    return { isValid: true };
};

const validateTourStatus = (data) => {
    const { tripStatus } = data;

    if (!tripStatus) {
        return {
            isValid: false,
            message: "tripStatus is required.",
        };
    }

    return { isValid: true };
};

module.exports = {
    validateTour,
    validateTourStatus,
};
