function commentsCompareFn(a, b) {
  return -(a.numberOfComments - b.numberOfComments)
}

function viewsCompareFn(a, b) {
  return -(a.views - b.views)
}

module.exports = {
  commentsCompareFn,
  viewsCompareFn,
}
