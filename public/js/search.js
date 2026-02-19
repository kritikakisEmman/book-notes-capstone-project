const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("search-results");

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();

  if (query.length < 3) {
    resultsContainer.innerHTML = "";
    return;
  }

  try {
    const response = await fetch(`/search?q=${query}`);
    const books = await response.json();

    // καθάρισε παλιά results
    resultsContainer.innerHTML = "";

    
    books.forEach(book => {
      const item = document.createElement("div");
      item.classList.add("search-item");

      item.innerHTML = `
        <img 
          src="https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg"
          alt="Book cover"
        >
        <div class="search-item-info">
          <strong>${book.title}</strong>
          <span>${book.author || "Unknown author"}</span>
        </div>
      `;
      item.addEventListener("click", () => {
      if (!book.workKey)return;
         console.log("CLICKED ITEM", book);
        window.location.href = `/add?work=${encodeURIComponent(book.workKey)}`;
      });
      resultsContainer.appendChild(item);
    });

  } catch (error) {
    console.error("Search error:", error);
  }
});