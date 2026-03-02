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
  const bookingUrl = `https://granada-go-tours-booking.apps.darideveloper.com/${tourId}`
  iframeElem.setAttribute("src", bookingUrl)

  // Fetch API Data
  const [tourData, randomTours] = await Promise.all([
    getTourData(tourId),
    getRandomTours(),
  ])

  console.log({ tourData, randomTours })

  // Update UI Content
  // ----- Hero -----
  const h1Elem = document.querySelector("#hero h1")
  const subtitleElem = document.querySelector("#hero .title p")
  const focusElem = document.querySelector("#hero .focus p")
  h1Elem.innerHTML = tourData.title
  subtitleElem.innerHTML = tourData.subtitle
  focusElem.innerHTML = tourData.focus

  // ----- Summary -----
  const durationElem = document.querySelector("#summary .duration > div > div")
  const langElem = document.querySelector("#summary .languages")
  const priceElem = document.querySelector("#summary .price p")
  durationElem.innerHTML = tourData.duration
  langElem.innerHTML = tourData.languages.map(lang => `<p>${lang}</p>`).join('')
  priceElem.innerHTML = "€ " + tourData.price

  // ----- Location -----
  const locationButtonElm = document.querySelector("#location a")
  const meetingPointElem = document.querySelector("#location p")
  locationButtonElm.setAttribute("href", tourData.location_map)
  meetingPointElem.innerHTML = tourData.meeting_point

  // ----- Discoveries -----
  const dicoveriesIds = [0, 1, 2]
  dicoveriesIds.forEach((discoverIndex) => {
    const baseSelector = `#discoveries .grid-container > div:nth-child(${discoverIndex + 1})`
    const discoveriesCardTitle = document.querySelector(`${baseSelector} h3`)
    const discoveriesCardDescription = document.querySelector(`${baseSelector} p`)
    discoveriesCardTitle.innerHTML = tourData.discoveries[discoverIndex].title
    discoveriesCardDescription.innerHTML = tourData.discoveries[discoverIndex].description
  })
}