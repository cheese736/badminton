function getRows(Model, attribute) {
  return Model.findAll({ attributes: [attribute], raw: true }).then((result) =>
    result.map((item) => item[attribute])
  )
}

function pickRandomly(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

module.exports = { getRows, pickRandomly }
