const mainSection = document.querySelector(".main-section");
const quoteDisplay = document.getElementById("quoteDisplay");
let formRendered = false;

// quote objects
let quoteArray = ["text", "category"];
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

const CreateQuoteForm = document.getElementById("CreateQuoteForm");

// function to create quote form
function createAddQuoteForm() {
  if (formRendered) return;
  const div = document.createElement("div");
  div.classList.add("input-container");

  const newQuoteText = document.createElement("input");
  newQuoteText.type = "text";
  newQuoteText.id = "newQuoteText";
  newQuoteText.placeholder = "Enter new quote";

  const newQuoteCategory = document.createElement("input");
  newQuoteCategory.type = "text";
  newQuoteCategory.id = "newQuoteCategory";
  newQuoteCategory.placeholder =
    "Enter quote category (e.g., Inspiration, Motivation)";

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.id = "newQuote";
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  div.appendChild(newQuoteText);
  div.appendChild(newQuoteCategory);
  div.appendChild(addButton);

  mainSection.appendChild(div);
}

// calling createAddQuoteForm to render the form on page load
CreateQuoteForm.addEventListener("click", () => {
  createAddQuoteForm();
  formRendered = true;
});

// function to add new quotes
function addQuote() {
  const quoteInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const quote = quoteInput.value.trim();
  const quoteCategory = categoryInput.value.trim();

  if (!(quote && quoteCategory)) {
    alert("Please fill in quote and category fields!");
  } else {
    quotes.push({ text: quote, category: quoteCategory });
    const list = document.createElement("li");
    list.classList.add("list-item");
    list.textContent = `${quote}: ${quoteCategory}`;
    quoteDisplay.appendChild(list);
    saveQuotes();
    quoteInput.value = "";
    quoteInput.focus();
    categoryInput.value = "";
    // Update categories dropdown if new category is introduced
    if (
      ![...categoryFilter.options].some((opt) => opt.value === quoteCategory)
    ) {
      const option = document.createElement("option");
      option.value = quoteCategory;
      option.textContent = quoteCategory;
      categoryFilter.appendChild(option);
    }
    alert("Quote added succesfully!");
  }
}

// Revisit
const categoryFilter = document.getElementById("categoryFilter");
function populateCategories() {
  const selectedCategory = [...new Set(quotes.map((q) => q.category))];
  const lastSelected = localStorage.getItem("filter") || "all";
  categoryFilter.innerHTML += selectedCategory
    .map(
      (cat) =>
        `<option value="${cat}" ${
          lastSelected === cat ? "selected" : ""
        }>${cat}</option>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  showRandomQuote();
});

// function to show random quotes
// function showRandomQuote() {
//   const filter = localStorage.getItem("filter") || "all";
//   const filtered = filter === "all" ? quotes : quotes.filter((q) => q.quoteCategory === filter);
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

const exportQuote = document.getElementById("exportQuote");
exportQuote.addEventListener("click", exportToJsonFile);
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

// upload json file
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

const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Simulate fetching quotes from mock API
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL + "?_limit=5");
    const data = await response.json();
    // Map mock API data to quote format
    const apiQuotes = data.map((item) => ({
      text: item.title,
      category: "API",
    }));
    // Add only new quotes
    apiQuotes.forEach((apiQuote) => {
      if (!quotes.some((q) => q.text === apiQuote.text)) {
        quotes.push(apiQuote);
      }
    });
    saveQuotes();
    populateCategories();
    showRandomQuote();
  } catch (err) {
    // Fail silently or show error
  }
}

// Simulate posting a new quote to mock API
async function postQuoteToAPI(quote) {
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1,
      }),
    });
    // No need to handle response for mock
  } catch (err) {
    // Fail silently or show error
  }
}

// Periodically fetch new quotes every 30 seconds
setInterval(fetchQuotesFromAPI, 30000);

// Post new quote to API when added
const originalAddQuote = addQuote;
window.addQuote = function () {
  const quoteInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const quote = quoteInput.value.trim();
  const quoteCategory = categoryInput.value.trim();
  if (quote && quoteCategory) {
    postQuoteToAPI({ text: quote, category: quoteCategory });
  }
  originalAddQuote();
};

// Initial fetch on load
fetchQuotesFromAPI();
async function syncQuotesWithServer() {
  try {
    const response = await fetch(API_URL + "?_limit=5");
    const serverData = await response.json();
    const serverQuotes = serverData.map((item) => ({
      text: item.title,
      category: "API",
    }));

    // Remove all local quotes with category "API"
    quotes = quotes.filter((q) => q.category !== "API");

    // Add server quotes (server takes precedence)
    quotes.push(...serverQuotes);

    saveQuotes();
    populateCategories();
    showRandomQuote();
  } catch (err) {
    // Fail silently or show error
  }
}

// Periodically sync with server every 30 seconds
setInterval(syncQuotesWithServer, 30000);

// Initial sync on load
syncQuotesWithServer();
/**
 * Notification system for updates and conflicts
 */
function showNotification(message, type = "info", actions = []) {
  let notif = document.getElementById("notification");
  if (!notif) {
    notif = document.createElement("div");
    notif.id = "notification";
    notif.style.position = "fixed";
    notif.style.top = "20px";
    notif.style.right = "20px";
    notif.style.zIndex = "9999";
    notif.style.padding = "16px";
    notif.style.borderRadius = "6px";
    notif.style.background = "#222";
    notif.style.color = "#fff";
    notif.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    notif.style.display = "flex";
    notif.style.flexDirection = "column";
    notif.style.gap = "8px";
    document.body.appendChild(notif);
  }
  notif.innerHTML = `<span>${message}</span>`;
  actions.forEach(({ label, onClick }) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.style.marginTop = "6px";
    btn.onclick = () => {
      notif.style.display = "none";
      onClick();
    };
    notif.appendChild(btn);
  });
  notif.style.display = "block";
  setTimeout(() => {
    if (!actions.length) notif.style.display = "none";
  }, 3500);
}

// Notify on successful sync or update
function notifyDataUpdated() {
  showNotification("Quotes synced with server!", "success");
}

// Conflict resolution UI
function resolveConflicts(localConflicts, serverConflicts) {
  let index = 0;
  function showNextConflict() {
    if (index >= localConflicts.length) {
      showNotification("All conflicts resolved.", "success");
      saveQuotes();
      populateCategories();
      showRandomQuote();
      return;
    }
    const local = localConflicts[index];
    const server = serverConflicts[index];
    showNotification(
      `Conflict detected:<br>
      <b>Local:</b> "${local.text}" (${local.category})<br>
      <b>Server:</b> "${server.text}" (${server.category})<br>
      Which version do you want to keep?`,
      "warning",
      [
        {
          label: "Keep Local",
          onClick: () => {
            quotes = quotes.filter(
              (q) => !(q.text === server.text && q.category === server.category)
            );
            quotes.push(local);
            index++;
            showNextConflict();
          },
        },
        {
          label: "Keep Server",
          onClick: () => {
            quotes = quotes.filter(
              (q) => !(q.text === local.text && q.category === local.category)
            );
            quotes.push(server);
            index++;
            showNextConflict();
          },
        },
      ]
    );
  }
  showNextConflict();
}

// Enhanced sync with conflict detection and notification
async function enhancedSyncQuotesWithServer() {
  try {
    const response = await fetch(API_URL + "?_limit=5");
    const serverData = await response.json();
    const serverQuotes = serverData.map((item) => ({
      text: item.title,
      category: "API",
    }));

    // Find conflicts: same text, different category
    const localAPIQuotes = quotes.filter((q) => q.category === "API");
    const conflicts = [];
    const serverConflicts = [];
    localAPIQuotes.forEach((localQ) => {
      const match = serverQuotes.find(
        (sq) => sq.text === localQ.text && sq.category !== localQ.category
      );
      if (match) {
        conflicts.push(localQ);
        serverConflicts.push(match);
      }
    });

    // Remove all local API quotes
    quotes = quotes.filter((q) => q.category !== "API");

    // Add server quotes (server takes precedence unless conflict)
    serverQuotes.forEach((sq) => {
      if (!conflicts.some((c) => c.text === sq.text)) {
        quotes.push(sq);
      }
    });

    if (conflicts.length) {
      showNotification(
        `Conflicts detected during sync. <b>${conflicts.length}</b> conflict(s) found.`,
        "warning",
        [
          {
            label: "Resolve Now",
            onClick: () => resolveConflicts(conflicts, serverConflicts),
          },
        ]
      );
    } else {
      notifyDataUpdated();
      saveQuotes();
      populateCategories();
      showRandomQuote();
    }
  } catch (err) {
    showNotification("Failed to sync with server.", "error");
  }
}

// Replace previous sync function and interval
clearInterval(window._syncInterval);
window._syncInterval = setInterval(enhancedSyncQuotesWithServer, 30000);
enhancedSyncQuotesWithServer();
