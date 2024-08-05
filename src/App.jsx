import Detector from "./detector";
import { useState, useRef } from "react";
import "./App.css";

export default function App() {
  // open About modal
  const [modalStatus, setModalStatus] = useState(false);

  // scroll-to feature
  const feature = useRef(null);
  const scroll = () => feature.current.scrollIntoView();

  return (
    <main>
      <section className="w-screen h-screen flex flex-col justify-center items-center bg-orange gap-6">
        <button
          className="hidden md:block absolute top-4 left-4 w-24 h-12 text-2xl rounded-lg bg-white text-red z-20 m-8"
          onClick={() => setModalStatus(!modalStatus)}
        >
          {modalStatus ? "X" : "About"}
        </button>
        {modalStatus && (
          <div className="w-screen h-fit absolute top-0 left-0 z-10 flex justify-center items-center p-16">
            <div
              id="about-modal"
              className="w-min-2/3 w-max-[90vw] h-auto z-20 flex flex-col justify-center items-left text-white bg-red rounded-xl py-4 px-2 text-left border-solid border-4 border-orange"
            >
              <p className="text-4xl font-bold text-center">About</p>
              <p>
                The Centers for Medicare & Medicaid Services defines the term{" "}
                <span className="font-semibold">health equity</span> as "the
                attainment of the highest level of health for all people, where
                everyone has a fair and just opportunity to attain their optimal
                health regardless of race, ethnicity, disability, sexual
                orientation, gender identity, socioeconomic status, geography,
                preferred language, or other factors that affect access to care
                and health outcomes."
              </p>
              <p>
                It sounds like a complicated concept, but a system of health
                equity is essentially one in which everyone has access to
                healthcare, something that is unfortunately very different from
                reality today.
              </p>
              <p>
                Areas with very limited access to fresh, healthy, and nutritious
                food are called "food deserts." The USDA estimates around 19
                million Americans (6% of the population) live in low-access
                areas. For many, there are few grocery stores or supermarkets
                nearby, and they are often too expensive too afford. Even worse,
                fast food portion sizes are increasing, which means our food is
                much more unhealthier than we think it is. So how can we stay
                healthy? The first part of the solution is knowing what you are
                eating. It is important for everyone to know what nutrients are
                and are not going into our bodies.
              </p>
              <p>
                NutriScan aims to do just this: it analyzes your meal and uses
                up-to-date data from the USDA to calculate the nutritional
                value. Simply click "Get Started" to capture an image of your
                meal!
              </p>
              <p>
                Receiving accurate health information quickly and directly is
                currently not possible for many people, but technology has the
                power to create change.
              </p>
              <p className="underline text-orange">
                <a
                  href="https://www.ers.usda.gov/data-products/food-access-research-atlas/documentation/"
                  target="_blank"
                >
                  https://www.ers.usda.gov/data-products/food-access-research-atlas/documentation/
                </a>
              </p>
              <p className="text-orange">
                Monteiro, Carlos A, and Geoffrey Cannon. “Yes, Food Portion
                Sizes and People Have Become Bigger and Bigger. What Is to Be
                Done?.”{" "}
                <span className="italic">
                  American journal of public health
                </span>{" "}
                vol. 111,12 (2021): 2091-2093. doi:10.2105/AJPH.2021.306547
              </p>
            </div>
          </div>
        )}

        <h1 className="-mb-4 font-bold text-6xl md:text-9xl text-red">
          NutriScan
        </h1>
        <p className="text-white text-3xl mb-6 px-8 rounded-full text-center">
          Instant nutrition facts for any meal!
        </p>
        <button
          className="text-white text-3xl bg-red py-4 px-8 rounded-full animate-play"
          onClick={scroll}
        >
          Get Started
        </button>
      </section>
      <section
        ref={feature}
        className="w-screen min-h-screen max-h-fit bg-red pb-8"
      >
        <Detector />
      </section>
      <footer className="w-screen text-center text-red bg-white fixed bottom-0 py-3 text-base lg:text-xl opacity-80">
        &copy; {new Date().getFullYear()} NutriScan. All Rights Reserved.
      </footer>
    </main>
  );
}
