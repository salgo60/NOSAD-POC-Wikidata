const SITE_URL = 'https://salgo60.github.io/NOSAD/';
const IMG_WIDTH = '320';
const IMG_HEIGHT = '200';
const NUM_RESULTS = 20;
const USER_AGENT = 'View-it! [In Development] (https://view-it.toolforge.org/)';
const ORIGIN = '*';

function isInt(value) {
  return !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10));
}

function searchFromTextbox() {
  qNum = document.getElementById('qNumberInput').value;
  window.location.href = SITE_URL + '?q=' + qNum;
}

function startSearch() {
  hideError();

  // Gather window and URL params
  var url = new URL(window.location.href);
  var qNum = url.searchParams.get("q");
  var returnTo = url.searchParams.get("returnTo");

  if (qNum) {
    qNum = qNum.toUpperCase();
    document.getElementById('qNumberInput').value = qNum;
    if (isInt(qNum)) {
      qNum = 'Q' + qNum;
    }
    if (qNum.substring(0, 1) === 'Q' && isInt(qNum.substring(1))) {
      generateHeader(qNum, returnTo);

      var offset = 0;
      //getImages(qNum, offset);
      getAnslagstavla(qNum, offset);
    } else {
      displayError(qNum + ' is not a valid Q-number.')
    }
  }
}

function displayError(error) {
  document.getElementById('error').style.display = 'block';
  document.getElementById('error').innerHTML = error;
}

function hideError() {
  document.getElementById('error').style.display = 'none';
}

function generateHeader(qNum, returnTo) {
  if (qNum && isInt(qNum.substring(1))) {
    document.getElementById('results').style.display = 'block';

    // Adjust results header
    var resultsHeaderLink = document.getElementById('resultsHeaderLink');
    resultsHeaderLink.href = 'https://www.wikidata.org/wiki/' + qNum;
    resultsHeaderLink.innerHTML = qNum;

    // Get Q-number details
    fetch('https://www.wikidata.org/w/api.php?action=wbgetentities&ids=' + qNum + '&props=labels&languages=sv&format=json&origin=' + ORIGIN, {
      method: 'GET',
      headers: new Headers({
        'Api-User-Agent': USER_AGENT
      })
    }).then((response) => response.json())
      .then((data) => {
        const label = data['entities']['' + qNum]['labels']['sv']['value'];
        const resultsHeader = document.getElementById('imagesDepicting');
        resultsHeader.innerHTML = 'NOSAD aktivitet/presentation/xxx om <a href="https://www.wikidata.org/wiki/' + qNum + '" target="_blank">' + qNum + '</a> (' + label + ')';
      });

    // Show "back to article" button
    if (returnTo) {
      var returnToLink = document.getElementById('returnToLink');
      returnToLink.href = returnTo;
      returnToLink.style.display = 'block';
    }
  }
}
class SPARQLQueryDispatcher {
	constructor( endpoint ) {
		this.endpoint = endpoint;
	}

	query( sparqlQuery ) {
		const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
		const headers = { 'Accept': 'application/sparql-results+json' };

		return fetch( fullUrl, { headers } ).then( body => body.json() );
	}
}
function getAnslagstavla(qNum, returnTo) {
const endpointUrl = 'https://sweopendata.wikibase.cloud/query/sparql';
const sparqlQuery = `PREFIX wb: <https://sweopendata.wikibase.cloud/entity/>
PREFIX wbt: <https://sweopendata.wikibase.cloud/prop/direct/>

SELECT ?a ?aLabel ?subjLabel WHERE {
   ?a wbt:P2 wb:Q572 .
   ?a wbt:P22 "`+ qNum +`"
   optional {?a wbt:P22 ?subj}

  BIND(URI(concat("http://www.wikidata.org/entity/",?wdQ)) AS ?wikidata_iri)
  
	SERVICE wikibase:label { bd:serviceParam wikibase:language "sv,en". }
}`;

const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
queryDispatcher.query( sparqlQuery ).then( console.log );
}


function getImages(qNum, offset) {
  // Query Commons API for image titles
  // const fetchImagesURL = new URL("https://commons.wikimedia.org/w/api.php");
  const fetchImagesURL = new URL("https://sweopendata.wikibase.cloud/w/api.php");
 
  fetchImagesURL.searchParams.append("action", "query");
  fetchImagesURL.searchParams.append("cirrusDumpResult", "true");
  fetchImagesURL.searchParams.append("format", "json");
  fetchImagesURL.searchParams.append("generator", "search");
  fetchImagesURL.searchParams.append("gsrlimit", NUM_RESULTS);
  fetchImagesURL.searchParams.append("gsrnamespace", "6");
  fetchImagesURL.searchParams.append("gsroffset", offset);
  fetchImagesURL.searchParams.append("gsrsearch", "filetype:bitmap|drawing -fileres:0 custommatch:depicts_or_linked_from=" + qNum);
  fetchImagesURL.searchParams.append("origin", ORIGIN);
  fetch(fetchImagesURL, {
    method: 'GET',
    headers: new Headers({
      'Api-User-Agent': USER_AGENT
    })
  }).then((response) => response.json())
    .then((data) => {
      // Store number of results:
      numResults = data['__main__']['result']['hits']['total'];

      // Show number of results on DOM:
      const resultsHeaderResults = document.getElementById('numResults');
      resultsHeaderResults.innerHTML = numResults.toLocaleString();

      // Check if no results
      if (numResults > 0) {
        // Built pipe-separated string of image titles
        var imageTitlesArray = [];
        returnedImages = data['__main__']['result']['hits']['hits'];
        for (var i = 0; i < returnedImages.length; i++) {
          imageTitlesArray.push('File:' + returnedImages[i]['_source']['title']);
        }
        var imageTitlesStr = imageTitlesArray.join('|').replace(/ /g, "_");

        // Fetch thumbnails
        //const fetchThumbnailsURL = new URL("https://commons.wikimedia.org/w/api.php")
        const fetchThumbnailsURL = new URL("https://sweopendata.wikibase.cloud/w/api.php")

        fetchThumbnailsURL.searchParams.append("action", "query");
        fetchThumbnailsURL.searchParams.append("format", "json");
        fetchThumbnailsURL.searchParams.append("iiprop", "url");
        fetchThumbnailsURL.searchParams.append("iiurlwidth", IMG_WIDTH);
        fetchThumbnailsURL.searchParams.append("origin", ORIGIN);
        fetchThumbnailsURL.searchParams.append("prop", "imageinfo");
        fetchThumbnailsURL.searchParams.append("titles", imageTitlesStr);

        fetch(fetchThumbnailsURL, {
          method: 'GET',
          headers: new Headers({
            'Api-User-Agent': 'NOSAD! [In Development] (https://github.com/salgo60/Anslagstavla)'
          })
        }).then((response) => response.json())
          .then((data) => {
            // Remove pagination button, if it exists
            const existingPaginationButton = document.getElementById('paginationButton');
            if (existingPaginationButton) {
              existingPaginationButton.remove();
            }

            // Output images
            const resultsElement = document.getElementById('results');
            resultsElement.style.display = 'block';

            var pages = data['query']['pages'];
            var images = [];
            for (const image in pages) {
              images.push({
                'name': pages[image]['title'].replace('File:', ''),
                'thumb': pages[image]['imageinfo']['0']['thumburl'],
                'width': pages[image]['imageinfo']['0']['thumbwidth'],
                'height': pages[image]['imageinfo']['0']['thumbheight'],
                'page': pages[image]['imageinfo']['0']['descriptionurl']
              });
            }

            // Display images on DOM
            for (var i = 0; i < images.length; i++) {
              const container = document.createElement('div');
              container.classList.add('imageContainer');
              var ratio = IMG_HEIGHT / images[i].height;
              container.style.width = (images[i].width * ratio) + 'px';

              const a = document.createElement('a');
              a.href = images[i].page;
              a.title = images[i].name;
              a.target = '_blank';

              var img = document.createElement('img');
              img.src = images[i].thumb;

              var captionBottom = document.createElement('div');
              captionBottom.classList.add('caption');
              captionBottom.classList.add('caption-bottom');
              captionBottom.innerHTML = images[i]['name'];

              a.appendChild(img);
              container.appendChild(a);
              container.appendChild(captionBottom);

              resultsElement.appendChild(container);
            }

            // Output pagination button as needed
            if (numResults > (offset + NUM_RESULTS)) {
              offset += 20;
              const paginationButton = document.createElement('button');
              paginationButton.id = 'paginationButton';
              paginationButton.addEventListener("click", function () { getImages(qNum, offset) });
              paginationButton.innerHTML = 'Load more images...';
              resultsElement.appendChild(paginationButton);
            }
          });
      }
    });
}

window.onload = startSearch;
