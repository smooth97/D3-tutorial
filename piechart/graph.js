// dimensions 치수
const dims = { height: 300, width: 300, radius: 150 };
// center
const cent = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 };

// svg 생성
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", dims.width + 150)
  .attr("height", dims.height + 150);

const graph = svg
  .append("g")
  .attr("transform", `translate(${cent.x}, ${cent.y})`);

// 파이차트 생성
const pie = d3
  .pie()
  .sort(null)
  .value(d => d.cost);

const arcPath = d3
  .arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2);

// 각각 컬러 설정
const color = d3.scaleOrdinal(d3["schemeSet3"]);

// Legend setup
const legendGroup = svg
  .append("g")
  .attr("transform", `translate(${dims.width + 40}, 10)`);

const legend = d3
  .legendColor()
  .shape("circle")
  .shapePadding(10)
  .scale(color);

// Tooltip
const tip = d3
  .tip()
  .attr("class", "tip card")
  .html(d => {
    let content = `<div class="name">${d.data.name}</div>`;
    content += `<div class="cost">${d.data.cost}</div>`;
    content += `<div class="delete">Click slice to delete</div>`;
    return content;
  });

graph.call(tip);

// update function
const update = data => {
  // update color scale domain
  color.domain(data.map(d => d.name));

  // update and call legend
  legendGroup.call(legend);
  // text white
  legendGroup.selectAll("text").attr("fill", "white");

  // Join enhanced (pie) data to path elements
  const paths = graph.selectAll("path").data(pie(data));

  // data가 수정되면 current DOM path updates
  paths
    .exit()
    .transition()
    .duration(750)
    .attrTween("d", arcTweenExit)
    .remove(); // data 차트 조각이 통째로 사라짐

  paths
    .attr("d", arcPath) // 사라진 조각을 다른 path로 채우기
    .transition()
    .duration(750)
    .attrTween("d", arcTweenUpdate);

  // path 속성
  paths
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("d", arcPath)
    .attr("stroke", "white")
    .attr("stroke-width", 3)
    .attr("fill", d => color(d.data.name))
    .each(function(d) {
      this._current = d;
    }) //공부
    .transition()
    .duration(750)
    .attrTween("d", arcTweenEnter);

  // Add events
  graph
    .selectAll("path")
    .on("mouseover", (d, i, n) => {
      tip.show(d, n[i]); // data 와 this 파라미터
      handleMouseOver(d, i, n);
    })
    .on("mouseout", (d, i, n) => {
      tip.hide();
      handleMouseOut(d, i, n);
    })
    .on("click", handleClick);
};

let data = [];

// db 연결
db.collection("expenses").onSnapshot(res => {
  // 실시간 데이터 업데이트
  res.docChanges().forEach(change => {
    const doc = {
      ...change.doc.data(),
      id: change.doc.id
    };
    // type에 따라 상태 업데이트
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

// Animation

// 생성될 때
const arcTweenEnter = d => {
  let i = d3.interpolate(d.endAngle, d.startAngle);

  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

// 삭제 시 반대 transtion
const arcTweenExit = d => {
  let i = d3.interpolate(d.startAngle, d.endAngle);

  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

// use function keyword to allow use of 'this'
function arcTweenUpdate(d) {
  // interpolate between the two objects
  let i = d3.interpolate(this._current, d);

  // update the current prop with new updated data
  this._current = d;

  return function(t) {
    return arcPath(i(t));
  };
}

// event handlers
const handleMouseOver = (d, i, n) => {
  d3.select(n[i])
    .transition("changeSliceFill")
    .duration(300)
    .attr("fill", "white");
};

const handleMouseOut = (d, i, n) => {
  d3.select(n[i])
    .transition("changeSliceFill")
    .duration(300)
    .attr("fill", color(d.data.name));
};

const handleClick = d => {
  const id = d.data.id;
  db.collection("expenses")
    .doc(id)
    .delete();
};
