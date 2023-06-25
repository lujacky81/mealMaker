import requests
import json
from pprint import pprint


# Dictionary Schema: "ingredient name as string" : [list of recipes that use this ingredient]

# Get a list of all recipes using the endpoint for each first letter.
    # for each endpoint:
        # take each recipe and go through all it's ingredients
        # for each ingredient add the recipe name to it's list in the dictionary.

# Convert the dictionary to JSON file to be used by index.js.
# https://www.geeksforgeeks.org/how-to-convert-python-dictionary-to-json/

INGREDIENTS = {}

def getIngredients():
    url="https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    response = requests.get(url=url)
    data = response.json()
    ingredientList = data['meals']
    for entry in ingredientList:
        INGREDIENTS[entry['strIngredient'].lower()] = []
    return


def main():
    getIngredients()
    url = "https://themealdb.com/api/json/v1/1/search.php?f=a"
    endpoints = "abcdefghijklmnopqrstuvwxyz"

    for letter in endpoints:
        url = url[:-1] + letter
        #print(url)
        response = requests.get(url=url)
        data = response.json()
        recipeList = data['meals']
        if recipeList is not None:
            addToDict(recipeList)

    with open("ingredients.json", "w") as outfile:
        json.dump(INGREDIENTS, outfile)
    
    
    print(len(INGREDIENTS))

    return

def addToDict(meals):
    filtered = list(filter(lambda item: item is not None, meals))
    for meal in filtered:
        #for each meal
        base = "strIngredient"
        #name = meal['strMeal']
        name = meal['idMeal']
        #print(f'RECIPE NAME: {name}')
        for i in range(1, 21):
            ingredient = base + str(i)
            #print(f'strIngredient: {ingredient}')
            #print(meal[ingredient])
            if meal[ingredient]:
                #print(f'CURRENT INGREDIENT: {meal[ingredient]}')
                if meal[ingredient].lower() in INGREDIENTS:
                    INGREDIENTS[meal[ingredient].lower()].append(name)
                else:
                    INGREDIENTS[meal[ingredient].lower()] = []
                    INGREDIENTS[meal[ingredient].lower()].append(name)
                
    return


if __name__ == '__main__':
    main()