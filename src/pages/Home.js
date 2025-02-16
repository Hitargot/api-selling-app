import React from "react";
import Header from "../components/Header";
import ApiList from "../components/ApiList";
import About from "../components/About";
import Contact from "../components/Contact"; // Import Contact Component
import Footer from "../components/Footer";

function Home() {
    return (
        <div>
            <Header />
            <main>
                <About />
                <ApiList />
                <Contact /> {/* Added Contact section here */}
            </main>
            <Footer />
        </div>
    );
}

export default Home;
