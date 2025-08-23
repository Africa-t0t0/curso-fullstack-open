export default function PersonForm({ addContact, newContact, newNameOnChange, setNewNumberOnChange}) {
    return (
        <>
        <form onSubmit={addContact}>
        <div>
          name: <input value={newContact.name} onChange={newNameOnChange} />
        </div>
        <div>
          number: <input value={newContact.number} onChange={setNewNumberOnChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
        </>
    );
}