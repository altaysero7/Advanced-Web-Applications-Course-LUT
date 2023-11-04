// Referencing intro to web programming source codes in the lecture notes

window.onload = createWikiItems;

selectedDogBreeds = ["husky", "rottweiler", "bulldog", "terrier", "poodle"];

function createWikiItems() {
    selectedDogBreeds.forEach(async breed => {
        const [imgSrc, textSrc] = await fetchData(breed)

        const container = document.createElement('div');
        container.className = 'container';
        document.querySelector("body").appendChild(container);

        const wikiItem = document.createElement('div');
        wikiItem.className = 'wiki-item';
        container.appendChild(wikiItem);

        const wikiHeader = document.createElement('h1');
        wikiHeader.className = 'wiki-header';
        wikiHeader.innerText = `Breed ${breed[0].toUpperCase() + breed.slice(1)}`;
        wikiItem.appendChild(wikiHeader);

        const wikiContent = document.createElement('div');
        wikiContent.className = 'wiki-content';
        wikiItem.appendChild(wikiContent);

        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';
        wikiContent.appendChild(imgContainer);

        const wikiImg = document.createElement('img');
        wikiImg.className = 'wiki-img';
        wikiImg.src = imgSrc;
        wikiImg.alt = `random ${breed} image`
        imgContainer.appendChild(wikiImg);

        const wikiText = document.createElement('p');
        wikiText.className = 'wiki-text';
        wikiText.innerText = textSrc;
        wikiContent.appendChild(wikiText);
    });

}

async function fetchData(breedName) {
    const urlDogImage = "https://dog.ceo/api/breed/"+breedName+"/images/random";
    const urlDogText = "https://en.wikipedia.org/api/rest_v1/page/summary/"+breedName+"?redirect=false";

    try {
        const [dogImageData, dogTextData] = await Promise.all([
            fetch(urlDogImage).then(res => res.json()),
            fetch(urlDogText).then(res => res.json()),
        ]);
        if (dogImageData.status !== "success") {
            console.log("Error status!")
            return
        }
        return [dogImageData.message, dogTextData.extract];

    } catch (error) {
        console.log("Error happened while fetching: ", error);
    }
}
