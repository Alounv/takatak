import type { RequestHandler } from "@builder.io/qwik-city";
import { getEncouragement } from "~/utilities/encouragement";
import { z } from "zod";

const encoder = new TextEncoder();

export const onPost: RequestHandler = async ({
  getWritableStream,
  parseBody,
  send,
}) => {
  const writableStream = getWritableStream();
  const writer = writableStream.getWriter();

  try {
    const { objective, name, successCount } =
      ((await parseBody()) as any) || {};

    z.number().parse(successCount);
    z.string().parse(name);
    z.object({
      coach: z.string(),
      duration: z.number(),
      description: z.string(),
      motivation: z.string(),
    }).parse(objective);

    getEncouragement({
      objective,
      successCount,
      name,
      onData: (data) => {
        if (data === "[DONE]") {
          writer.close();
          return;
        }

        writer.write(encoder.encode(data));
      },
    });
  } catch (e: any) {
    writer.close();
    send(400, e.message);
  }
};
