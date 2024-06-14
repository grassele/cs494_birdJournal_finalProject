// import Image from "next/image";
// import styles from "./page.module.css";

import Login from "@/components/login";
import NavBar from "@/components/navBar";

export default function Home() {
  return (
    <div>
      <NavBar />
      <main>
        <Login />
      </main>
    </div>
  );
}
