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
        template: "${0} and ${1}.\n Please suggest 1 meeting slot in 1 hour.please follow the format: yyyy/mm/dd hh:ss - yyyy/mm/dd hh:ss",
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
      },
    },
    output: {
      isResult: true,
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
  if (result) {
    const dateRangeString = result.output.match(/(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}) - (\d{4}\/\d{2}\/\d{2} \d{2}:\d{2})/);
    const startDate = new Date(dateRangeString[1]);
    const endDate = new Date(dateRangeString[2]);
    console.log(`Start Date: ${startDate.toISOString()}, End Date: ${endDate.toISOString()}`);
  }
};

if (process.argv[1] === __filename) {
  main();
}
