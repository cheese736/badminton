const checkboxes = document.querySelectorAll('.weekdayCheckbox')
const partyNameKeyword = document.querySelector('#partyName')
const citySelector = document.querySelector('#city-select')
const rows = document.querySelectorAll('table tbody tr')

function getCheckedDays() {
  const arr = []
  checkboxes.forEach((node) => {
    if (node.checked) {
      arr.push(node.value)
    }
  })
  return arr
}

function filtering() {
  const checkedDays = getCheckedDays()
  const regex = new RegExp(partyNameKeyword.value, 'i')
  rows.forEach((tr) => {
    if (
      checkedDays.includes(
        tr.querySelector('.name').textContent.match(regex) &&
          tr.querySelector('.days').attributes['value'].value
      ) &&
      (citySelector.value ===
        tr.querySelector('.cities').attributes['value'].value ||
        citySelector.value === '0')
    ) {
      tr.classList.remove('hide')
    } else {
      tr.classList.add('hide')
    }
  })
}

checkboxes.forEach((el) => {
  el.addEventListener('change', filtering)
})

citySelector.addEventListener('change', filtering)
partyNameKeyword.addEventListener('input', filtering)
