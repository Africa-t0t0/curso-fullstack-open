function validatePhoneNumber (number) {
    // validate phone number following this criteria:

    // must have 8 or more characters.
    // must be compose in two parts, separated by -.
    // the first part must have 2 or 3 numbers, and the second part is also only numbers.

    const large = number.length >= 8;

    if (!large) {
        return false;
    }

    const splittedNumber = number.split("-");

    if (splittedNumber.length >= 2 && splittedNumber[0].length >= 2 && splittedNumber[1].length >= 2) {
        return true;
    }
    return false;
}

/**
 * Validate phone number following this criteria:
 *
 * - must have 8 or more characters.
 * - must be compose in two parts, separated by -.
 * - the first part must have 2 or 3 numbers, and the second part is also only numbers.
 *
 * @function
 * @param {string} number - The phone number to validate
 * @returns {boolean} true if the phone number is valid, false otherwise
 */
module.exports = validatePhoneNumber;