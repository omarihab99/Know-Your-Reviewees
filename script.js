/* 
This is a recursive function that generates all possible permutations of an input array team and stores them in the result array. 
It does this by swapping each element in the array with every other element and recursively calling itself with the new array
until all possible permutations have been found.
*/

/**
 * Recursively generates all permutations of the given team array.
 *
 * @param {Array} team - The array of elements to permute.
 * @param {number} begin - The index to start permuting from.
 * @param {Array} result - The array to store the resulting permutations.
 * @return {void} This function does not return anything.
 */
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
/**
 * Generates all possible pairs within the given team and returns them in an array.
 *
 * @param {Array} team - An array of team members.
 * @return {Array} An array of arrays, where each subarray contains three team members.
 */
function generateReviewPairs(team) {
  const result = [];
  permuteRecursive(team, 0, result);
  return result;
}

/**
 * Generates a map of weekly reviews for a team, including corner cases.
 *
 * @param {Array} team - an array of team members.
 * @param {Array} result - an array of review pairs for each week.
 * @param {String} value1 - the first team member added to the beginning of each review array (team[0]).
 * @return {Map} a map of weekly reviews, including corner cases.
 */

function generateFinalReviewers(team, result, value1) {
  for (let p of result) {
    p.unshift(value1);
  }
  let cornerCase1 = new Map();
  let cornerCase2 = new Map();
  let cornerCase3 = new Map();
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
/**
 * Updates the values of the review cells for a given week using the reviewers_map provided.
 *
 * @param {Map} reviewers_map - A Map object containing the reviewers and their review values.
 * @param {HTMLElement[]} week - An array of HTML elements representing the rows of a table for a given week.
 */
function putValues(reviewers_map, week) {
  const week_reviewers = reviewers_map.get(week[0].className);
  const week_reviewers_arr = Array.from(week_reviewers.keys());
  for (let i = 0; i < week.length; i++) {
    const cells = week[i].getElementsByTagName("td");
    cells[1].innerText = week_reviewers_arr[i];
    cells[2].innerText = week_reviewers.get(week_reviewers_arr[i])[0];
    cells[3].innerText = week_reviewers.get(week_reviewers_arr[i])[1];
  }
}
/**
 * Parses review pairs from a map of reviewers.
 *
 * @param {Object} reviewers_map - map of reviewers and their assigned reviewees.
 */
function parseReviewPairs(reviewers_map) {
  const week1 = document.getElementsByClassName("week_1");
  const week2 = document.getElementsByClassName("week_2");
  const week3 = document.getElementsByClassName("week_3");
  const week4 = document.getElementsByClassName("week_4");
  const week5 = document.getElementsByClassName("week_5");
  const week6 = document.getElementsByClassName("week_6");
  const week7 = document.getElementsByClassName("week_7");
  const week8 = document.getElementsByClassName("week_8");
  const week9 = document.getElementsByClassName("week_9");
  const weeks = [week1, week2, week3, week4, week5, week6, week7, week8, week9];
  for (let i = 0; i < weeks.length; i++) {
    putValues(reviewers_map, weeks[i]);
  }
}
/**
 * Saves content if all input values are valid and distinct names.
 *
 * @return {void} No return value.
 */
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
    pattern.test(input4Value) &&
    input1Value !== input2Value &&
    input1Value !== input3Value &&
    input1Value !== input4Value &&
    input2Value !== input3Value &&
    input2Value !== input4Value &&
    input3Value !== input4Value
  ) {
    let team = [input2Value, input3Value, input4Value];
    let result = generateReviewPairs(team);
    let reviewers = generateFinalReviewers(team, result, input1Value);
    parseReviewPairs(reviewers);
    const ec = document.getElementsByClassName("ending-container")[0];
    const f = document.getElementsByTagName("form")[0];
    const p = document.getElementsByTagName("p")[0];
    const h4 = document.getElementsByTagName("h4")[0];
    const tc = document.getElementsByClassName("table-container")[0];
    ec.style.display = "grid";
    f.style.display = "none";
    p.style.display = "none";
    h4.style.display = "none";
    tc.style.display = "block";
  } else {
    alert("Please enter a valid name (distinct names)");
  }
}
/**
 * Downloads a PDF of the reviewees table.
 *
 * @return {void} Nothing is returned.
 */
function download() {
  var HTML_Width = document.getElementById("reviewees-table").offsetWidth;
  var HTML_Height = document.getElementById("reviewees-table").offsetHeight;
  var top_left_margin = 15;
  var PDF_Width = HTML_Width + top_left_margin * 2;
  var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
  var canvas_image_width = HTML_Width;
  var canvas_image_height = HTML_Height;
  var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

  html2canvas(document.getElementById("reviewees-table")).then((canvas) => {
    var imgData = canvas.toDataURL();
    var pdf = new jsPDF("p", "pt", [PDF_Width, PDF_Height]);
    pdf.addImage(
      imgData,
      "JPG",
      top_left_margin,
      top_left_margin,
      canvas_image_width,
      canvas_image_height
    );
    for (var i = 1; i <= totalPDFPages; i++) {
      pdf.addPage(PDF_Width, PDF_Height);
      pdf.addImage(
        imgData,
        "JPG",
        top_left_margin,
        -(PDF_Height * i) + top_left_margin * 4,
        canvas_image_width,
        canvas_image_height
      );
    }
    pdf.save("Reviewers.pdf");
  });
}
