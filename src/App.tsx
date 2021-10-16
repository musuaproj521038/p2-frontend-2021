import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [entry, setEntry] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [numWords, setNumWords] = useState<number>(0);

  // Update text change.
  const handleChange = (e:any) => {
    setEntry(e.target.value);
  }

  // Submit the excerpt.
  const handleSubmit = () => {
    setLoading(true);
  }

  // Disable GUI elements while loading and getting results.
  useEffect(() => {
    if(!loading) return;

    const async_func = async () => {
      const response = await fetch(process.env.REACT_APP_ML_URL || "http://localhost:8890/score",
        {method: 'POST', body: JSON.stringify({"id":"420", "excerpt": entry})}
      )

      if(response.ok){
        const data = await response.json();
        const json_data = JSON.parse(data)
        const index = json_data["target"]

        // Using the same stat as in Recommendation Report.
        let year;
        if(index > 0){
            year = 3;
        }else if(index > -0.3){
            year = 4;
        }else if(index > -0.6){
            year = 5;
        }else if(index > -1){
            year = 6;
        }else if(index > -1.4){
            year = 7;
        }else if(index > -1.8){
            year = 8;
        }else if(index > -2.4){
            year = 9;
        }else if(index > -2.8){
            year = 10;
        }else if(index > -3.4){
            year = 11;
        }else if(index > -6){ 
            year = 12;
        }else{ // Someone find a text that gives a result of difficulty index lower than -6 lol.
            year = 13;
        }

        if(year < 13) setResult(`Readability level: ${index}\nSuitable for Year ${year} students!`)
        else setResult(`Readability level: ${index}\nSuitable for the book lovers!`)
      }else setResult("I am unable to connect to the server for some reason :C")
    }

    async_func();
  }, [loading]);

  // Show a loading state in results box.
  useEffect(() => {
    if(loading) setResult("Currently determining the readability model!\nMay take around 10 seconds.");
  }, [loading])

  // Update number of words present.
  useEffect(() => {
    const trimmedWords = entry.trim();
    setNumWords(trimmedWords.length === 0 ? 0 : trimmedWords.split(' ').length)
  }, [entry])

  // Enable button and textarea by setting loading to false.
  useEffect(() => {
    if(loading && !result.startsWith("Currently")) setLoading(false);
  }, [result]);

  // Remove result when showResult is set to false.
  useEffect(() => {
    setResult("");
  }, [entry]);

  

  return (
    <div className="App">
      <table className="AppGUI">
        <thead>
          <tr>
            <th>
              <h2>
                Welcome to Readability Analyser, insert an excerpt to get started!
              </h2>
              <h5>
                Remember that I can analyse between 150 to 225 words in an excerpt. 
                Please stick to these limits. <br/>
                There {numWords === 1 ? 'is' : 'are'} currently {numWords} word{numWords === 1 ? '' : 's'} in your excerpt.
              </h5>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <textarea 
                id="InputBox"
                value={entry} 
                disabled={loading}
                onChange={handleChange} 
                placeholder="Insert your passage/excerpt here!"
              />
            </td>
          </tr>
          <tr>
            <td>
              <br/>
              <button 
                id="SubmitButton"
                disabled={loading || !(numWords >= 150 && numWords <= 225)}
                onClick={handleSubmit}
              >
                Submit for Readability Analysis
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>
              <br/>
              <textarea
                id="ResultsBox"
                value={result}
                disabled={true}
                placeholder="No results yet!"
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
