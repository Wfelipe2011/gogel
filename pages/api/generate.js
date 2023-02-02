import { Configuration, OpenAIApi } from "openai";

/**
 * Os preços são por 1.000 tokens.
 * Você pode pensar em tokens como pedaços de palavras, onde 1.000 tokens são cerca de 750 palavras.
 * Este parágrafo é de 35 tokens.
 */

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const input = req.body.input || '';
   try {
     const completion = await openai.createCompletion({
       model: "text-davinci-003",
       prompt: input,
       max_tokens: 256,
       temperature: 0.3,
     });
     res.status(200).json({ result: completion.data });
   } catch (error) {
     // Consider adjusting the error handling logic for your use case
     if (error.response) {
       console.error(error.response.status, error.response.data);
       res.status(error.response.status).json(error.response.data);
     } else {
       console.error(`Error with OpenAI API request: ${error.message}`);
       res.status(500).json({
         error: {
           message: "An error occurred during your request.",
         },
       });
     }
   }
}
