let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: "The best way to predict the future is to create it.",
    category: "Inspiration",
  },
  {
    text: "Do not be afraid to give up the good to go for the great.",
    category: "Motivation",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const filter = localStorage.getItem("filter") || "all";
  const filtered =
    filter === "all" ? quotes : quotes.filter((q) => q.category === filter);
  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").innerText =
      "No quotes found in this category.";
    return;
  }
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById(
    "quoteDisplay"
  ).innerText = `${random.text} — ${random.category}`;
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;
  if (!text || !category) return alert("Please fill in both fields");
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added!");
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map((q) => q.category))];
  const lastSelected = localStorage.getItem("filter") || "all";
  select.innerHTML =
    '<option value="all">All Categories</option>' +
    uniqueCategories
      .map(
        (cat) =>
          `<option value="${cat}" ${
            lastSelected === cat ? "selected" : ""
          }>${cat}</option>`
      )
      .join("");
}

function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("filter", category);
  showRandomQuote();
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch {
      alert("Failed to import. Make sure the file is valid JSON.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

populateCategories();
showRandomQuote();
