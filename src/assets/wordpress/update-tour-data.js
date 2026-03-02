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
  const durationElem = document.querySelector("#summary #duration > div > div")
  durationElem.innerHTML = tourData.duration

  // ----- Location -----
  const locationButton = document.querySelector("#location a")
  locationButton.setAttribute("href", tourData.location_map)
}