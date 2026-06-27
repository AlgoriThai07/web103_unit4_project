/**
 * Checks if a specific option is incompatible with current selections in other categories.
 * @returns {string|null} The reason for incompatibility or null if compatible.
 */
export const checkIncompatibility = (option, selectedExterior, selectedRoof, selectedWheels, selectedInterior, incompatibilities) => {
    if (!option || !incompatibilities) return null;

    // Filter current selections from other categories
    const currentSelections = [
        option.category !== 'exterior' ? selectedExterior?.id : null,
        option.category !== 'roof' ? selectedRoof?.id : null,
        option.category !== 'wheels' ? selectedWheels?.id : null,
        option.category !== 'interior' ? selectedInterior?.id : null
    ].filter(Boolean);

    // Look for a matching rule that pairs the option ID with any of the selected IDs
    for (const rule of incompatibilities) {
        if (
            (rule.option1_id === option.id && currentSelections.includes(rule.option2_id)) ||
            (rule.option2_id === option.id && currentSelections.includes(rule.option1_id))
        ) {
            return rule.reason;
        }
    }
    return null;
};

/**
 * Checks if the final combination of 4 selections has any incompatibilities.
 * @returns {string|null} The reason of the first invalid combo, or null if valid.
 */
export const isCombinationInvalid = (selectedExterior, selectedRoof, selectedWheels, selectedInterior, incompatibilities) => {
    if (!selectedExterior || !selectedRoof || !selectedWheels || !selectedInterior || !incompatibilities) {
        return null;
    }

    const activeIds = [selectedExterior.id, selectedRoof.id, selectedWheels.id, selectedInterior.id];
    
    for (const rule of incompatibilities) {
        if (activeIds.includes(rule.option1_id) && activeIds.includes(rule.option2_id)) {
            return rule.reason;
        }
    }
    
    return null;
};
