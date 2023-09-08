import type { Objective } from "~/server/db/schema";

const OPTIONS = {
  max_tokens: 2048,
  temperature: 0.6,
  top_p: 1,
  presence_penalty: 0,
  frequency_penalty: 0,
  best_of: 1,
  model: "text-davinci-003",
};

const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + String(import.meta.env.VITE_OPENAI_API_KEY),
};

const decoder = new TextDecoder("utf-8");

const getTextCompletion = async (
  prompt: string,
  onData: (data: string) => void,
  controller: AbortController,
): Promise<void> => {
  const response = await fetch("https://api.openai.com/v1/completions", {
    signal: controller?.signal,
    method: "POST",
    headers,
    body: JSON.stringify({ ...OPTIONS, prompt, stream: true }),
  });

  const reader = response.body?.getReader();

  if (!reader) {
    console.error("Could not get reader from response");
    return;
  }

  for (let i = 0; i < 1000; i++) {
    const buffer = await reader.read();
    const data = decoder.decode(buffer.value);
    const message = data.replace(/^data: /, "");

    if (message.includes("[DONE]")) {
      return;
    }

    try {
      const parsedData = JSON.parse(message);
      const content = parsedData?.choices?.[0]?.text;
      if (content) onData(content);
    } catch (e: any) {
      console.error(`Could not parse data string |${message}|`, e.message);
      return;
    }
  }
};

interface IGetPrompt {
  objective: Pick<
    Objective,
    "coach" | "duration" | "description" | "motivation"
  >;
  successCount: number;
  name: string;
}

const getPrompt = ({ objective, successCount, name }: IGetPrompt): string => {
  return `
  Imagine ${objective.coach} is encouraging ${name} 
  to pursue his goal of ${objective.description} for ${objective.duration} days 
  in order to afford ${objective.motivation}.
  It has lasted ${successCount} days already.
  The style of ${objective.coach} must be recognizable and it must be funny.
  `;
};

export const getEncouragement = async ({
  controller,
  objective,
  successCount,
  name,
  onData,
}: IGetPrompt & {
  onData: (data: string) => void;
  controller: AbortController;
}) => {
  const prompt = getPrompt({ objective, name, successCount });
  getTextCompletion(prompt, onData, controller);
};
