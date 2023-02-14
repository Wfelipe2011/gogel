import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

const COST_PER_TOKEN = 0.00004;
const ERROR_MARGIN = 0.2;
const DOLLAR_TO_BRL_RATE = 6;


export default function Home() {
  const [textInput, setATextInput] = useState("");
  const [rows, setRows] = useState(1);
  const [result, setResult] = useState();
  const [cost, setCost] = useState({
    tokens: 0,
    price: 0,
  });

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: textInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        console.error(data.error);
        throw data.error || new Error(`Tente novamente`);
      }
      calculateCost(data.result.usage.total_tokens)
      setResult(data.result.choices[0].text);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  function autoSizeTextarea(text) {
    const charLength = text.length;
    const divisor = window.innerWidth < 768 ? 30 : 60;
    const rows = Math.floor(charLength / divisor) + 1;
    setRows(rows);
  }



  function calculateCost(numTokens) {
    let cost = numTokens * COST_PER_TOKEN;
    cost = cost + (cost * ERROR_MARGIN);

    const costInBRL = cost * DOLLAR_TO_BRL_RATE;

    setCost({
      tokens: numTokens,
      price: costInBRL,
    })
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/gogel.png" />
      </Head>

      <main className={styles.main}>
        <img src="/gogel.png" className={styles.icon} />
        <h3>Pesquisa OpenAI</h3>
        <form onSubmit={onSubmit}>
          <textarea
            type="text"
            name="search"
            rows={rows}
            placeholder="Faça uma pesquisa"
            value={textInput}
            onChange={(e) => {
              setATextInput(e.target.value);
              autoSizeTextarea(e.target.value)
            }}
          />
          <input type="submit" value="Perguntar" />
        </form>
        <div className={styles.result}>{result}</div>
        <div className={styles.result}>
          {cost.price && (
            <p>Preço: R$ {cost.price.toFixed(2)}</p>
          )}
        </div>
      </main>
    </div>
  );
}
