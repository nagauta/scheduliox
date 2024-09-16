import { GraphAI } from "graphai";
import * as agents from "@graphai/agents";

const graphData = {
  version: 0.5,
  nodes: {
    inputData: {
      value: "Please arrange a meeting for Mike and Rei.Mike has 2024/09/22 and 2024/09/23 available.Rei has 2024/09/23 and 2024/09/24 available.",
    },
    llm: {
      agent: "openAIAgent",
      inputs: {
        prompt: ":inputData",
      },
      params: {
        baseURL: "http://127.0.0.1:11434/v1",
        model: "llama3.1",
        apiKey: "llama3.1",
      },
    },
    output: {
        agent: "stringTemplateAgent",
        params: {
          template: "\\e[32m${1}:\\e[0m ${0}\\n",
        },
        console: {
          after: true,
        },
        inputs: [":llm.choices.$0.message.content"],
      },
  },
};

export const main = async () => {
  const graph = new GraphAI(graphData, agents);
  const result = await graph.run();
  console.log(JSON.stringify(result));
};

if (process.argv[1] === __filename) {
  main();
}
