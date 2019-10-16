const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", 600)
  .attr("height", 600);

// 차트에 여백 만들기
const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xAxisGroup = graph
  .append("g")
  .attr("transform", `translate(0, ${graphHeight})`); // x축 아래로 translate
const yAxisGroup = graph.append("g");

// scales
const y = d3
  .scaleLinear() // 한계치 설정
  .range([graphHeight, 0]);

const x = d3
  .scaleBand()
  .range([0, 500])
  .paddingInner(0.2) // 0.2 padding
  .paddingOuter(0.2);

// x축 y축 (axis) 생성
const xAxis = d3.axisBottom(x);
const yAxis = d3
  .axisLeft(y)
  .ticks(3) //ticks 는 y축 눈금 갯수
  .tickFormat(d => d + " orders"); // 눈금 값 설정

// update x axis text
xAxisGroup
  .selectAll("text") // x축 눈금 값. text 선택
  .attr("transform", "rotate(-40)")
  .attr("text-anchor", "end")
  .attr("fill", "orange");

// update function
const update = data => {
  // updating scale domains
  y.domain([0, d3.max(data, d => d.orders)]);
  x.domain(data.map(item => item.name));

  // data 와 rects 연결
  const rects = graph.selectAll("rect").data(data);

  // remove exit selection
  rects.exit().remove();

  // update current shape in hte DOM
  rects
    .attr("width", x.bandwidth)
    .attr("height", d => graphHeight - y(d.orders)) // data의 orders 값 적용
    .attr("fill", "orange")
    .attr("x", d => x(d.name)) // data index 값 * 70
    .attr("y", d => y(d.orders));

  // 반환되지 못한 나머지 data 가상 DOM으로 생성
  rects
    .enter()
    .append("rect")
    .attr("width", x.bandwidth)
    .attr("height", d => graphHeight - y(d.orders))
    .attr("fill", "orange")
    .attr("x", d => x(d.name))
    .attr("y", d => y(d.orders)); // 위에 있는 그래프 뒤집기

  // 축 적용
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

// Firebase Data 적용해서 차트 만들기
db.collection("dishes")
  .get()
  .then(res => {
    let data = [];
    res.docs.forEach(doc => {
      data.push(doc.data());
    });
    console.log(data); // firebase data 배열

    update(data);
  });