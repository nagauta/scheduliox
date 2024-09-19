import { GraphAI } from "graphai";
import * as agents from "@graphai/agents";

const graphData = {
  version: 0.5,
  nodes: {
    inputData: {
      value:
        "Please arrange a meeting for Mike and Rei.",
    },
    mikeCalenders: {
      value: " 2024/09/22 13:00 - 2024/09/22 21:00 and 2024/09/23 15:00 - 2024/09/23 19:00",
    },
    reiCalenders: {
      value: " 2024/09/23 13:00 - 2024/09/23 21:00 and 2024/09/24 13:00 - 2024/09/23 21:00",
    },
    mikeAgent: {
      agent: "stringTemplateAgent",
      inputs: [":mikeCalenders"],
      params: {
        template: "Mike is available on ${0}",
      },
      console:{
        after: true,
      }
    },
    reiAgent: {
      agent: "stringTemplateAgent",
      inputs: [":reiCalenders"],
      params: {
        template: "Rei is available on ${0}",
      },
      console:{
        after: true,
      }
    },
    arrengerX: {
      agent: "stringTemplateAgent",
      inputs: [":mikeAgent", ":reiAgent"],
      params: {
        template: "${0} and ${1}.\n Please suggest 3 meeting slot in 1 hour.",
      },
      console:{
        after: true,
      }
    },
    llm: {
      agent: "openAIAgent",
      inputs: {
        prompt: ":arrengerX",
      },
      params: {
        model: "gpt-4o",
        // baseURL: "http://127.0.0.1:11434/v1",
        // apiKey: "llama3.1",
      },
    },
    output: {
      agent: "stringTemplateAgent",
      params: {
        template: "\e[32mLlama3\e[0m: ${0}"
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
