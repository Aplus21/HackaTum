import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Carousel from "./Carousel";
import Button from "react-bootstrap/Button";
import Ingredients from "./Ingredients";
import Final from "./Final"
import pic1 from "./assets/background/pic1.png"

function App() {
  const [isLoading, setLoading] = useState(false);
  const [isLoading2, setLoading2] = useState(false);
  const [cuisines, setCuisines] = useState(new Array(9).fill(0));
  const [selectedDishes, setSelectedDishes] = useState({
    Chinese: 0,
    Georgian: 0,
    Italian: 0,
    Indian: 0,
    Japanese: 0,
    Mexican: 0,
    Spanish: 0,
    Thai: 0,
    Greek: 0,
  });

  const [listOfIngredients, setListOfIngredients] = useState({});
  const [dataReady, setDataReady] = useState(false);
  const [finalReady, setFinalReady] = useState(false);

  // console.log(selectedDishes);
  console.log(cuisines);
  console.log(Object.keys(listOfIngredients).length);

  useEffect(() => {
    const fetchData = async () => {
      await fetch("http://localhost:5000/carousel")
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
        })
        .then((data) => {
          console.log(data);
          // console.log(selectedDishes);
          setCuisines(() => [...data["cuisines"]]);
          return;
        })
        .catch((e) => {
          console.log(`Error: ${e.message}`);
          setLoading(false);
        });
    };
    fetchData();
  }, []);

  function handleClick() {
    setLoading(true);
    const sendData = async () => {
      await fetch("http://localhost:5000/preffered_styles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedDishes),
      })
        .then((response) => {
          if (response.ok) {
            console.log(response);
            let arrayIng = [];
            response.json().then((data) => {
              arrayIng = data.data;
              setListOfIngredients(() => {
                let outPutObj = {};
                arrayIng.map((value) => {
                  // console.log(value);
                  outPutObj[value] = 0;
                });
                console.log(outPutObj);
                setDataReady(true);

                return outPutObj;
              })
              console.log(data.data);
            });
            return;
          } else {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
        })
        .then((data) => {
          console.log(data);
          setLoading(false);

          return;
        })
        .catch((e) => {
          console.log(`Error: ${e.message}`);
          setLoading(false);
        });
    };
    sendData();
  }

  function sendIngredients() {
    setLoading2(true);
    const sendData = async () => {
      await fetch("http://localhost:5000/selected_ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listOfIngredients),
      })
        .then((response) => {
          if (response.ok) {
            console.log(response);
            response.json().then((data) => {
              console.log(data);
              setFinalReady(true);  
              console.log(data.data);
            });
            return;
          } else {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
        })
        .then((data) => {
          console.log(data);
          setLoading2(false);

          return;
        })
        .catch((e) => {
          console.log(`Error: ${e.message}`);
          setLoading2(false);
        });
    };
    sendData();
  }

  return (
    <div id="rootDiv">
      <Navbar />
      <div id="body">
        <img id='pic1' src={pic1}/>
        {cuisines[0] != 0 ? (
          <Carousel
            cuisinesArray={cuisines}
            selectedDishes={selectedDishes}
            setSelectedDishes={setSelectedDishes}
          />
        ) : (
          ""
        )}
        <Button
          className="nextBtn"
          variant="primary"
          disabled={isLoading}
          onClick={!isLoading ? handleClick : null}
        >
          {isLoading ? "Loading…" : "Next"}
        </Button>
        {dataReady ?<Ingredients
          listOfIngredients={listOfIngredients}
          setListOfIngredients={setListOfIngredients}
          sendIngredients={sendIngredients}
          Loading={isLoading2}
          setLoading={setLoading2}

        />: ''}
        {finalReady? <Final/>  :''}

      </div>
    </div>
  );
}

export default App;
