import * as tmImage from "@teachablemachine/image";
import { useState } from "react";
import axios from "axios";
import "./App.css";

export default function Detector() {
  // input = webcam or upload
  const [inputType, setInputType] = useState("");

  // activated on selection of either webcam or upload, initalizes process and resets any data already collected
  const clickHandler = (e) => {
    const id = e.target.id;
    const isCamera = id === "camera";
    document.getElementById("camera").disabled = isCamera;
    document.getElementById("upload").disabled = !isCamera;
    const cameraLabel = document.getElementById("camera-label");
    const uploadLabel = document.getElementById("upload-label");
    cameraLabel.classList[isCamera ? "add" : "remove"]("selected");
    uploadLabel.classList[isCamera ? "remove" : "add"]("selected");

    setInputType(id);
    document.getElementById("food-container").innerHTML = "";
    document.getElementById("data-btn").style.display = "none";
    activateDataButton();
    init(id);
  };

  // model setup
  const MODEL_URL = "https://teachablemachine.withgoogle.com/models/ETIU54qIw/";
  let model, webcam, maxPredictions;

  // initializes process, there are different steps depending on if it is webcam or upload
  async function init(inputType) {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    try {
      model = await tmImage.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();

      if (inputType === "camera") {
        // Convenience function to set up a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        const cameraBox = document.getElementById("webcam-container");
        cameraBox.classList.add("on");
        cameraBox.appendChild(webcam.canvas);
      } else if (inputType === "upload") {
        // File input handler
        document.getElementById("food-container").innerHTML = "";
        activateDataButton();
        const imageInput = document.getElementById("image-input");
        if (imageInput) {
          imageInput.addEventListener("change", handleImageUpload);
        } else {
          console.error("Image input not found.");
        }
      }
    } catch (error) {
      console.error("Error loading model or metadata:", error);
    }
  }

  // takes in uploaded image, displays it, and then calls predict() function
  async function handleImageUpload(event) {
    document.getElementById("facts-container").style.display = "none";

    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      const imageContainer = document.getElementById("image-container");
      if (imageContainer) {
        imageContainer.innerHTML = "";
        imageContainer.appendChild(img);
        await predict(img);
      } else {
        console.error("Image container not found.");
      }
    };

    img.onerror = () => {
      console.error("Error loading image.");
    };
  }

  // constantly updates and calls predict() function on every webcam frame
  async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    if (document.getElementById("webcam-container") != null) {
      window.requestAnimationFrame(loop);
    } else {
      webcam.stop();
    }
  }

  // predicts probabilities of potential food items in the photo and displays the most likely one
  async function predict(input = null) {
    try {
      let prediction;
      if (input != null) {
        prediction = await model.predict(input);
      } else {
        prediction = await model.predict(webcam.canvas);
      }

      let classPredictions = {};
      for (let i = 0; i < maxPredictions; i++) {
        classPredictions[prediction[i].className] = parseFloat(
          prediction[i].probability.toFixed(2),
        );
      }

      // finds most accurate prediction
      const keys = Object.keys(classPredictions);
      let highestVal = 0;
      let highestKey = "";
      for (let i = 0; i < 61; i++) {
        const val = classPredictions[keys[i]];
        if (val > highestVal) {
          highestKey = keys[i];
          highestVal = val;
        }
      }

      document.getElementById("food-container").innerHTML = highestKey
        .replace(/-/g, " ")
        .toUpperCase();
      activateDataButton();
    } catch (error) {
      console.error("Error making prediction:", error);
    }
  }

  // calls nutrition data API and displays nutrition facts about the depicted food item
  async function getNutritionData() {
    try {
      document.getElementById("data-btn").style.display = "none";
      const foodName = document.getElementById("food-container").innerHTML;

      // getting the data
      const api_key = "EbMrheZ9EbkNxuta7z5GICmOUJbfzlGni6xQaJBu";
      if (foodName != "") {
        const response = await axios.get(
          `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${api_key}&query=${foodName}`,
        );
        const nutritionContainer = document.getElementById(
          "nutrition-container",
        );

        // displaying the data
        const nutrients = response["data"]["foods"][0]["foodNutrients"];
        if (nutritionContainer) {
          nutritionContainer.innerHTML = "";
          const max =
            10 > response["data"]["foods"][0]["foodNutrients"].length
              ? response["data"]["foods"][0]["foodNutrients"].length
              : 10;
          for (let i = 0; i < max; i++) {
            const singleNutrient = nutrients[i];
            let fact = document.createElement("p");
            fact.innerHTML = `${singleNutrient.nutrientName.replace(/ .*/, "").replace(/,/, "")}: ${singleNutrient.value}${singleNutrient.unitName}`;
            nutritionContainer.style.gridTemplateColumns = `repeat(${Math.ceil(max / 2)}, minmax(0, 1fr))`;
            nutritionContainer.appendChild(fact);
          }
          document.getElementById("facts-container").style.display = "initial";
        } else {
          console.error("Facts container not found.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // resets and activates various elements
  function activateDataButton() {
    if (document.getElementById("food-container").innerHTML === "") {
      document.getElementById("data-btn").style.display = "none";
      document.getElementById("facts-container").style.display = "none";
    } else {
      document.getElementById("data-btn").style.display = "initial";
    }
  }

  return (
    <main className="flex flex-col justify-center items-center pt-4">
      <div
        id="segmented-control"
        className="flex flex-row justify-center items-center py-4 sm:py-6 text-base sm:text-2xl"
      >
        <input
          type="radio"
          name="input_type"
          id="camera"
          value="camera"
          onClick={clickHandler}
          className="hidden"
        />
        <label
          htmlFor="camera"
          id="camera-label"
          className="cursor-pointer bg-white hover:bg-orange py-2 px-4 my-2 text-orange hover:text-white"
        >
          Use webcam
        </label>

        <input
          type="radio"
          name="input_type"
          id="upload"
          value="upload"
          onClick={clickHandler}
          className="hidden"
        />
        <label
          htmlFor="upload"
          id="upload-label"
          className="cursor-pointer bg-white hover:bg-orange py-2 px-4 my-2 text-orange hover:text-white"
        >
          Upload image
        </label>
      </div>

      {inputType === "upload" && (
        <div className="py-2 px-4 rounded-lg flex flex-col justify-center items-center gap-y-4">
          <label
            htmlFor="image-input"
            className="relative inline-block cursor-pointer border-solid border-2 border-white text-orange hover:bg-white py-1 px-2 md:py-2 pmd:x-4 rounded-lg text-base sm:text-lg"
          >
            Select food photo (JPEG or PNG)
          </label>
          <input
            className="hidden"
            type="file"
            name="image-input"
            id="image-input"
            accept="image/*"
          />
          <div id="image-container"></div>
        </div>
      )}

      {inputType === "camera" && <div id="webcam-container"></div>}

      <p
        id="food-container"
        className="my-2 text-xl md:text-2xl font-semibold text-white"
      ></p>

      <button
        id="data-btn"
        onClick={getNutritionData}
        style={{ display: "none" }}
        className="my-2 text-base sm:text-xl border-solid border-2 border-orange text-white hover:bg-orange py-2 px-4 rounded-lg"
      >
        Get nutrition information
      </button>
      <div
        id="facts-container"
        style={{ display: "none" }}
        className="w-3/4 md:w-3/4 h-fit mt-2 flex flex-col justify-center items-start bg-white text-red py-4 px-4 rounded-lg"
      >
        <p className="text-xl md:text-2xl font-bold text-center mb-3">
          Nutrition Facts
        </p>
        <div
          id="nutrition-container"
          className="text-sm sm:text-base md:grid"
        ></div>
      </div>
    </main>
  );
}
