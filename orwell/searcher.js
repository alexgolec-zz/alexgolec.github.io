// Given a sorted list and an evaluation function, this object allows us to find
// particular elements in the list.
var Searcher = function(evaluatorFunction, lst) {
  return {
    // Return the index of the largest element in the list that is less than or
    // equal to the given value, when evaluated using the evaluatorFunction.
    // XXX: This is currently implemented as a linear search. Perhaps it would
    //      be worthwhile to reimplement this as a binary search in the future?
    largestElementLessThanOrEqualTo: function(value) {
      if (value < evaluatorFunction(lst[0])) {
        return -1;
      }
      // At this point we know the first element is not what we want.
      for (i = 1; i < lst.length; i++) {
        if (value < evaluatorFunction(lst[i])) {
          return i - 1;
        }
      }
      // If we get to this point, we know that the last element in the list is
      // the one we want.
      return lst.length - 1;
    }
  }
}
