import React from "react";
import Hero from "../components/Hero";
import Doctors from "../components/Doctors";
import About from "../components/About";
import AppointmentForm from "../components/AppointmentForm";
import Contact from "../components/Contact";

const Home = () => {
  return (
    <>
      <Hero />
      <Doctors />
      <About />
      <AppointmentForm />
      <Contact />
    </>
  );
};

export default Home;
