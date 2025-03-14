document.addEventListener("DOMContentLoaded", () => {
  const transactionsTable = document
    .getElementById("transactions")
    .getElementsByTagName("tbody")[0];
  transactionsTable.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  const fetchTransactions = (retries = 5, delay = 1000) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/payments/past-transactions", true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        transactionsTable.innerHTML = "";

        if (data.length === 0) {
          if (retries > 0) {
            setTimeout(() => fetchTransactions(retries - 1, delay), delay);
          } else {
            transactionsTable.innerHTML =
              "<tr><td colspan='4'>No transactions found.</td></tr>";
          }
          return;
        }

        data.forEach((transaction) => {
          const row = transactionsTable.insertRow();
          row.insertCell().textContent = transaction.id;
          row.insertCell().textContent = `$${(transaction.amount / 100).toFixed(
            2
          )}`;
          row.insertCell().textContent = transaction.status;
          row.insertCell().textContent = new Date(
            transaction.createdAt
          ).toLocaleString();
        });
      } else {
        console.error("Error fetching transactions:", xhr.statusText);
        transactionsTable.innerHTML =
          "<tr><td colspan='4'>Failed to load transactions.</td></tr>";
      }
    };
    xhr.onerror = function () {
      console.error("Error fetching transactions:", xhr.statusText);
      transactionsTable.innerHTML =
        "<tr><td colspan='4'>Failed to load transactions.</td></tr>";
    };
    xhr.send();
  };

  fetchTransactions();

  setInterval(fetchTransactions, 5000);
});
