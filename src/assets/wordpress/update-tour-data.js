// --- Configuration & Extraction ---
const currentPath = window.location.pathname
const segments = currentPath.split("/").filter((segment) => segment.length > 0)
const [page, tourId] = segments

// --- Primary Logic Execution ---
if (page === "tours") {
  // Show a spinner to avoid render errors and visual blinks
  renderSpinner()

  // Attach the update function to the window load event
  window.addEventListener("load", updateTourData)
}

/**
 * Fetches tour data and updates the DOM elements.
 */
async function updateTourData() {
  // Update Booking Iframe
  const iframeElem = document.querySelector(".custom-iframe-container iframe")
  const bookingUrl = `${apiBase}/${tourId}`
  iframeElem.setAttribute("src", bookingUrl)

  // Fetch API Data
  const [tourData, randomTours] = await Promise.all([
    getTourData(tourId),
    getRandomTours(),
  ])

  console.log({ tourData, randomTours })

  // Update UI Content

  // ----- Hero -----
  const heroElem = document.querySelector("#hero")
  const titleElem = document.querySelector("#hero h1")
  const subtitleElem = document.querySelector("#hero .title p")
  const focusElem = document.querySelector("#hero .focus p")
  const bannerSrc = `${apiBase}/tours/banners/${tourData.id}.webp`
  console.log({ bannerSrc })

  // Update hero bg
  const redGradient = 'linear-gradient(180deg, rgba(176, 58, 46, 0) 29%, rgba(176, 58, 46, 1) 100%)'
  const darkOverlay = 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))'
  heroElem.style.backgroundImage = `${redGradient}, ${darkOverlay}, url('${bannerSrc}')`

  // Update hero texts
  titleElem.innerHTML = tourData.title
  subtitleElem.innerHTML = tourData.subtitle
  focusElem.innerHTML = tourData.focus

  // ----- Summary -----
  const durationElem = document.querySelector("#summary .duration p")
  const langElem = document.querySelector("#summary .languages p")
  const priceElem = document.querySelector("#summary .price p")
  const introElem = document.querySelector("#summary .intro")
  durationElem.innerHTML = tourData.duration
  langElem.innerHTML = tourData.languages.map(lang => `<p>${lang}</p>`).join('')
  priceElem.innerHTML = "€ " + tourData.price
  introElem.innerHTML = tourData.introduction

  // ----- Location -----
  const mapLinkElem = document.querySelector("#location a")
  const pointElem = document.querySelector("#location p")
  const mapIframeElem = document.querySelector("#location iframe")
  mapLinkElem.setAttribute("href", tourData.location_map)
  pointElem.innerHTML = tourData.meeting_point
  mapIframeElem.setAttribute("src", tourData.google_maps_iframe)

  // ----- Discoveries -----
  tourData.discoveries.forEach((discoverData, index) => {
    // We use the index from forEach to target the correct DOM element
    const baseSelector = `#discoveries .grid-container > div:nth-child(${index + 1})`

    const titleElem = document.querySelector(`${baseSelector} h3`)
    const descElem = document.querySelector(`${baseSelector} p`)
    const imageElem = document.querySelector(`${baseSelector} img`)

    // Update text content
    titleElem.innerHTML = discoverData.title
    descElem.innerHTML = discoverData.description

    // Handle image updates
    const imgSrc = `${apiBase}/tours/discover/${tourData.id}-${discoverData.id}.jpg`
    imageElem.src = imgSrc
    imageElem.setAttribute("data-src", imgSrc)
    imageElem.setAttribute("data-srcset", imgSrc)
    imageElem.setAttribute("srcset", imgSrc)
  })

  // ----- Items -----
  const includedElem = document.querySelector("#items .included .checks p")
  const notIncludedElem = document.querySelector("#items .no-included .checks p")
  const disclaimerElem = document.querySelector("#items .disclaimer p span")
  includedElem.innerHTML = tourData.included.map(item => `✅ ${item}`).join('<br>')
  notIncludedElem.innerHTML = tourData.not_included.map(item => `❌ ${item}`).join('<br>')
  disclaimerElem.innerHTML = tourData.disclaimer

  // ----- Related Tours -----
  randomTours.forEach((tour, index) => {
    // Use index + 1 for the CSS nth-child selector (which is 1-based)
    const baseSelector = `#related-tours > div > div:nth-child(${index + 1})`

    const relatedTitleElem = document.querySelector(`${baseSelector} .header h3 span`)
    const relatedFocusElem = document.querySelector(`${baseSelector} .header p`)
    const relatedPriceElem = document.querySelector(`${baseSelector} .price p`)
    const relatedTimeElem = document.querySelector(`${baseSelector} .time p`)
    const relatedButtonElem = document.querySelector(`${baseSelector} a`)
    const relatedImage = document.querySelector(`${baseSelector} img`)

    // Update text and attributes using the 'tour' object from the loop
    relatedTitleElem.innerHTML = tour.title
    relatedFocusElem.innerHTML = tour.focus
    relatedPriceElem.innerHTML = `${tour.price} / grupo`
    relatedTimeElem.innerHTML = `${tour.duration} hrs`
    relatedButtonElem.setAttribute("href", `${toursBase}/${tour.id}/`)

    // Handle image updates
    const imgSrc = `${apiBase}/tours/banners/${tour.id}.webp`
    relatedImage.src = imgSrc
    relatedImage.setAttribute("data-src", imgSrc)
    relatedImage.setAttribute("data-srcset", imgSrc)
    relatedImage.setAttribute("srcset", imgSrc)
  })

  // ----- Cancelation -----
  const cancelationElem = document.querySelector("#cancelation p")
  cancelationElem.innerHTML = tourData.cancelation

}