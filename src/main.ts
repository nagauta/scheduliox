import { GraphAI } from "graphai";
import * as agents from "@graphai/vanilla";

const graph_data = {
  version: 0.5,
  nodes: {
    node1: {
      value: "hello, GraphAI",
    },
    node2: {
      agent: "bypassAgent",
      inputs: [":node1"],
      isResult: true,
    },
  },
};

export const main = async () => {
  const graph = new GraphAI(graph_data, agents);
  const result = await graph.run();
  console.log(JSON.stringify(result));

};

if (process.argv[1] === __filename) {
  main();
}