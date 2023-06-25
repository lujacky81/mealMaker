//Global variables:
let BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
let CURRENTMATCH = []; // the temporary list of dishes based on the most recent input
let MATCHES = {}; // dictionary mapping input to all associated dishes
let MATCHRENDER = []; // the intersect of all of Object.values(MATCHES) that are to be rendered. 

//Functions called one time when page loads:
randomCard();
//

async function search(event){
    event.preventDefault();

    let input = document.querySelector(".searchbar__input").value.trim().toLowerCase();
    if (input.length <= 0) {return}
    console.log(input);

    let url = BASE_URL;
    if (input.length === 1){
        url = url + "search.php?f=" + input;
    } else {
        url = url + "search.php?s=" + input;
    }

    const response = await fetch(url, {mode: 'cors'});
    const data = await response.json();
    let meals = data.meals;
    if (meals === null) {return}

    const searchResults = document.querySelector(".searchresults");
    clearResults();

    meals.forEach((meal) => {
        let card = document.createElement("div");
        card.classList += " card";
        
        let cardImg = document.createElement("img");
        cardImg.classList += " card__img";
        cardImg.setAttribute("src", meal.strMealThumb);

        let cardInfo = document.createElement("div");

        let cardTitle = document.createElement("p");
        cardTitle.classList += " card__title";
        cardTitle.innerHTML = meal.strMeal;

        let cardDesc = document.createElement("ul");
        cardDesc.classList += " card__desc";

        searchResults.appendChild(card);
        card.appendChild(cardImg);
        card.appendChild(cardInfo);
        cardInfo.appendChild(cardTitle);
        cardInfo.appendChild(cardDesc);

        for (let i=1; i<=20; i++){
            let ingredient = "strIngredient" + i.toString();
            let measure = "strMeasure" + i.toString();
            
            if (meal[ingredient] === null) {break}

            if (meal[ingredient].trim().length <= 0) {
                break;
            } else{
                let listItem = document.createElement("li");
                listItem.classList += " card__ingredient";
                listItem.innerHTML = meal[ingredient] + " | " + meal[measure];
                cardDesc.appendChild(listItem);
            }
        }
        

    });

    document.querySelector(".search__title--text").innerHTML = "Search Results:";
}

function clearResults(){
    document.querySelectorAll('.card').forEach(e => e.remove());

    // let searchResults = document.querySelector(".searchresults");
    // //console.log(searchResults.childNOdes);
    // while(searchResults.childNodes.length > 2){
    //     searchResults.removeChild(searchResults.lastChild)
    // }
}

async function randomCard(){
    clearResults();
    const url = "https://www.themealdb.com/api/json/v1/1/random.php";
    const response = await fetch(url, {mode: 'cors'});
    const data = await response.json();
    let meal = data["meals"][0];
    //console.log(meal);

    const searchResults = document.querySelector(".searchresults");

    let card = document.createElement("div");
    card.classList += " card";
    
    let cardImg = document.createElement("img");
    cardImg.classList += " card__img";
    cardImg.setAttribute("src", meal.strMealThumb);

    let cardInfo = document.createElement("div");

    let cardTitle = document.createElement("p");
    cardTitle.classList += " card__title";
    cardTitle.innerHTML = meal.strMeal;

    let cardDesc = document.createElement("ul");
    cardDesc.classList += "card__desc";

    searchResults.appendChild(card);
    card.appendChild(cardImg);
    card.appendChild(cardInfo);
    cardInfo.appendChild(cardTitle);
    cardInfo.appendChild(cardDesc);

    for (let i=1; i<=20; i++){
        let ingredient = "strIngredient" + i.toString();
        let measure = "strMeasure" + i.toString();
        
        if (meal[ingredient] === null) {break}

        if (meal[ingredient].trim().length <= 0) {
            break;
        } else{
            let listItem = document.createElement("li");
            listItem.classList += " card__ingredient";
            listItem.innerHTML = meal[ingredient] + " | " + meal[measure];
            cardDesc.appendChild(listItem);
        }
    }
    document.querySelector(".search__title--text").innerHTML = "Random Result:";
}

function match(event) {
    event.preventDefault();

    let input = document.querySelector(".matcher__input").value.trim().toLowerCase();
    document.querySelector(".matcher__input").value = "";
    if (input.length <= 0) {return}
    if (Object.keys(MATCHES).includes(input)) {return}

    let keys = Object.keys(INGREDIENTS);
    CURRENTMATCH = [];

    if(keys.includes(input)) {
        let newMatch = keys.filter(element => element.includes(input));
        CURRENTMATCH = newMatch;
        //CURRENTMATCH = CURRENTMATCH.concat(newMatch);
    } 
    console.log(CURRENTMATCH);

    updateMatches(input);

    let gridItem = document.createElement("div");
    gridItem.classList += " grid__item";
    gridItem.setAttribute("id", input);

    let gridImg = document.createElement("img");
    gridImg.classList += " grid__item--icon";
    gridImg.setAttribute("src", "./assets/xmark-solid.svg");
    gridImg.addEventListener('click', removeGridItem);
    

    let gridPara = document.createElement("p");
    gridPara.classList += " grid__item--text";
    gridPara.innerHTML = input;

    let grid = document.querySelector(".grid");
    grid.appendChild(gridItem);
    gridItem.appendChild(gridImg);
    gridItem.appendChild(gridPara);

    renderMatch();

}

function updateMatches(input){ // consolidate CURRENTMATCH to 1 key word from input
    let mealSet = new Set();
    CURRENTMATCH.forEach((i) => {
        let temp = INGREDIENTS[i]
        temp.forEach((id) => {
            mealSet.add(id);
        });
    });
    let mealList = Array.from(mealSet);
    MATCHES[input] = mealList;
    console.log(MATCHES);

}

async function renderMatch() {
    clearMatchResults();
    let meals = [];
    let start;
    let currentValues = Object.values(MATCHES);
    console.log(currentValues);
    // Find intersection of all MATCHES.values
    for (let i = 0; i < currentValues.length; i++){
        if (currentValues[i].length > 0) {
            meals = currentValues[i];
            start = i+1;
            break;
        } 
    }
    if (meals.length <= 0) {return}
    //console.log(meals);
    for (let j = start; j < currentValues.length; j++) {
        if(currentValues[j].length <= 0) {continue}
        meals = meals.filter(v => currentValues[j].includes(v));
    }
    //console.log(meals);
    // Render all elements remaining in the intersection
    meals.forEach(async (m) => {
        let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + m;

        let response = await fetch(url, {mode: 'cors'});
        let data = await response.json();
        let meal = data.meals[0];
        //console.log(meal);
        let name = meal.strMeal;
        let src = meal.strMealThumb;

        let grid = document.querySelector(".grid__match");

        let matchResult = document.createElement("div");
        matchResult.classList += " match__result";

        let matchImg = document.createElement("img");
        matchImg.classList += "grid__item--icon";
        matchImg.setAttribute("src", src);

        let matchPara = document.createElement("p");
        matchPara.classList += " grid__item--text";
        matchPara.innerHTML = name;

        matchResult.appendChild(matchImg);
        matchResult.appendChild(matchPara);
        grid.appendChild(matchResult);

    });

}

function clearMatcher(){
    document.querySelectorAll('.grid__item').forEach(e => e.remove());
}

function clearMatchResults(){
    document.querySelectorAll('.match__result').forEach(e => e.remove());
}

function removeGridItem(event) {
    element = event.target;
    parent = element.parentElement;
    let input = parent.id;

    delete MATCHES[input];
    parent.remove();
    console.log(MATCHES);
    renderMatch();
    
}