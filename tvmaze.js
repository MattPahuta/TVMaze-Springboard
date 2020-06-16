/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api. 
  // Remove the hard coded array from the searchShows function and replace the code with an AJAX request to the search shows api from TVMaze. Make sure that the array of information you return from the function is formatted as described in the comments for the searchShows function.
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`); // use the await keyword within async function
  console.log(res)
  let shows = res.data.map(result => {
    let show = result.show;
    const defaultImage = 'imgs/default-img.png';
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : defaultImage
    };
  });

  return shows;
  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary: "<p><b>The Bletchley Circle</b> follows the journey of four ordinary women with extraordinary skills that helped to end World War II.</p><p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their normal lives, modestly setting aside the part they played in producing crucial intelligence, which helped the Allies to victory and shortened the war. When Susan discovers a hidden code behind an unsolved murder she is met by skepticism from the police. She quickly realises she can only begin to crack the murders and bring the culprit to justice with her former friends.</p>",
  //     image: "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ]
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 show" data-show-id="${show.id}"> 
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image}"/>
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button type="button" class="btn btn-primary mt-2 get-episodes" data-toggle="modal" data-target="#episodeModal">Get Episodes</button>
           </div>
         </div>
       </div>
      `); // data-show-id 

    $showsList.append($item); // append $item variable to DOM ID#showsList
  }
}
/*
Old non-modal button:
<button class="btn btn-primary get-episodes">Episodes</button>
*/

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  // $("#episodes-area").hide(); // not needed for modal version of episodes section

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`); // use aswait keyword in async function
  let episodes = res.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));
  // TODO: return array-of-episode-info, as described in docstring above
  return episodes;
}

function populateEpisodes (episodes) { // pass in the array of episodes provided by the click handler
  const $episodesList = $('#episodes-list');
  $episodesList.empty(); // clear the episodes from the ul to avoid stacking results

  // loop over episodes and populate LI's 
  for (let episode of episodes) {
    let $listItem = $( // each episode gets assigned to $listItem let variable
      `<li>${episode.name}
      (season ${episode.season}, episode ${episode.number}) </li>`
    );

    $episodesList.append($listItem);
  }
  // Non-modal episodes area:
  // $('#episodes-area').show(); // use jquery .show() to reveal the #episodes-area <section>
}

// Use click handler to retrieve the right episode id, using jQuery
$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(e) {
  let showId = $(e.target).closest(".show").data("show-id"); // target the closest element to e.target that has .show class and include .data attribute
  let episodes = await getEpisodes(showId); // await the getEpisodes function with showID passed in as argument
  populateEpisodes(episodes); // invoke the populateEpisodes function and pass in the array of episodes
});
