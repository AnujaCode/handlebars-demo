//find the delete-button in the document
const deleteBtn = document.querySelector('#delete-btn')
console.log(deleteBtn)

//find the like button in the document
const likeBtn = document.querySelector('#like-btn')

//find the like counter in the document
const likeCounter = document.querySelector('#like-counter')

//get the current restaurantID from the url
const id = window.location.pathname.split('/restaurants/')[1]

//add event to delete this restaurant
deleteBtn.addEventListener('click', async () => {
    //get id from the current url path
    const id = window.location.pathname.split('/restaurants/')[1]
    //fetch the  route from express for this id
    let res = await fetch(`/restaurants/${id}`, {
        method: 'DELETE',
    })
    console.log(res)
    window.location.assign('/restaurants')
  });

  //add an event to Like this sauce
likeBtn.addEventListener('click', async () =>{
    //get current likes from counter
    let currentLikes = parseInt(likeCounter.innerHTML)
    console.log(currentLikes)
    //Increment current likes
    currentLikes ++
    //update the likes counter
    likeCounter.innerHTML = currentLikes
    //fetch the route for this id with the PUT method
    let res = await fetch(`/restaurants/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            likes: currentLikes
        })
    })
})