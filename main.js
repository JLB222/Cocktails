document.getElementById("button").addEventListener("click", getDrink)


function getDrink() {
    //capture the data input by the user
    let drink = document.getElementById("input").value
    //clear the existing array of drinks so that multiple user inputs doesn't create a massive drink list
    document.querySelector("#carousel").innerHTML = ""

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`)
    .then(res => res.json())
    .then(data => {
        console.log(data.drinks)
        //create the DIVs that'll hold the content
        data.drinks.forEach( el => {
            //create a div for the drink that'll hold all the other elements.
            let containerDiv = document.createElement("div")
                containerDiv.className = "carousel-item"
            //create an H2 for the name of the drink
            let drinkName = document.createElement("h2")
                drinkName.innerHTML = el.strDrink
            //create an image to show off the drink
            let drinkImage = document.createElement("img")
                drinkImage.src = el.strDrinkThumb
            //create a paragraph element for the drink's instructions
            let drinkInstructions = document.createElement("p")
                drinkInstructions.innerHTML = el.strInstructions

            //this API stores the ingredients in up to 15 different strings & the measurements in another 15, ugh, so we put all those into one array for ease.
            let ingredients = []
                for (let i = 1; i <= 15; i++) {
                  ingredients.push( (el[`strMeasure`+i] || "") + el[`strIngredient`+i] )  //the property names are strIngredient1 through strIngredient15, so the template literal + i allows us to go through them all. 
                }
                ingredients = ingredients.filter(el => el !== "null")  //since many of the strIngredient strings are empty, they'll return null (which will be turned into a string due to the "") and we don't want to render that to the page, so we filter nulls out
            //create an Unordered List element to hold all the ingredients
            let ingredientList = document.createElement("ul")
            
            //create a list item element for every ingredient & fill that element with the ingredient's details; then append that ingredient to the UL we made above.
            ingredients.forEach(el =>{
                let ingredient = document.createElement("li")
                ingredient.innerHTML = el
                ingredientList.append(ingredient)
            })
            //append everything we made above to the container Div
                containerDiv.append(drinkName)
                containerDiv.append(drinkImage)
                containerDiv.append(drinkInstructions)
                containerDiv.append(ingredientList)
            //append the drink's container Div to the root div, now called carousel, so it's rendered for the user
                document.querySelector("#carousel").appendChild(containerDiv)

        })
        //Creating the carousel
        const carousel = document.querySelector(".carousel");
        const prevButton = document.querySelector(".prev-button");
        const nextButton = document.querySelector(".next-button");
        let currentIndex = 0;

        function updateCarousel() {
            const items = document.querySelectorAll(".carousel-item");
            items.forEach((item, index) => {
                item.style.transform = `translateX(${-100 * currentIndex}%)`;  //Why does it have to be negative?  Positive numbers screw it up
                // item.style.transform = `translateX(${100 * (index-currentIndex)}%)`;  I kept this because I want to understand why it didn't work.
            })
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % carousel.childElementCount;  //The modulus operator is to ensure the carousel returns to the 0 index element when it reaches the end.
            console.log(currentIndex)
            updateCarousel();
        }
    
        function prevSlide() {
            currentIndex = (currentIndex - 1 + carousel.childElementCount) % carousel.childElementCount;
            updateCarousel();
        }

        nextButton.addEventListener("click", nextSlide);
        prevButton.addEventListener("click", prevSlide);
        updateCarousel()
    })
    .catch(err => {
        console.log(`${err}`)
    });
}

//toDoList
//add some viewport detection to make it work on mobile

//move the next and prev buttons

//Most of the images from this API are 700x700, but when one of them isn't, it throws off the carousel
  //"fixed" by setting a min-width property on the carousel items.

// My carousel only goes through half of the items in the array... why?
    //fixed - it has to do with the relationship between the nextSlide function and the transformation of the elements.  If an API response has 24 items in the array, the Index is reset to 0 after I click 24 times.

// i have to press next or previous twice every time I want the next item to be centered.... why?
  //I fixed it (by changing the translateX), but never got the answer to this question.