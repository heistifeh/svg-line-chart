# svg-line-chart

An interactive line chart drawn directly with SVG in React and TypeScript, with no chart library. The geometry lives in small pure functions with unit tests, and the component only renders what they return.

## Features

- Scales, axis ticks, line path and filled area path are computed from scratch.
- Hover or touch (pointer events) snaps to the nearest data point and shows a tooltip.
- Pointer position is converted from screen pixels to SVG `viewBox` coordinates, so it stays correct when the chart is resized.
- Accessible: `role="img"`, `aria-label` and an SVG `<title>`.

## Run it

```bash
npm install
npm run dev     # start the demo
npm test        # run the unit tests
npm run build   # type-check and build
```

## Verifiable behavior

Each rule below is covered by a test in `src/lib/chart.test.ts`.

| Function | Input | Expected output |
| --- | --- | --- |
| `scaleLinear([0,100],[0,500])` | §50` | `250` |
| `scaleLinear([0,10],[200,0])` | §2.5` | `150` (inverted SVG y axis) |
| `scaleLinear([5,5],[10,90])` | §5` | `10` (zero-width domain) |
| `buildLinePath` | `[[0,100],[50.126,40],[100,0]]` | `"M0 100 L50.13 40 L100 0"` |
| `buildAreaPath` | `[[10,20],[30,10]]`, base `100` | `"M10 20 L30 10 L30 100 L10 100 Z"` |
| `niceTicks(0,100,5)` | | `[0, 50, 100]` |
| `nearestIndex([0,100,200,300], 60)` | | `1` |

## Project layout

```
src/lib/chart.ts        pure geometry functions
src/lib/chart.test.ts   unit tests (Vitest)
src/LineChart.tsx       SVG component and pointer handling
src/App.tsx             demo page
```

## Why SVG here

SVG gives sharp output at any size, styleable shapes and DOM-level accessibility, which suits a chart with a handful of points. For thousands of points or heavy animation, Canvas would be the better choice.
