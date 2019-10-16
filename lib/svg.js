// HTML DOM 선택
const canvas = d3.select(".canvas");

// append 새로운 태그 추가
// attr 속성 지정
const svg = canvas
  .append("svg")
  .attr("height", 600)
  .attr("width", 600);

// 그룹 만들기
const group = svg.append('g')
  .attr('transform', 'translate(0, 100)')

// 메소드 체인 방식
group
  .append("rect") // 사각형
  .attr("width", 200)
  .attr("height", 100)
  .attr("fill", "orange")
  .attr("x", 20)
  .attr("y", 20);

group
  .append("circle") // 원형
  .attr("r", 50)
  .attr("cx", 300)
  .attr("cy", 70)
  .attr("fill", "purple");

group
  .append("line") // 선
  .attr("x1", 370)
  .attr("x2", 400)
  .attr("y1", 20)
  .attr("y2", 120)
  .attr("stroke", "white");

svg.append("text") // text
  .attr('x', 20)
  .attr('y', 200)
  .attr('fill', 'white')
  .text('Hello Text')
  .style('font-falmily', 'arial'); // style 적용




// const svgHeight = 150;
// const dataSet = [120, 70, 175, 80, 220];

// const barElements = d3.select("#myGraph")
//     .selectAll("rect")
//     .data(dataSet)

// barElements.enter()
//     .append("rect")
//     .attr("class", "bar")
//     .attr("height", function (d) {
//         return d;
//     })
//     .attr("width", "30")
//     .attr("x", function (d, i) {
//         return i * 60
//     })
//     .attr("y", function (d) {
//         return svgHeight - d
//     })

// const textElements = d3.select("#myGraph")
//     .selectAll("#barNum")
//     .data(dataSet)

// textElements.enter()
//     .append("text")
//     .attr("class", "barNum")
//     .attr("x", function (d, i) {
//         return i * 60;
//     })
//     .attr("y", svgHeight - 5)
//     .text(function (d, i) {
//         return d
//     })