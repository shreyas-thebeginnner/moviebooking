
document.addEventListener('DOMContentLoaded', function () {
    // Your JavaScript code here
//     setGenere();
//     getMovies(apiUrl);

const API_KEY = 'api_key=de85f5b1c7b06cf304a5e3b34e6308a5';
const Base_Url = 'https://api.themoviedb.org/3';
const apiUrl = Base_Url + '/movie/now_playing?' + API_KEY;
const IMG_Url = 'https://image.tmdb.org/t/p/w500';
const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ];
 
  
    // Retrieve movie name and price from local storage
  


if (window.location.pathname.includes("index.html")) {
var selectedGenre=[];
setGenre();
  function setGenre(){
  const tagsEl=document.getElementById('tags');
 
      tagsEl.innerHTML='';
      genres.forEach(genre =>{
          const t=document.createElement('div');
          t.classList.add('tag');
          t.id=genre.id;
          t.innerText=genre.name;
          t.addEventListener('click',()=>{
                if(selectedGenre.length==0){
                  selectedGenre.push(genre.id);
                }
                else{
                  if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id,idx)=>{
                      if(id==genre.id){
                        selectedGenre.splice(idx,1);
                      }
                    });
                  }
                  else{
                    selectedGenre.push(genre.id)
                  }
                }
                console.log(selectedGenre);
                getMovies(apiUrl+'&with_genres='+encodeURI(selectedGenre.join(',')))
          })
         
          tagsEl.append(t);
      })
  }


getMovies(apiUrl);


function getMovies(url) {
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log(data); // Data is displayed here
            showMovies(data.results);

        });
}

function showMovies(data) {
    const main = document.getElementById('main');
    main.innerHTML = '';
  
   

    data.forEach((movie) => {
        const { title, poster_path, vote_average, overview,original_language} = movie; // Destructuring here
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        const formattedVoteAverage = parseFloat(vote_average).toFixed(1);

        movieEl.innerHTML = `
        <img src="${IMG_Url + poster_path}" alt="${title}" >
      <div class="movie-info">
          <h3>${title}</h3>
          <div class="language">
          <p>Language:${original_language}</p>
          </div>

          <span >${formattedVoteAverage}</span>
      </div>
      <div class="overview">
          <h3>Description</h3>
          ${overview}
      </div>
    `;
       
        main.appendChild(movieEl);
        movieEl.querySelector('img').addEventListener('click', () => {
          displayMovieDetails(movie);
      });
        
    });
}

function getGenreNames(genreIds) {
  const genreNames = genreIds.map((genreId) => {
      const genre = genres.find((genre) => genre.id === genreId);
      return genre ? genre.name : '';
  });
  return genreNames.join(', ');
}


function displayMovieDetails(movie) {
  const modal = document.getElementById('movieModal');
  const modalTitle = document.getElementById('modal-title');
  const modalRating = document.getElementById('modal-rating');
  const modalLanguage = document.getElementById('modal-language');
  const modalOverview = document.getElementById('modal-overview');
  const modalPoster = document.getElementById('modal-poster');
  const modalGenre=document.getElementById('modal-genre');
  const modalPrice=document.getElementById('modal-price');

  const randomPrice = Math.floor(Math.random() * (300 - 250 + 1)) + 250;
  const modalMovieName = movie.title; 
  const modalPriceValue = randomPrice;
  const convenienceFee = (randomPrice * 0.0175).toFixed(2);
  const totalPrice = (parseFloat(randomPrice) + parseFloat(convenienceFee)).toFixed(2);

  
  localStorage.setItem('selectedMovieName', modalMovieName);
  localStorage.setItem('selectedMoviePrice', modalPriceValue);
  localStorage.setItem('fee',convenienceFee);

  const bookTicketButton = document.getElementById('book-ticket');
  bookTicketButton.addEventListener('click', () => {
      // Redirect to checkout page
      window.location.href = 'checkout.html';
  }); 



  modalTitle.textContent = movie.title;
  modalRating.textContent = movie.vote_average;
  modalLanguage.textContent = movie.original_language;
  modalOverview.textContent = movie.overview;
  modalPoster.src = IMG_Url + movie.poster_path;
  const genreNames = getGenreNames(movie.genre_ids);
  modalGenre.textContent = genreNames;
  modalPrice.textContent = `${randomPrice}`;
  modalPoster.style.height = '400px'; 
  modalPoster.style.width = '300px';
  


  // Display the modal
  modal.style.display = 'block';

  const modalClose = document.getElementById('modal-close');
  modalClose.addEventListener('click', () => {
      const modal = document.getElementById('movieModal');
      modal.style.display = 'none';
  });
 
}




// --------------------------search functionality-------------------------------//
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('button');

let timeoutId; // Variable to store the timeout ID for debounce

// Add event listener to the search button
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== '') {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            const searchUrl = Base_Url + '/search/movie?' + API_KEY + '&query=' + searchTerm;
            getMovies(searchUrl);
        }, 300);
    }
});

}
        
  // Retrieve movie name and price from local storage
  const movieName = localStorage.getItem('selectedMovieName');
  const moviePrice = localStorage.getItem('selectedMoviePrice');
  const Conciencefee=localStorage.getItem('fee');
 

  // Display movie name and price in the checkout page
  const movieNameElement = document.getElementById('movieName');
  if (movieNameElement) {
      movieNameElement.textContent = movieName;
  }
  const moviePriceElement=document.getElementById('ticketPrice');
  if(moviePriceElement){
      moviePriceElement.textContent=moviePrice;
  }
  const conveinceFeee=document.getElementById('discount');
  if(conveinceFeee){
      conveinceFeee.textContent=Conciencefee;
  }


  const moviePrice1 = parseFloat(localStorage.getItem('selectedMoviePrice'));
  const convenienceFee = parseFloat(localStorage.getItem('fee'));

  // Get references to the relevant HTML elements
  const ticketQuantityInput = document.getElementById('ticketQuantity');
  const subtotalElement = document.getElementById('subtotal');

  // Initialize the ticket quantity input value and subtotal
  ticketQuantityInput.value = 1;
  updateSubtotal();

  // Attach an event listener to the ticket quantity input
  ticketQuantityInput.addEventListener('input', updateSubtotal);

  // Function to update the subtotal
  function updateSubtotal() {
      const quantity = parseInt(ticketQuantityInput.value);

      // Calculate the subtotal based on the quantity
      const subtotal = (moviePrice1 + convenienceFee) * quantity;

      // Display the subtotal
      if (subtotalElement) {
          subtotalElement.textContent = '$' + subtotal.toFixed(2);
      }
  }
  // JavaScript to show/hide card details based on payment method
  const paymentForm = document.getElementById('paymentForm');
  const cardDetails = document.querySelectorAll('.card-details');
  const creditCardRadio = document.getElementById('creditCard');
  const debitCardRadio = document.getElementById('debitCard');
  
  paymentForm.addEventListener('change', function () {
      if (creditCardRadio.checked) {
          showCardDetails('creditCardDetails');
          hideCardDetails('debitCardDetails');
      } else if (debitCardRadio.checked) {
          showCardDetails('debitCardDetails');
          hideCardDetails('creditCardDetails');
      }
  });

  function showCardDetails(cardId) {
      const cardDetail = document.getElementById(cardId);
      cardDetail.style.display = 'block';
  }

  function hideCardDetails(cardId) {
      const cardDetail = document.getElementById(cardId);
      cardDetail.style.display = 'none';
  }

   

});



  