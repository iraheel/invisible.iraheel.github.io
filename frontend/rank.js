const VERSION = 'luqiao';
let nicknames = {};
let filenames;
let statsData = {};
let statsArr = [];

// function declarations

const loadStats = month => {
  statsArr = Object.entries(statsData[month]);
  updateSortColumnIcon('default', 'winp');
  _refresh();
}

const sortStats = (sort, col) => {
  statsArr.sort((a, b) => {
    let aData = a[1];
    let bData = b[1];
    var sortT = 1;
    if (sort === 'asc') {
      sortT = -1
    }

    if (col === 'winp') {
      if (aData.winP < bData.winP) {
        return 1 * sortT;
      } else if (aData.winP > bData.winP) {
        return -1 * sortT;
      } else if (aData.sum > bData.sum) {
        return -1 * sortT;
      } else {
        return 1 * sortT;
      }      
    } else if (col === 'win') {
      if (aData.win < bData.win) {
        return 1 * sortT;
      } else if (aData.win > bData.win) {
        return -1 * sortT;
      } else if (aData.winP > bData.winP) {
        return 1 * sortT;
      } else {
        return -1 * sortT;
      }
    } else if (col === 'lose') {
      if (aData.lose < bData.lose) {
        return 1 * sortT;
      } else if (aData.lose > bData.lose) {
        return -1 * sortT;
      } else if (aData.sum > bData.sum) {
        return 1 * sortT;
      } else {
        return -1 * sortT;
      }
    } else if (col === 'sum') {
      if (aData.sum < bData.sum) {
        return 1 * sortT;
      } else {
        return -1 * sortT;
      }
    } else {

    }
  });
};

const clearTable = () => {
  // [TODO: clear the table content for re-render]
  $('.col-content').html('');
};

const renderTable = () => {
  for (let entry of statsArr) {
    const [name, stat] = entry;
    const filename = `resources/pixyys/${filenames[name]}.png?_v=${VERSION}`;
    const {winning, losing, sum, winP} = stat;
    $('.result .col').append('<div class=row></div>');
    $('.avatar .row').last().html(`<img src="${filename}">`);
    $('.win .row').last().text(winning);
    $('.lose .row').last().text(losing);
    $('.sum .row').last().text(sum);
    $('.winp .row').last().text(parseInt(winP * 100) + '%');
  }
}

const _refresh = () => {
  clearTable();
  renderTable();
};


// event handlers

$.get(`data/nickname.json?_v=${VERSION}`)
  .done(data => {
    for (let key of Object.keys(data)) {
      const arr = data[key];
      for (let name of arr) {
        nicknames[name] = key;
      }
    }
  });

$.get(`data/filename.json?_v=${VERSION}`)
  .done(data => {
    filenames = data;
    $.get(`data/data.json?_v=${VERSION}`)
      .done(stats => {
        // populate stas array
        statsData = stats;
        // crappy code, need refactoring
        for (let monthData of Object.entries(statsData)) {
          for (let entry of Object.entries(monthData[1])) {
            const entryData = entry[1];
            entryData.sum = entryData.losing + entryData.winning;
            entryData.winP = entryData.sum === 0 ? 0 : entryData.winning / entryData.sum;
            entryData.win = entryData.winning;
            entryData.lose = entryData.losing;
          }
        }
        loadStats('A');
      });
  });

$('.col-header').click(function() {
  let col = $(this).attr('col');
  let sort = $('#' + col + '-sort-icon').attr('sort');

  updateSortColumnIcon(sort, col);
});

$('.month').click(function() {
  $('.month').removeClass('active');
  $(this).addClass('active');
  loadStats($(this).data('month'));
})

function updateSortColumnIcon(sort, col) {
  // change all to default first
  $('.sort-icon').attr('src', 'resources/icon/default.png');
  $('.sort-icon').attr('sort', 'default');

  if (sort === 'default') {
    // change to desc order    
    $('#' + col + '-sort-icon').attr('src', 'resources/icon/down.png');
    sortNew = 'desc';
  } else if (sort === 'desc') {
    // change to asc order
    $('#' + col + '-sort-icon').attr('src', 'resources/icon/up.png');
    sortNew = 'asc';
  } else {
    // change to default order
    $('#' + col + '-sort-icon').attr('src', 'resources/icon/default.png');
    sortNew = 'default';
  }

  $('#' + col + '-sort-icon').attr('sort', sortNew);

  sortColumn(sortNew, col);
  _refresh();
}

function sortColumn(sort, col) {
  // if sort back to default, directly sort by winp desc
  if (sort === 'default') {
    sortStats('desc', 'winp');
  } else {
    sortStats(sort, col);
  }
}
