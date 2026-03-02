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
  const titleElem = document.querySelector("#hero h1")
  const subtitleElem = document.querySelector("#hero .title p")
  const focusElem = document.querySelector("#hero .focus p")
  titleElem.innerHTML = tourData.title
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
  const mapLinkElem = document.querySelector("#location a")
  const pointElem = document.querySelector("#location p")
  mapLinkElem.setAttribute("href", tourData.location_map)
  pointElem.innerHTML = tourData.meeting_point

  // ----- Discoveries -----
  const discoveryIndexes = [0, 1, 2]
  discoveryIndexes.forEach((index) => {
    const baseSelector = `#discoveries .grid-container > div:nth-child(${index + 1})`
    const titleElem = document.querySelector(`${baseSelector} h3`)
    const descElem = document.querySelector(`${baseSelector} p`)
    titleElem.innerHTML = tourData.discoveries[index].title
    descElem.innerHTML = tourData.discoveries[index].description
  })

  // ----- Items -----
  const includedElem = document.querySelector("#items .included .checks p")
  const notIncludedElem = document.querySelector("#items .no-included .checks p")
  const disclaimerElem = document.querySelector("#items .disclaimer p span")
  includedElem.innerHTML = tourData.included.map(item => `✅ ${item}`).join('<br>')
  notIncludedElem.innerHTML = tourData.not_included.map(item => `❌ ${item}`).join('<br>')
  disclaimerElem.innerHTML = tourData.disclaimer
}