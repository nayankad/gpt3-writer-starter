import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
`
Tell me what mental health problem I might be experiencing based on the symptoms below and give me some information about it. 

Symptoms:
`

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{role: 'user', content: `${basePromptPrefix}${req.body.userInput} Output:`}],
    temperature: 0.7,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = 
  `
  Given the context below, give me a list on how to manage or treat the symptoms. Go into detail for each point and explain how to achieve it with specific examples.

  Context: ${basePromptOutput.message.content}
  `

  const secondPromptCompletion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{role: 'user', content: `${secondPrompt}`}],
    temperature: 0.7,
    max_tokens: 1250,
  });

  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output1: basePromptOutput, output2: secondPromptOutput });
};

export default generateAction;