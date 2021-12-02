/** @type {import("../types").default} */
const highs = require("../build/highs.js");
const assert = require('assert').strict;

const PROBLEM = `Maximize
 obj: x1 + 2 x2 + 3 x3 + x4
Subject To
 c1: - x1 + x2 + x3 + 10 x4 <= 20
 c2: x1 - 3 x2 + x3 <= 30
 c3: x2 - 3.5 x4 = 0
Bounds
 0 <= x1 <= 40
 2 <= x4 <= 3
End`;

const SOLUTION = {
  IsLinear: true,
  Status: 'Optimal',
  Columns: {
    x1: {
      Index: 0,
      Status: 'UB',
      Lower: 0,
      Upper: 40,
      Primal: 40,
      Dual: 1.29167,
      Name: 'x1'
    },
    x2: {
      Index: 1,
      Status: 'BS',
      Lower: 0,
      Upper: Infinity,
      Primal: 10.2083,
      Dual: -0,
      Name: 'x2'
    },
    x3: {
      Index: 2,
      Status: 'BS',
      Lower: 0,
      Upper: Infinity,
      Primal: 20.625,
      Dual: -0,
      Name: 'x3'
    },
    x4: {
      Index: 3,
      Status: 'BS',
      Lower: 2,
      Upper: 3,
      Primal: 2.91667,
      Dual: -0,
      Name: 'x4'
    }
  },
  Rows: [
    {
      Index: 0,
      Status: 'UB',
      Lower: -Infinity,
      Upper: 20,
      Primal: 20,
      Dual: 1.64583
    },
    {
      Index: 1,
      Status: 'UB',
      Lower: -Infinity,
      Upper: 30,
      Primal: 30,
      Dual: 1.35417
    },
    {
      Index: 2,
      Status: 'FX',
      Lower: 0,
      Upper: 0,
      Primal: 0,
      Dual: 4.41667
    }
  ]
};

/**
 * @param {import("../types").Highs} Module 
 */
function test_optimal(Module) {
  const sol = Module.solve(PROBLEM);
  assert.deepStrictEqual(sol, SOLUTION);
}

/**
 * @param {import("../types").Highs} Module
 */
function test_options(Module) {
  const sol = Module.solve(PROBLEM, {
    "allowed_cost_scale_factor": 2,
    "use_implied_bounds_from_presolve": true,
    "presolve": "off",
  });
  assert.deepStrictEqual(sol, SOLUTION);
}

/**
 * @param {import("../types").Highs} Module
 */
function test_invalid_model(Module) {
  assert.throws(
    (_) => Module.solve("blah blah not a good file"),
    /Unable to read LP model/
  );
}

/**
 * @param {import("../types").Highs} Module
 */
function test_integer_problem(Module) {
  const sol = Module.solve(`Minimize
  obj: a + b
 Subject To
  c1: 2 a + b >= 6.5
 General
 a
 End`);
  assert.deepStrictEqual(sol, {
    IsLinear: false,
    Status: 'Optimal',
    Columns: {
      a: {
        Index: 0,
        Lower: 0,
        Upper: Infinity,
        Primal: 3,
        Type: 'Integer',
        Name: 'a'
      },
      b: {
        Index: 1,
        Lower: 0,
        Upper: Infinity,
        Primal: 0.5,
        Type: 'Continuous',
        Name: 'b'
      }
    },
    Rows: [
      { Index: 0, Lower: 6.5, Upper: Infinity, Primal: 6.5 }
    ]
  });
}

async function test() {
  const Module = await highs();
  test_optimal(Module);
  test_invalid_model(Module);
  test_options(Module);
  test_integer_problem(Module);
  console.log("test succeeded");
}

test()
