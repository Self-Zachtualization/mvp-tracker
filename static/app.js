$("#login-form").submit((event) => {
  event.preventDefault();
  let username = $(`#username`).val();
  let password = $(`#password`).val();
  $.get(`/tracker/users/${username}`, (result) => {
    console.log("Got this back from the query: ", result);
    if (password === result.password) {
      $(`#user-check`).hide();
      $.get(`/tracker/goals`, (result) => {
        const d = new Date();
        for (i = 0; i < result.length; i++) {
          let { title, description, deadline, completed } = result[i];
          let diff = d.getTimezoneOffset() / 60;
          let deadDate = new Date(deadline);
          if (diff >= 0) {
            deadline = deadDate.toDateString(deadDate.setHours(deadDate.getHours() + diff));
          } else {
            deadline = deadDate.toDateString(deadDate.setHours(deadDate.getHours() - diff));
          }
          const $list = $(`#goals-list`);
          const $item = $(`<li id='item ${i}'> ${title}: ${description}, due on ${deadline} </li>`);
          if (completed === true) {
            $item.addClass("completed");
          } else {
            $item.addClass("in-progress");
          }
          $list.append($item);
          $list.click(() => {
            $list.append(`<div id='item-adjust'></div>`);
            const $adjuster = $("#item-adjust");
            $(`<button id='delete'`);
          });
          //   cal.data[username].i = {
          //     title: title,
          //     description: description,
          //     deadline: deadline,
          //     completed: completed,
          //   };
          //   console.log(cal.data);
        }
        // cal.data.username.deadline = { year: d.getFullYear(), month: d.getMonth(), day: d.getDay() };
        // console.log(
        //   `cal.data: ${cal.data}, cal.data.username: ${cal.data.username}, cal.data.username.deadline: ${cal.data.username.deadline}`
        // );
      });
      cal.init();
      $(`#tracker-body`).show();
    }
  });
});

$(`#register-form`).submit((event) => {
  event.preventDefault();

  const userInfo = {};

  $("#register-form")
    .find("input")
    .each((i, e) => {
      userInfo[e.name] = e.value;
    });
  $.ajax({
    url: "/tracker/users",
    type: "POST",
    data: JSON.stringify(userInfo),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: (result) => {
      const { username } = result;
      console.log("username ", username, " result ", result);
      alert(`Welcome to Tracker, ${username}`);
      $(`#user-check`).hide();
      cal.init();
      $(`#tracker-body`).show();
    },
  });
});

// Calendar
const cal = {
  mName: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  days: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],

  // Calendar Data
  data: [],
  sDay: 0,
  sMth: 0,
  sYear: 0,

  // HTML elements
  hMth: null,
  hYear: null,
  hForm: null,
  hfHead: null,
  hfDate: null,
  hfTxt: null,
  hfDel: null,

  // Initialize Calendar
  init: () => {
    console.log("cal.init called successfully");
    cal.hMth = $("#cal-mth");
    cal.hYear = $(`#cal-yr`);
    cal.hForm = $(`#cal-event`);
    cal.hfHead = $(`#evt-head`);
    cal.hfDate = $(`#evt-date`);
    cal.hfTxt = $(`#evt-details`);
    cal.hfDel = $(`#evt-del`);
    $("#evt-close").click(cal.close);
    $("#evt-del").click(cal.del);
    $("#cal-event").submit(cal.save);

    // Get Date
    let now = new Date(),
      nowMth = now.getMonth(),
      nowYear = parseInt(now.getFullYear());

    // Append Month Selectors
    for (let i = 0; i < 12; i++) {
      let $opt = $(`<option value='${i}'>${cal.mName[i]}</option>`);
      if (nowMth === i) {
        $opt.attr("selected", "selected");
      }
      cal.hMth.append($opt);
    }
    cal.hMth.change(cal.list);

    // Append Year Selectors
    for (let i = nowYear; i <= nowYear + 4; i++) {
      let $opt = $(`<option value='${i}'>${i}</option>`);
      if (i === nowYear) {
        $opt.attr("selected", "selected");
      }
      cal.hYear.append($opt);
    }
    cal.hYear.change(cal.list);

    // Fill cal.data
    $.get(`/tracker/goals`, (result) => {
      const d = new Date();
      for (i = 0; i < result.length; i++) {
        let { title, description, deadline, completed } = result[i];
        let diff = d.getTimezoneOffset() / 60;
        let deadDate = new Date(deadline);
        if (diff >= 0) {
          deadline = deadDate.toDateString(deadDate.setHours(deadDate.getHours() + diff));
        } else {
          deadline = deadDate.toDateString(deadDate.setHours(deadDate.getHours() - diff));
        }

        cal.data[i] = {
          title: title,
          deadline: { day: deadDate.getDate(), month: deadDate.getMonth(), year: deadDate.getFullYear() },
          description: description,
          completed: completed,
        };
        console.log(cal.data[i]);
      }
    });

    // Draw Calendar
    cal.list();
  },

  // Draw Calendar for Selected Month
  list: () => {
    console.log("cal.list called successfully");
    // Get days in month, start and end days
    cal.sMth = parseInt(cal.hMth.val());
    cal.sYear = parseInt(cal.hYear.val());
    let daysInMth = new Date(cal.sYear, cal.sMth + 1, 0).getDate(),
      startDay = new Date(cal.sYear, cal.sMth, 1).getDay(),
      endDay = new Date(cal.sYear, cal.sMth, daysInMth).getDay(),
      now = new Date(),
      nowMth = now.getMonth(),
      nowYear = parseInt(now.getFullYear()),
      nowDay = cal.sMth === nowMth && cal.sYear === nowYear ? now.getDate() : null;

    // I don't think so. I want my goals data stored in the tracker DB
    // $.get(`/tracker/goals`, (result) => {
    //   for (i = 0; i < result.length; i++) {
    //     let { title, description, deadline, completed } = result[i];
    //     let deadDate = new Date(deadline);
    //     deadline = `${deadDate.getDate()}, ${deadDate.getMonth()}, ${deadDate.getFullYear()}`;
    //     let usersGoals = {
    //       title: title,
    //       description: description,
    //       deadline: deadline,
    //       completed: completed,
    //     };
    //     cal.data = usersGoals;
    //     console.log(cal.data);
    //   }
    //   console.log(
    //     `cal.data: ${cal.data}, cal.data.usersGoals.username: ${cal.data.usersGoals.username}, cal.data.usersGoals.deadline: ${cal.data.usersGoals.deadline}`
    //   );
    // });

    // Drawing Calculations
    let squares = [];
    if (startDay !== 1) {
      let blanks = startDay === 0 ? 7 : startDay;
      for (let i = 0; i < blanks; i++) {
        squares.push("b");
      }
    }
    if (startDay !== 0) {
      for (let i = 0; i < startDay; i++) {
        squares.push("b");
      }
    }

    // Days of the month
    for (let i = 1; i < daysInMth; i++) {
      squares.push(i);
    }

    // Blank Squares after end of month
    if (endDay !== 0) {
      let blanks = endDay === 6 ? 1 : 7 - endDay;
      for (let i = 0; i < blanks; i++) {
        squares.push("b");
      }
    }
    if (endDay !== 6) {
      let blanks = endDay === 0 ? 6 : 6 - endDay;
      for (let i = 0; i < blanks; i++) {
        squares.push("b");
      }
    }

    // Draw HTML Calendar
    let $container = $(".cal-container"),
      $cTable = $(`<table id='calendar'></table>`);
    $container.html("");
    $container.append($cTable);

    // First Row for Day Names
    let $cRow = $(`<tr class='head'></tr>`),
      days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    for (let d of days) {
      let $cCell = $(`<td>${d}</td>`);
      $cRow.append($cCell);
    }
    $cTable.append($cRow);

    // Following Rows for Weeks
    let total = squares.length;
    let $dRow = $(`<tr class='day'></tr>`);
    for (let i = 0; i < total; i++) {
      let $dCell = $(`<td></td>`);
      if (squares[i] === "b") {
        $dCell.addClass("blank");
      } else {
        if (nowDay === squares[i]) {
          $dCell.addClass("today");
        }
        $dCell.append(`<div class="dd">${squares[i]}</div>`);
        for (j = 0; j < cal.data.length; j++) {
          if (
            cal.data[j].deadline.day === squares[i] &&
            cal.data[j].deadline.month === cal.sMth &&
            cal.data[j].deadline.year === cal.sYear
          ) {
            $dCell.append(`<div class='evt' style='color: red'>${cal.data[j].title}</div>`);
          }
        }
        $dCell.click((e) => {
          $dCell.addClass("clicked");
          cal.show($dCell);
        });
      }
      $dRow.append($dCell);
      if (i !== 0 && (i + 1) % 7 === 0) {
        $cTable.append($dRow);
        $dRow = $(`<tr class='day'></tr>`);
      }
    }

    // Remove any Previous Add/Edit Events
    cal.close();
  },

  show: (el, e) => {
    console.log("cal.show called successfully");
    // "Fetch" existing data
    cal.sDay = $("clicked").text();
    let isEdit = cal.data[cal.sDay] !== undefined;

    // "Update" Event Form
    if (isEdit) {
      cal.hfTxt.val(cal.data[cal.sDay]);
      cal.hfHead.text("EDIT EVENT");
    } else {
      cal.hfTxt.val("");
      cal.hfHead.text("ADD EVENT");
    }
    cal.hfDate.text(`${cal.sDay} ${cal.mName[cal.sMth]} ${cal.sYear}`);
    if (isEdit) {
      cal.hfDel.removeClass("ninja");
    } else {
      cal.hfDel.addClass("ninja");
    }
    cal.hForm.removeClass("ninja");
  },

  close: () => {
    // Close Events
    console.log("cal.close called successfully");
    cal.hForm.addClass("ninja");
  },

  save: () => {
    console.log("cal.save called successfully");
    cal.data[cal.sDay] = cal.hfTxt.val();
    $.ajax({
      url: "/tracker/goals",
      type: "POST",
      data: JSON.stringify(cal.data[cal.sDay]),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: (result) => {
        const { username } = result;
        console.log("username ", username, " result ", result);
        alert(`Welcome to Tracker, ${username}`);
      },
    });
    cal.list();
    return false;
  },

  del: () => {
    console.log("cal.del called successfully");
    if (confirm("Delete event?")) {
      delete cal.data[cal.sDay];

      cal.list();
    }
  },
};
