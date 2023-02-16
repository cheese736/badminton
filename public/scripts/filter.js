const checkboxes = document.querySelectorAll('.weekdayCheckbox')
const tableContent = document.querySelectorAll('tr .days')
const partyNameKeyword = document.querySelector('#partyName')

function dayFilter(e) {
  const value = e.target.value
  tableContent.forEach((item) => {
    if (item.attributes['value'].value === value) {
      item.parentElement.classList.toggle('hide')
    }
  })
}

checkboxes.forEach((el) => {
  el.addEventListener('change', dayFilter)
})
