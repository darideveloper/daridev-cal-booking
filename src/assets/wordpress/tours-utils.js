const apiBase = "https://granada-go-tours-booking.apps.darideveloper.com"
const toursBase = "https://granadago.com/tours"

function getLanguage() {
  // Check HTML lang attribute, default to 'es'
  return document.documentElement.lang || 'es';
}

function getLabel(data) {
  const lang = getLanguage();
  if (typeof data === 'string') return data;
  if (!data) return '';
  return data[lang] || data['es'] || '';
}

async function getToursData() {
  const url = `${apiBase}/api/tours`
  const res = await fetch(url)
  const data = await res.json()
  return data
}

async function getTourData(tourId) {
  const data = await getToursData()
  const tourData = data.find(item => item.id === tourId)
  return tourData
}

async function getRandomTours(count = 3) {
  const currentPath = window.location.pathname
  const segments = currentPath.split("/").filter((segment) => segment.length > 0)
  const currentTourId = segments[1]

  const data = await getToursData()
  return data
    .filter(tour => tour.id !== currentTourId)
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
}

function renderSpinner() {
  // Create the Elements
  const loaderContainer = document.createElement('div')
  loaderContainer.className = 'loader-container'

  const spinner = document.createElement('div')
  spinner.className = 'spinner'

  loaderContainer.appendChild(spinner)
  document.body.appendChild(loaderContainer)

  // Logic to remove it after 2 seconds
  setTimeout(() => {
    loaderContainer.classList.add('loader-hidden')
    // Completely remove from DOM after fade out
    setTimeout(() => loaderContainer.remove(), 500)
  }, 2000)
}
