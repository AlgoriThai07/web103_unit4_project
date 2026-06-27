export const basePrice = 45000;

export const calculateTotalPrice = (selectedExterior, selectedRoof, selectedWheels, selectedInterior) => {
    const extPrice = selectedExterior?.price || 0;
    const roofPrice = selectedRoof?.price || 0;
    const wheelsPrice = selectedWheels?.price || 0;
    const intPrice = selectedInterior?.price || 0;
    return basePrice + extPrice + roofPrice + wheelsPrice + intPrice;
};

export const getOptionPriceString = (option) => {
    if (!option) return 'Included';
    return option.price === 0 ? 'Included' : `+$${option.price.toLocaleString()}`;
};
