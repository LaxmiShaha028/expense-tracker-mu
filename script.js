class ExpenseTracker {
  constructor() {
    this.$balance = $("#balance");
    this.$money_plus = $("#money-plus");
    this.$money_minus = $("#money-minus");
    this.$list = $("#list");
    this.$form = $("#form");
    this.$text = $("#text");
    this.$amount = $("#amount");
    this.$category = $("#category");

    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    this.init();
    this.$form.on("submit", this.addTransaction.bind(this));
  }

  init() {
    this.$list.empty();
    this.transactions.forEach(this.addTransactionDOM.bind(this));
    this.updateValues();
  }

  addTransaction(e) {
    e.preventDefault();

    const text = this.$text.val().trim();
    const amountValue = this.$amount.val().trim();
    const category = this.$category.val();

    if (text === "" || amountValue === "" || isNaN(amountValue) || Number(amountValue) === 0) {
      alert("Please enter a valid text and non-zero amount.");
      return;
    }

    const amount = Number(amountValue);
    const type = $('input[name="transactionType"]:checked').val();
    const signedAmount = type === "expense" ? -Math.abs(amount) : Math.abs(amount);

    const transaction = {
      id: Date.now(),
      text,
      amount: signedAmount,
      category
    };

    this.transactions.push(transaction);
    this.updateLocalStorage();
    this.addTransactionDOM(transaction);
    this.updateValues();

    this.$text.val("");
    this.$amount.val("");
  }

  addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const $item = $("<li>")
      .addClass(transaction.amount < 0 ? "minus" : "plus")
      .html(`
        ${transaction.text} <em>(${transaction.category})</em>
        <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" data-id="${transaction.id}">x</button>
      `);

    this.$list.append($item);

    // Attach delete handler
    $item.find(".delete-btn").on("click", () => {
      this.removeTransaction(transaction.id);
    });
  }

  updateValues() {
    const amounts = this.transactions.map(t => t.amount);
    const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
    const income = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
    const expense = (amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0) * -1).toFixed(2);

    this.$balance.text(`$${total}`);
    this.$money_plus.text(`+$${income}`);
    this.$money_minus.text(`-$${expense}`);
  }

  removeTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.updateLocalStorage();
    this.init();
  }

  updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }
}

const tracker = new ExpenseTracker();
