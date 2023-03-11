const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password = "";
let passwordLength = 10;
let checkCount = 0;

// grey color in circule
setIndicator("#ccc");

handleSlider();
//set passwordLength
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerHTML = passwordLength;
  //or kuch krana chahiye kya

  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //shadow _HW
}

function getRndIntger(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndIntger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndIntger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndIntger(65, 90));
}

function generateSymbols() {
  const ranNum = getRndIntger(0, symbols.length);
  return symbols.charAt(ranNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  //to make copy wala span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkbox++;
  });

  //special condition

  if (passwordLength < checkCount) passwordLength = checkCount;
  handleSlider();
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

function shufflePassword(array) {
  //fisher yates Method

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

generateBtn.addEventListener("click", () => {
  //none of the checkbox are selected
  if ((checkCount = 0)) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //lets start the journey new passwod

  //remove old password
  password = "";

  //lets put the stuff mentions by checkbox

  // if (upperCaseCheck.checked) {
  //   password += generateUpperCase();
  // }
  // if (lowerCaseCheck.checked) {
  //   password += generateLowerCase();
  // }
  // if (numberCheck.checked) {
  //   password += generateRandomNumber();
  // }
  // if (symbolsCheck.checked) {
  //   password += generateSymbols();
  // }

  let funAree = [];
  if (uppercaseCheck.checked) funAree.push(generateUpperCase);

  if (lowercaseCheck.checked) funAree.push(generateLowerCase);

  if (numbersCheck.checked) funAree.push(generateRandomNumber);

  if (symbolsCheck.checked) funAree.push(generateSymbols);

  //compulsory addtions

  for (let i = 0; i < funAree.length; i++) {
    password += funAree[i]();
  }

  //remaning addtions

  for (let i = 0; i < passwordLength - funAree.length; i++) {
    let randIndex = getRndIntger(0, funAree.length);

    password += funAree[randIndex]();
  }

  //shuffle the password
  password = shufflePassword(Array.from(password));

  //show in ui
  passwordDisplay.value = password;

  console.log(password);
  //calculate sterength
  calcStrength();
});
