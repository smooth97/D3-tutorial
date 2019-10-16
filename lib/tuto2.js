const data = [{
        width: 200,
        height: 100,
        fill: 'purple'
    },
    {
        width: 100,
        height: 60,
        fill: 'orange'
    },
    {
        width: 50,
        height: 30,
        fill: 'skyblue'
    }
]

const svg = d3.select('svg');

const rects = svg.selectAll('rect')
    .data(data);

// 이미 존재하는 DOM의 속성
rects.attr('width', (d, i, n) => d.width)
    .attr('height', (d) => d.height)
    .attr('fill', (d) => d.fill);

// 바인딩 되지 못하고 남은 데이터에 맞는 가상 DOM 생성
rects.enter()
    .append('rect')
    .attr('width', (d, i, n) => d.width)
    .attr('height', (d) => d.height)
    .attr('fill', (d) => d.fill);