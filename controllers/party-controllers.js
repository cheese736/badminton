const { Party } = require('../models')
const weekDayConverter = require('../helpers/weekdayConverter')

/* define controll functions */
const partyController = {
  showParty: (req, res) => {
    (async () => {
      try {
        let parties = await Party.findAll({ raw: true })
        parties = parties.map((party) => {
          party.day = weekDayConverter(party.day_of_the_week)
          return party
        })
        res.render('parties', { parties })
      } catch (err) {
        console.log(err)
      }
    })()
  },
}

module.exports = partyController
