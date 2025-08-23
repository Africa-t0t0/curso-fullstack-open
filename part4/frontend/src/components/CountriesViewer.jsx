import { useEffect, useState } from "react"

import handler from "../utils/handler"
import CountryDetail from "./CountryDetail"


export default function CountriesViewer({ searchTerm, setSearchTerm, filterCountries }) {

    const [countries, setCountries] = useState(null)

    useEffect(() => {
        const getKeys = async () => {
            const keys = await handler.handleCountryNames()
            setCountries(keys)
        }
        getKeys()
    }, [])

    if (!countries) {
        return null
    }

    const filteredCountries = filterCountries(countries, searchTerm)

    let content = null;

    const handleButtonClicked = (event) => {
        event.preventDefault()
        const buttonName = event.target.name
        console.log("button name", buttonName)
        setSearchTerm(buttonName)
    }

    if (filteredCountries.length === 1) {
        const country = filteredCountries[0]
        content = <CountryDetail country={country} />

    } else if (filterCountries.length > 1) {
        content = (
            filteredCountries.map((country) => (
                <ul
                    key={country.name.common}
                >
                    <div>{country.name.common}</div>
                    <button
                        type="button"
                        name={country.name.common}
                        onClick={handleButtonClicked}
                    >
                        show details
                    </button>
                </ul>
            ))
        )
    }

    return (
        <li>
            {content}
        </li>
    )


}