export default function Persons({ persons, searchTerm}) {
    return (
        <ul>
        {persons.filter(person =>
          person.name.includes(searchTerm)
          ).map(person =>
          <li key={person.name}>{person.name} - {person.number}</li>
          )}
      </ul>
    )

}