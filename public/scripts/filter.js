const checkboxes = document.querySelectorAll('.weekdayCheckbox')
const daysInTable = document.querySelectorAll('tr .days')
const citiesInTable = document.querySelectorAll('tr .cities')
const partyNameKeyword = document.querySelector('#partyName')
const city = document.querySelector('#city-select')

function dayFilter(event) {
  const value = event.target.value
  daysInTable.forEach((item) => {
    if (item.attributes['value'].value === value) {
      item.parentElement.classList.toggle('hide')
    }
  })
}

function cityFilter(event) {
  const value = event.target.value
  console.log(value)
  if (value === '0') {
    citiesInTable.forEach((item) => {
      item.parentElement.classList.remove('hide')
    })
    return
  }

  citiesInTable.forEach((item) => {
    if (item.attributes['value'].value !== value) {
      item.parentElement.classList.add('hide')
    } else {
      item.parentElement.classList.remove('hide')
    }
  })
}

checkboxes.forEach((el) => {
  el.addEventListener('change', dayFilter)
})

city.addEventListener('change', cityFilter)
