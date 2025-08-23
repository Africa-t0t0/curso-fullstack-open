export default function Persons({ persons, searchTerm, handleRemove}) {

  const personToShow = searchTerm ? persons.filter(person => person.name.includes(searchTerm)) : persons

  const deleteButton = (person) => (
    <button type="button" onClick={handleRemove} value={person.id}>
      remove
    </button>
  )
    if (!persons) {
      return null
    }
    return (
        <ul>
        {personToShow.map((person) => (
          <li key={person.name}>{person.name} {person.number} {deleteButton(person)}</li>
        ))}
      </ul>
    )

}