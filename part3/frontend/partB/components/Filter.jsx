export default function Filter ({ searchTerm, handleSearchTermChange }) {

    return (
        <>
            <div>filter shown with </div>
            <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
        </>
    );
}