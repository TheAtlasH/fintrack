"use strict";

/////////////////////////////////////////////////////////////
// Data
/////////////////////////////////////////////////////////////

const accounts = [
  {
    owner: "Shafiqul Rahman",
    movements: [2500, 500, -750, 1200, 3200, -1500, 500, 1200, -1750, 1800],
    interestRate: 1.5, // %
    password: 1234,
    movementsDates: [
      "2021-11-18T21:31:17.178Z",
      "2021-12-23T07:42:02.383Z",
      "2022-01-28T09:15:04.904Z",
      "2022-04-01T10:17:24.185Z",
      "2022-07-08T14:11:59.604Z",
      "2022-09-19T17:01:17.194Z",
      "2022-09-22T23:36:17.929Z",
      "2022-09-25T12:51:31.398Z",
      "2022-09-29T06:41:26.190Z",
      "2022-09-30T08:11:36.678Z",
    ],
    currency: "USD",
    locale: "en-US",
  },
  {
    owner: "Sumaya Binte Alizeh",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -300, 1500, -1850],
    interestRate: 1.3, // %
    password: 5678,
    movementsDates: [
      "2021-12-11T21:31:17.671Z",
      "2021-12-27T07:42:02.184Z",
      "2022-01-05T09:15:04.805Z",
      "2022-02-14T10:17:24.687Z",
      "2022-03-12T14:11:59.203Z",
      "2022-05-16T17:01:17.392Z",
      "2022-08-10T23:36:17.522Z",
      "2022-09-03T12:51:31.491Z",
      "2022-09-18T06:41:26.394Z",
      "2022-09-21T08:11:36.276Z",
    ],
    currency: "EUR",
    locale: "en-GB",
  },
];

/////////////////////////////////////////////////////////////
// Elements
/////////////////////////////////////////////////////////////

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance-value");
const labelSumIn = document.querySelector(".summary-value-in");
const labelSumOut = document.querySelector(".summary-value-out");
const labelSumInterest = document.querySelector(".summary-value-interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login-btn");
const btnTransfer = document.querySelector(".form-btn-transfer");
const btnLoan = document.querySelector(".form-btn-loan");
const btnClose = document.querySelector(".form-btn-close");
const btnSort = document.querySelector(".btn-sort");

const inputLoginUsername = document.querySelector(".login-input-username");
const inputLoginPassword = document.querySelector(".login-input-password");
const inputTransferTo = document.querySelector(".form-input-to");
const inputTransferAmount = document.querySelector(".form-input-amount");
const inputLoanAmount = document.querySelector(".form-input-loan-amount");
const inputCloseUsername = document.querySelector(".form-input-username");
const inputClosePassword = document.querySelector(".form-input-password");

/////////////////////////////////////////////////////////////////////
// Update UI
/////////////////////////////////////////////////////////////////////

function updateUI(currentAccount){
    displayMovements(currentAccount);
    displaySummary(currentAccount);
    displayBalance(currentAccount);
}

/////////////////////////////////////////
// formatting currency
/////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

function formatCurrency(value, locale, currency){
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
}

////////////////////////////////////////////////////
// Days calculation
////////////////////////////////////////////////////

function formatMoveDate(date, locale){
  const calculateDays = (date1, date2) =>
  Math.round(Math.abs(date2 - date1)/(24 * 60 * 60 * 1000));

  const daysPassed = calculateDays(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed === 7) return `${daysPassed} days ago`;

return new Intl.DateTimeFormat(locale, {
  year: "numeric",
  month: "short",
  day: "numeric",
}).format(date);
}

/////////////////////////////////////////////////////////////////////
// Username
/////////////////////////////////////////////////////////////////////

function createUsernames(accounts){
    accounts.forEach((account) => {
        account.username = account.owner.toLowerCase().split(" ").map((word) => word[0]).join("");
    })
}
createUsernames(accounts)

/////////////////////////////////////////////////////////////////////
// Login
/////////////////////////////////////////////////////////////////////

let currentAccount, timer;

btnLogin.addEventListener("click",function(e){
    e.preventDefault();

    currentAccount = accounts.find((account) => account.username === inputLoginUsername.value);

if(currentAccount?.password === Number(inputLoginPassword.value)){
  setTimeout(() => {

      // Display UI and welcome
      labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
      containerApp.style.opacity = 1;

      // Display date and time
      const now = new Date();

      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };

      labelDate.textContent = new Intl.DateTimeFormat(
        currentAccount.locale,
        options
      ).format(now);

      // log out timer
      if (timer) clearInterval(timer);
      timer = logOut();

// Update UI
updateUI(currentAccount);
}, 3000);
} else{
    setTimeout(() => {
    // Hide UI and warning sms
    labelWelcome.textContent = "Login failed!";
    containerApp.style.opacity = 0;
}, 3000);
}
// Clear fields
inputLoginUsername.value = inputLoginPassword.value="";
inputLoginPassword.blur();
});

/////////////////////////////////////////////////////////////////////
// Movements
/////////////////////////////////////////////////////////////////////

function displayMovements(account,sort = false){
    containerMovements.innerHTML = "";
    console.log(account);

    const moves = sort? account.movements.slice(0).sort((a,b) => a-b): account.movements;

    moves.forEach((move,i) => {
        const type = move > 0? "deposit" : "withdrawal";

        const formattedmove = formatCurrency(
          move,
          account.locale,
          account.currency
        );

        const date = new Date(account.movementsDates[i]);
        const displayDate = formatMoveDate(date, account.locale);

        const html = `
        <div class = "movements-row">
        <div class ="movements-type movements-type-${type}">${i + 1} ${type}</div>
        <div class="movements-date">${displayDate}</div>
          <div class="movements-value">${formattedmove}</div>
        </div>
        </div>`;

        containerMovements.insertAdjacentHTML("afterbegin",html);
    });
}

/////////////////////////////////////////////////////////////////////
// Summary
/////////////////////////////////////////////////////////////////////

function displaySummary(account){
  // Incomes
  const incomes = account.movements.filter((move) => move > 0).reduce((acc , deposit) => acc +
   deposit, 0);

   labelSumIn.textContent = formatCurrency(
     incomes,
     account.locale,
     account.currency
   );
  //  outcomes
  const outcomes = account.movements.filter((move) => move < 0).reduce((acc,withdrawal) => acc + withdrawal, 0);

  labelSumOut.textContent = formatCurrency (
    Math.abs(outcomes),
    account.locale,
    account.currency);
  //  Interest
  const interest = account.movements.filter((move) => move>0).map((deposit) => deposit*account.interestRate/100).filter((interest) => interest >= 1 ).reduce((acc, interest) =>acc + interest,0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
}

/////////////////////////////////////////////////////////////////////
// Balance
/////////////////////////////////////////////////////////////////////

function displayBalance(account){
  account.balance = account.movements.reduce((acc, move) => acc + move,0);

  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
}
/////////////////////////////////////////////////////////////////////
// Transfer
/////////////////////////////////////////////////////////////////////

btnTransfer.addEventListener("click",function (e){
  e.preventDefault();

  const reciverAccount = accounts.find((account) => account.username === inputTransferTo.value
  );

  const amount = Number(inputTransferAmount.value);

  // Clear fields
  inputTransferTo.value = inputTransferAmount.value ="";
  inputTransferAmount.blur();
  if(
    amount > 0 && currentAccount.username !== reciverAccount.username && reciverAccount
  ){
    setTimeout(() =>{

    
    // Transfer money
    currentAccount.movements.push(-amount);
    reciverAccount.movements.push(amount);
    //Add current date and time
    currentAccount.movementsDates.push(new Date().toISOString());
    reciverAccount.movementsDates.push(new Date().toISOString());
    //Update UI
    updateUI(currentAccount);
    // Show message
    labelWelcome.textContent = "Transaction successful!";
  },3000);
  //log out timer
  if (timer) clearInterval(timer);
  timer = logOut();
} else {
  setTimeout(() => {
    labelWelcome.textContent = "Transaction failed!"
  }, 3000);

  //log out timer
  if (timer) clearInterval(timer);
  timer = logOut();
}
});

/////////////////////////////////////////////////////////////////////
// Loan
/////////////////////////////////////////////////////////////////////

btnLoan.addEventListener("click", function (e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  console.log(amount);
  
  if(
    amount > 0 && currentAccount.movements.some((move) => move >= amount*0.1) 
  ){
    setTimeout(() => {

    
// add positive movement into current account
    currentAccount.movements.push(amount);
    //Add current time
    currentAccount.movementsDates.push(new Date().toISOString());
    //Update UI
    updateUI(currentAccount);
    // Show message
    labelWelcome.textContent = "Loan successful!";
    }, 3000);

    //log out timer
  if (timer) clearInterval(timer);
  timer = logOut();
  } else {
    labelWelcome.textContent = "Loan not successful!"
  }
  // Clear fields
  inputLoanAmount.value ="";
  inputTransferAmount.blur();
});

/////////////////////////////////////////////////////////////////////
// Close account
/////////////////////////////////////////////////////////////////////

btnClose.addEventListener("click", function (e){
  e.preventDefault();
  if(
    currentAccount.username === inputCloseUsername.value && currentAccount.password === Number(inputClosePassword.value)){
      const index = accounts.findIndex((account) => account.username === currentAccount.username);

      setTimeout(() =>{
      // delete
      accounts.splice(index,1);
      // hide ui
      containerApp.style.opacity = 0;
      // sms
      labelWelcome.textContent = "account deleted";
    }, 3000);

    //log out timer
  if (timer) clearInterval(timer);
  timer = logOut();
    } else{
      setTimeout(() => {
      labelWelcome.textContent = "delete can not be done";
    },3000);

    //log out timer
  if (timer) clearInterval(timer);
  timer = logOut();
  }
  // clear fields
  inputCloseUsername.value = inputClosePassword.value = "";
  inputClosePassword.blur();
});
///////////////////////////////////////////////////////////////////
// sort
////////////////////////////////////////////////////////////////
let sortedMove = false;
btnSort.addEventListener("click", function(e){
  e.preventDefault();
  displayMovements(currentAccount, !sortedMove);
  sortedMove = !sortedMove;
})

/////////////////////////////////////////////////////////////
// Timer
/////////////////////////////////////////////////////////////

function logOut(){
  labelTimer.textContent = "";
  let time = 120;

  const clock = () => {
    const min = String(Math.trunc(time/60)).padStart(2,0);
    const sec = String(time%60).padStart(2,0);

    labelTimer.textContent = `${min}:${sec}`;

    if(time === 0){
      clearInterval(timer);
      labelWelcome.textContent = "You've been logged out!";
      containerApp.style.opacity = 0;
    }
    time--;
  }
  clock();

  timer = setInterval(clock, 1000);

  return timer;
}
