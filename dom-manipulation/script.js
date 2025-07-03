const quoteDisplay = document.getElementById("quoteDisplay");

// quote objects
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
    text: "Life ite objes what happens when you're busy making other plans.",
    category: "Life",
  },
];

// save quote to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// function to add new quotes
function addQuote() {
  const quoteInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const quote = quoteInput.value.trim();
  const quoteCategory = categoryInput.value.trim();

  if (!(quote && quoteCategory)) {
    alert("Please fill in quote and category fields");
  } else {
    quotes.push({ quote, quoteCategory });
    const list = document.createElement("li");
    list.classList.add("list-item");
    list.textContent = `${quote}: ${quoteCategory}`;
    quoteDisplay.appendChild(list);
    // saveQuotes();
    // populateCategories();
    quoteInput.value = "";
    categoryInput.value = "";
    alert("Quote added succesfully!");
  }
}

// function populateCategories() {
//   const uniqueCategories = [...new Set(quotes.map((q) => q.category))];
//   const lastSelected = localStorage.getItem("filter") || "all";
//   quoteDisplay.innerHTML =
//     '<option value="all">All Categories</option>' +
//     uniqueCategories
//       .map(
//         (cat) =>
//           `<option value="${cat}" ${
//             lastSelected === cat ? "selected" : ""
//           }>${cat}</option>`
//       )
//       .join("");
// }

// function to show random quotes
// function showRandomQuote() {
//   const filter = localStorage.getItem("filter") || "all";
//   const filtered =
//     filter === "all" ? quotes : quotes.filter((q) => q.quoteCategory === filter);
//   if (filtered.length === 0) {
//     quoteDisplay.innerText = "No quotes found in this category.";
//     return;
//   }
//   const random = filtered[Math.floor(Math.random() * filtered.length)];
//   quoteDisplay.innerText = `${random.quote} — ${random.quoteCategory}`;
// }

// document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// function filterQuotes() {
//   const category = document.getElementById("categoryFilter").value;
//   localStorage.setItem("filter", category);
//   showRandomQuote();
// }

// function exportToJsonFile() {
//   const blob = new Blob([JSON.stringify(quotes, null, 2)], {
//     type: "application/json",
//   });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "quotes.json";
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
// }

// function importFromJsonFile(event) {
//   const fileReader = new FileReader();
//   fileReader.onload = function (e) {
//     try {
//       const importedQuotes = JSON.parse(e.target.result);
//       if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");
//       quotes.push(...importedQuotes);
//       saveQuotes();
//       populateCategories();
//       alert("Quotes imported successfully!");
//     } catch {
//       alert("Failed to import. Make sure the file is valid JSON.");
//     }
//   };
//   fileReader.readAsText(event.target.files[0]);
// }

// populateCategories();
// showRandomQuote();
