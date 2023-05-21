function permuteRecursive(team, begin, result) {
  if (begin >= team.length) {
    result.push([...team]);
    return;
  }

  for (let i = begin; i < team.length; i++) {
    [team[begin], team[i]] = [team[i], team[begin]];
    permuteRecursive(team, begin + 1, result);
    [team[begin], team[i]] = [team[i], team[begin]];
  }
}
function generateReviewPairs(team) {
  const result = [];
  permuteRecursive(team, 0, result);
  return result;
}
function generateFinalReviewers(team, result, value1) {
  for (let p of result) {
    p.unshift(value1);
  }
  let cornerCase1 = new Map();
  let cornerCase2 = new Map();
  let cornerCase3 = new Map();
  console.log(team);
  team.unshift(value1);
  for (let i = 0; i < team.length; i++) {
    if (i === 0 || i === 3) {
      cornerCase1.set(team[i], [team[1], team[2]]);
    } else {
      cornerCase1.set(team[i], [team[0], team[3]]);
    }
    if (i === 0 || i === 1) {
      cornerCase2.set(team[i], [team[2], team[3]]);
    } else {
      cornerCase2.set(team[i], [team[0], team[1]]);
    }
    if (i === 0 || i === 2) {
      cornerCase3.set(team[i], [team[1], team[3]]);
    } else {
      cornerCase3.set(team[i], [team[0], team[2]]);
    }
  }
  let reviews_weekly = new Map();
  let count = 1;
  for (let p of result) {
    let week = "week_" + count;
    reviews_weekly.set(week, new Map());
    for (let i = 0; i < p.length; i++) {
      reviews_weekly.get(week).set(p[i], []);
      reviews_weekly
        .get(week)
        .get(p[i])
        .push(p[(i + 1) % p.length]);
      reviews_weekly
        .get(week)
        .get(p[i])
        .push(p[(i + 2) % p.length]);
    }
    count++;
  }
  reviews_weekly.set("week_7", cornerCase1);
  reviews_weekly.set("week_8", cornerCase2);
  reviews_weekly.set("week_9", cornerCase3);
  return reviews_weekly;
}
function parseReviewPairs(reviewers_map) {
  const weeks = document.getElementsByClassName("week");
  console.log(weeks.length);
  for (let i = 0; i < weeks.length; i++) {
    try {
      const week = weeks[i];
      const week_reviewers = reviewers_map.get(week.id);
      const list = week.getElementsByTagName("li");
      let count = 0;
      for (let member of week_reviewers.keys()) {
        const reviewees = week_reviewers.get(member);
        list[count].innerText =
          member + " reviews " + reviewees[0] + " and " + reviewees[1];
        count++;
        console.log(
          member + " reviews " + reviewees[0] + " and " + reviewees[1]
        );
      }
    } catch (e) {
      console.log(e);
    }
  }
}
function saveContent() {
  const input1 = window.document.getElementById("name1");
  const input2 = window.document.getElementById("name2");
  const input3 = window.document.getElementById("name3");
  const input4 = window.document.getElementById("name4");
  const pattern = /^[A-Za-z\s]*$/;
  input1Value = input1.value;
  input2Value = input2.value;
  input3Value = input3.value;
  input4Value = input4.value;
  if (
    input1Value.trim() &&
    input2Value.trim() &&
    input3Value.trim() &&
    input4Value.trim() &&
    pattern.test(input1Value) &&
    pattern.test(input2Value) &&
    pattern.test(input3Value) &&
    pattern.test(input4Value)
  ) {
    // localStorage.setItem("name1", input1Value);
    // localStorage.setItem("name2", input2Value);
    // localStorage.setItem("name3", input3Value);
    // localStorage.setItem("name4", input4Value);
    let team = [input2Value, input3Value, input4Value];
    let result = generateReviewPairs(team);
    console.log(result);
    let reviewers = generateFinalReviewers(team, result, input1Value);
    console.log(reviewers);
    parseReviewPairs(reviewers);
    var d = document.getElementById("grid");
    d.style.display = 'grid';
    var c = document.getElementById("congrats");
    c.style.display = 'block';
    // TODO: parsing result array to get team names
  } else {
    alert("Please enter a valid name");
  }
}
