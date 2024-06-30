"use client";
const Searchbar = () => {
    const handleSubmit = () => {}

    return (
        <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="enter product link"
                className="searchbar-input"
            />
            <button className="searchbar-btn" type="submit">
                Search
            </button>
        </form>

    )
}

export default Searchbar
