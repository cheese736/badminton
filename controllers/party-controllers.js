const { Party, City, User } = require('../models')
const dayConverter = require('../helpers/dayConverter')

/* define controll functions */
const partyController = {
  showParty: (req, res) => {
    (async () => {
      try {
        const cities = await City.findAll({ raw: true })
        let parties = await Party.findAll({
          include: [City, User],
          raw: true,
          nest: true,
        })
        parties = parties.map((party) => {
          party.day = dayConverter(party.day_of_the_week)
          return party
        })
        res.render('parties', {
          parties,
          cities,
          days: Array.from({ length: 7 }, (_, i) => ({
            number: i,
            text: dayConverter(i),
          })),
        })
      } catch (err) {
        console.log(err)
      }
    })()
  },
  postParty: (req, res) => {
    const userId = req.user.id
    const { name, contact, day_of_the_week, city, court } = req.body
    ;(async () => {
      try {
        await Party.create({
          name,
          host_name: userId,
          contact,
          day_of_the_week,
          court_location: court,
          city,
          created_at: Date.now(),
          updated_at: Date.now(),
        })
        req.flash('success_messages', '張貼成功')
        res.redirect('/parties')
      } catch (e) {
        console.log(e)
      }
    })()
  },
}

module.exports = partyController
