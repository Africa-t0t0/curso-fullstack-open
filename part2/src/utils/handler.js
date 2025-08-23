import country_methods from "../services/country_methods"


const handleCountryNames = async () => {
    const responseData = country_methods.getAll()
    return responseData
}

const handleSpecificCountryName = async (name) => {
    const responseData = country_methods.getSpecificCountry(name)
    return responseData
}


export default {
    handleCountryNames,
    handleSpecificCountryName
}