$(`#new-user-form`).submit((event) => {
  event.preventDefault();

  const userInfo = {};

  $("#new-user-form")
    .find("input")
    .each((i, e) => {
      userInfo[e.name] = e.value;
    });
  // console.log("userinfo: ", userInfo);
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
    },
  });
});

$("#login-form").submit((event) => {
  event.preventDefault();
  let username = $(`#username`).val();
  let password = $(`#password`).val();
  $.get(`/tracker/users/${username}`, (result) => {
    console.log("Got this back from the query! ", result);
    if (password === result.password) {
      $(`#user-check`).hide();
      $.get(`/tracker/goals`, (result) => {
        for (i = 0; i < result.length; i++) {
          let { title, description, deadline, completed } = result[i];
          const $list = $(`#goals-list`);
          const $item = $(`<li id='item ${i}'> ${title}: ${description}, due on ${deadline} </li>`);
          if (completed === true) {
            $item.addClass("completed");
          } else {
            $item.addClass("in-progress");
          }
          $list.append($item);
        }
      });
      $(`#tracker-body`).show();
    }
  });
});

$("#geddit").click(() => {
  $.get("/tracker/goals", (result) => {
    alert("you did it mate: ", result);
  });
});
