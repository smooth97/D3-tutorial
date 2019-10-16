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

const t = d3.transition().duration(1000);

// ***** update function 모듈화 하기 ******
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
    .attr("fill", "orange")
    .attr("x", d => x(d.name)); // data index 값 * 70
  // .transition(t)
  // .attr("height", d => graphHeight - y(d.orders)) // data의 orders 값 적용
  // .attr("y", d => y(d.orders));

  // 반환되지 못한 나머지 data 가상 DOM으로 생성
  rects
    .enter()
    .append("rect")
    .attr("width", 0)
    .attr("height", 0)
    .attr("fill", "orange")
    .attr("x", d => x(d.name))
    .attr("y", graphHeight)
    .merge(rects) // 병합
    .transition(t) // transition 효과 주기
    .attrTween("width", widthTween)
    .attr("y", d => y(d.orders)) // 위에 있는 그래프 뒤집기
    .attr("height", d => graphHeight - y(d.orders));

  // 축 적용
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

let data = [];

// 실시간 업데이트 함수
db.collection("dishes").onSnapshot(res => {
  res.docChanges().forEach(change => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case "added":
        data.push(doc);
        break;
      case "modified":
        const index = data.findIndex(item => item.id == doc.id);
        data[index] = doc;
        break;
      case "removed":
        data = data.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }
  });
  update(data);
});

// TWEENS

const widthTween = d => {
  let i = d3.interpolate(0, x.bandwidth());

  return function(t) {
    return i(t);
  };
};
