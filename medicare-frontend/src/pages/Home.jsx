import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Doctors from "../components/Doctors";
import About from "../components/About";
import AppointmentForm from "../components/AppointmentForm";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Doctors />
      <About />
      <AppointmentForm />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;
