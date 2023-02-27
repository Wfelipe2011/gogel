import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  let attempts = 1;
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }
  let input = ''

  input = `Responda em português: ${req.body.input || ''}`;

  async function createCompletion() {
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: input,
        max_tokens: 10000,
        temperature: 0.3,
      });
      res.status(200).json({ result: completion.data });
    } catch (error) {
      if (attempts < 25) {
        await sleep(800 * attempts);
        await createCompletion();
        return;
      }

      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "Tente novamente mais tarde.",
        },
      });
    }
  }
  attempts++;
  await createCompletion();
}


async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
