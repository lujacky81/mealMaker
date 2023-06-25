//Global variables:
let BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
let CURRENTMATCH = [];

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

    const response = await fetch(url);
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
    const response = await fetch(url);
    const data = await response.json();
    let meal = data.meals[0];
    console.log(meal);

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
    if (CURRENTMATCH.includes(input)) {return}

    let keys = Object.keys(INGREDIENTS);
    // console.log(keys)
    // console.log(input);
    // console.log(keys.includes(input))
    // console.log(Object.keys(INGREDIENTS).filter(element => element.includes(input)));

    if(keys.includes(input)) {
        let newMatch = keys.filter(element => element.includes(input));
        CURRENTMATCH = CURRENTMATCH.concat(newMatch);
    } else {
        let newMatch = [];
        newMatch.push(input);
        CURRENTMATCH = CURRENTMATCH.concat(newMatch);
    }
    console.log(CURRENTMATCH);

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

    renderMatch(CURRENTMATCH);

}

function renderMatch(current) {


    // For adding onclick to elements created by DOM:
    // https://stackoverflow.com/questions/9643311/pass-a-string-parameter-in-an-onclick-function
    // use for X button on matcher cards

}

function clearMatcher(){
    document.querySelectorAll('.grid__item').forEach(e => e.remove());
}

async function mealById(id){
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id;

    let response = await fetch(url);
    let data = await response.json();

    return data;

}

function removeGridItem(event) {
    element = event.target;
    parent = element.parentElement;
    let input = parent.id;
    console.log(input);


    parent.remove();
}