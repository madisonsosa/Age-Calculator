//inputs
const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");

//mensajes de error
const dayError = document.getElementById("day-error");
const monthError = document.getElementById("month-error");
const yearError = document.getElementById("year-error");

//resultados
const yearsResult = document.getElementById("years");
const monthsResult = document.getElementById("months");
const daysResult = document.getElementById("days");

//boton
const btn = document.getElementById("btn");

//funcion agregada----limite de caracteres y bloqueo de letras
dayInput.maxLength = 2;
monthInput.maxLength = 2;
yearInput.maxLength = 4;

[dayInput, monthInput, yearInput].forEach(input =>{
    input.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g,"");
    });
});

btn.addEventListener("click", () => {
    clearErrors();

    if (dayInput.value === "" || monthInput.value === "" || yearInput.value === "") {
        if (dayInput.value === "") setError(dayInput, dayError, "This field is required");
        if (monthInput.value === "") setError(monthInput, monthError, "This field is required");
        if (yearInput.value === "") setError(yearInput, yearError, "This field is required");
        resetResults();
        return;
    }

    const d = parseInt(dayInput.value);
    const m = parseInt(monthInput.value);
    const y = parseInt(yearInput.value);

    let valid = true;
    const currentYear = new Date().getFullYear();

    //validar año
    if (!y) {
        setError(yearInput, yearError, "This field is required");
        valid = false;
    } else if (y > currentYear) {
        setError(yearInput, yearError, "Must be in the past");
        valid = false;
    }

    //validar mes
    if (!m) {
        setError(monthInput, monthError, "This field is required");
        valid = false;
    } else if (m < 1 || m > 12) {
        setError(monthInput, monthError, "Must be a valid month");
        valid = false;
    }

    //validar dia
    if (!d) {
        setError(dayInput, dayError, "This field is required");
        valid = false;
    } else if (d < 1 || d > 31) {
        setError(dayInput, dayError, "Must be a valid day");
        valid = false;
    }


    //validar fecha real
    if (valid && !isRealDate(y, m, d)) {
        setError(dayInput, dayError, "Must be a valid date");
        valid = false;
    }

    if (!valid) {
        resetResults();
        return;
    }

    calculateAge(y, m, d);
});

//-----------funciones-------------------
function setError(input, errorLabel, message) {
    input.classList.add("error");
    errorLabel.textContent = message;
}

function clearErrors(){
    [dayInput, monthInput, yearInput].forEach(input => {
      input.classList.remove("error");
    });

    dayError.textContent = "";
    monthError.textContent = "";
    yearError.textContent = "";
}

function resetResults() {
    yearsResult.textContent = "--";
    monthsResult.textContent = "--";
    daysResult.textContent = "--";
}

function isRealDate(year, month, day) {
    const date = new Date(year, month -1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() === month -1 &&
        date.getDate() === day 
    );
}

//-----------Calcular edad-----------------

function calculateAge(y, m, d) {
    const today = new Date();
    const birth = new Date(y, m - 1, d);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0){
        months--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0){
        years--;
        months += 12;
    }

    //Animacion de los resultados
    animateValue("years", 0, years, 800);
    animateValue("months", 0, months, 800);
    animateValue("days", 0, days, 800);
}

//--------------Funcion de animacion--------------
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    const range = end - start;
    let current = start;
    const increment = range / (duration / 30);

    const timer = setInterval(() => {
        current += increment;
        if((increment > 0 && current >= end) || (increment < 0 && current <=  end)){
            current = end;
            clearInterval(timer);
        }
        obj.textContent = Math.floor(current);
    }, 30);
}