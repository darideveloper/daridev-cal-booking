async function loadTours() {
  const containerId = "tours-cards"
  const wrapper = document.getElementById(containerId)
  if (!wrapper) return

  try {
    const data = await getToursData()
    console.log({ data })
    const template = wrapper.firstElementChild
    if (!template) return

    // Clear container
    while (wrapper.firstChild) {
      wrapper.removeChild(wrapper.firstChild)
    }

    data.forEach(item => {
      // Clone the template
      const clone = template.cloneNode(true)

      // Update Text Content
      const h3 = clone.getElementsByTagName("h3")[0]
      if (h3) h3.textContent = item.title

      const descKey = 'data-elementor-setting-key'
      const desc = clone.querySelector(`[${descKey}="infocard_description"]`)
      if (desc) desc.textContent = item.subtitle

      const price = clone.querySelector('.price')
      if (price) price.textContent = "€" + item.price

      // Update Image Source
      const img = clone.querySelector('img')
      const imgSrc = `${apiBase}/tours/banners/${item.id}.webp`
      img.src = imgSrc
      img.setAttribute("data-src", imgSrc)
      img.setAttribute("data-srcset", imgSrc)
      img.setAttribute("srcset", imgSrc)

      img.alt = item.title // Good for SEO/Accessibility

      // Convert Card to <a> Link
      const linkCard = document.createElement('a')
      linkCard.href = `${toursBase}/${item.id}/`
      linkCard.target = "_blank"
      linkCard.rel = "noopener noreferrer" // Security best practice for _blank

      // Copy over the original classes so styles don't break
      linkCard.className = clone.className

      // Move all children from the clone to the new link
      while (clone.firstChild) {
        linkCard.appendChild(clone.firstChild)
      }

      wrapper.appendChild(linkCard)
    })
  } catch (err) {
    console.warn("Issue:", err)
  }
}

window.addEventListener('load', loadTours)