import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [textInput, setATextInput] = useState("");
  const [result, setResult] = useState();

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
      // JSON.stringify(data, null, 2);
      setResult(data.result.choices[0].text);
      setATextInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
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
            rows={3}
            placeholder="Faça uma pesquisa"
            value={textInput}
            onChange={(e) => setATextInput(e.target.value)}
          />
          <input type="submit" value="Perguntar" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
