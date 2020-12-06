var get = require("lodash.get");

module.exports = function sortList(sort, listData, identifier) {
    if (!sort) return;
    return listData.sort(function (a, b) {
        if (sort.asc) {
            if (get(a, sort.name) < get(b, sort.name)) {
                return -1;
            }
            if (get(a, sort.name) > get(b, sort.name)) {
                return 1;
            }
            return 0;
        } else {
            if (get(a, sort.name) > get(b, sort.name)) {
                return -1;
            }
            if (get(a, sort.name) < get(b, sort.name)) {
                return 1;
            }
            return 0;
        }
    });
};
