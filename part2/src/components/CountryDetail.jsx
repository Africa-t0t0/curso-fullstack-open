export default function CountryDetail({ country, }) {
    return (
        <ul>
            <h1>{country.name.common} {country.flag}</h1>
            <h4>capital: {country.capital}</h4>
            <div>
                languages: {
                    Object.values(country.languages).map((value, index) => (
                        <div key={`${index}-${value}`}>{value}</div>
                    ))
                }
            </div>
            <div>
                flag:
                <img src={country.flags.png} alt="" />
            </div>
        </ul>
    )
}