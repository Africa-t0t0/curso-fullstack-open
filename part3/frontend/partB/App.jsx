import { useState } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      number: '530-4043-31'
    }
  ])

  const [newContact, setNewContact] = useState({
    name: "",
    number: ""
  })

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchTermChange = (event) => {
    event.preventDefault();

    setSearchTerm(event.target.value)
  }

  const addContact = (event) => {
    event.preventDefault()

    const currentContacts = persons.map(person => person.name)
    if (currentContacts.includes(newContact.name)) {
      alert(`${newContact.name} is already added to phonebook`)
      return
    }
    setPersons(persons.concat({ name: newContact.name, number: newContact.number }))
  }

  const newNameOnChange = (event) => {
    setNewContact({
      ...newContact,
      name: event.target.value
    })
  }

  const setNewNumberOnChange = (event) => {
    setNewContact({
      ...newContact,
      number: event.target.value
    })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} handleSearchTermChange={handleSearchTermChange} />

      <h2>Add a new</h2>

      <PersonForm
        addContact={addContact}
        newContact={newContact}
        newNameOnChange={newNameOnChange}
        setNewNumberOnChange={setNewNumberOnChange}
      />
      <h2>Numbers</h2>

      <Persons searchTerm={searchTerm} persons={persons} />
    </div>
  )
}

export default App