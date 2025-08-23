export default function Filter ({ name, searchTerm, handleSearchTermChange }) {

    return (
        <>
            <div>filter shown with </div>
            <input name={name} type="text" value={searchTerm} onChange={handleSearchTermChange} />
        </>
    );
}