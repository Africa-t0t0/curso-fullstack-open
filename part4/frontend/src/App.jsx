
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

import Notification from './components/Notification'

import CountriesViewer from './components/CountriesViewer'

import { useEffect, useState } from 'react'

import methods from './services/methods'

const App = () => {
  const [persons, setPersons] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    methods.getAll().then(response => {
      setPersons(response)
    })

  }, [])

  const [newContact, setNewContact] = useState({
    name: "",
    number: ""
  })

  const [searchTerm, setSearchTerm] = useState('');
  const [searchCountry, setSearchCountry] = useState('')

  const handleSearchTermChange = (event) => {
    event.preventDefault();
    let eventName = event.target.name;

    if (eventName === "phonebook") {
      setSearchTerm(event.target.value)
    } else if (eventName === "countries") {
      setSearchCountry(event.target.value)
    } else {
      return;
    }
  }

  const addContact = (event) => {
    event.preventDefault()

    const currentContacts = persons.map(person => person.name)
    if (currentContacts.includes(newContact.name)) {
      const confirmUpdate = window.confirm("User is already added to phonebook, replace old number?")
      const targetId = persons.filter(person => person.name === newContact.name)[0].id
      if (confirmUpdate) {
        const id = targetId
        const promise = methods.update(id, {name: newContact.name, number: newContact.number})
        // handle error in case user its already deleted
        promise.catch(error => {
          console.log("error", error)
          const message = `Information of ${newContact.name} has already been removed from server`
          setMessage(message)
          handleNotification(message);
          return
        })
        setPersons(persons.map(person => person.id !== id ? person : {name: newContact.name, number: newContact.number}))
        const message = `Updated ${newContact.name}`
        handleNotification(message)
        return
      }
    }

    methods.create({name: newContact.name, number: newContact.number})
      .then(response => {
        setPersons(persons.concat(response));
        const message = `Added ${newContact.name}`
        handleNotification(message)
      })
      .catch(error => {
        let errorMessage = `failed to create user: ${error.response.data.error}`;
        handleNotification(errorMessage);
      })
      return
  }

  const removeContact = (event) => {
    event.preventDefault();
    const confirmDelete = window.confirm(`Remove ${event.target.value}`)

    if (confirmDelete) {
      const id = event.target.value
      methods.remove(id)
      setPersons(persons.filter(person => person.id !== id))
    }

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

  const handleNotification = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const filterCountries = (countries, searchTerm) => {
    return countries.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        name="phonebook"
        searchTerm={searchTerm}
        handleSearchTermChange={handleSearchTermChange}
      />
      <Notification message={message} />
      <h2>Add a new</h2>

      <PersonForm
        addContact={addContact}
        newContact={newContact}
        newNameOnChange={newNameOnChange}
        setNewNumberOnChange={setNewNumberOnChange}
      />
      <h2>Numbers</h2>

      <Persons
        searchTerm={searchTerm}
        persons={persons} handleRemove={removeContact}
      />

      <hr></hr>

      <h2>Rest Countries</h2>
      <Filter
        name="countries"
        searchTerm={searchCountry}
        handleSearchTermChange={handleSearchTermChange}
      />

      <CountriesViewer
        searchTerm={searchCountry}
        filterCountries={filterCountries}
        setSearchTerm={setSearchCountry}
      />

    </div>
  )
}

export default App