import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  let attempts = 0;
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }
  let input = ''
  if(req.body.input.length < 300){
    input = `Ajude-me com o seguinte texto:
    ${req.body.input || ''}
    Responda em português de forma informal, imitando Alexa, de acordo com o contexto e de forma resumida.`;
  }else {
    input = `
    ${req.body.input || ''}
    Responda em português de acordo com o contexto.`
  }

  async function createCompletion() {
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: input,
        max_tokens: 700,
        temperature: 0.5,
      });
      res.status(200).json({ result: completion.data });
    } catch (error) {
      if (attempts < 3) {
        await sleep(1000);
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
