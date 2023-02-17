const { Party, City } = require('../models')
const weekDayConverter = require('../helpers/weekdayConverter')

/* define controll functions */
const partyController = {
  showParty: (req, res) => {
    (async () => {
      try {
        const cities = await City.findAll({ raw: true })
        let parties = await Party.findAll({
          include: { model: City },
          raw: true,
          nest: true,
        })
        console.log(parties)
        parties = parties.map((party) => {
          party.day = weekDayConverter(party.day_of_the_week)
          return party
        })
        res.render('parties', { parties, cities })
      } catch (err) {
        console.log(err)
      }
    })()
  },
}

module.exports = partyController
