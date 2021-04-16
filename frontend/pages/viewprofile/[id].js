import Head from "next/head";
import dynamic from "next/dynamic";
import Footer from "../../components/Footer";
import Link from "next/link";
import styles from "../../styles/pages/ViewProfilePage.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useLocalStorage from "../../functions/useLocalStorage";
import * as cfg from "../../config";
const backend = "http://" + cfg.BACKEND_IP + ":" + cfg.BACKEND_PORT;

const Header = dynamic(() => import("../../components/Header"), {
  ssr: false,
});
const Navbar = dynamic(() => import("../../components/Navbar"), {
  ssr: false,
});

export default function Profile() {
  const [auth, setAuth] = useLocalStorage("auth", {
    email: null,
    uid: null,
    username: null,
    authkey: null,
  });
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [pic, setPic] = useState("");
  const [add, setAdded] = useState(false);
  const [uid, setUid] = useState("");
  const [vid, setVid] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return <></>;
    getUser();
  }, [router.isReady]);

  async function getUser() {
    await axios
      .post(backend + "/user/getUser", {
        uid: parseInt(router.query.id),
      })
      .then((response) => {
        setUsername(response.data[0].username);
        setBio(response.data[0].bio);
        setPic(response.data[0].image);
        setUid(router.query.id);
        setVid(auth.uid);
      });
  }
  async function addUser() {
    const added = await axios.post(backend + "/friend/add", {
      uid: auth.uid,
      fuid: parseInt(router.query.id),
    });
    window.location.reload();
    alert("User added!");
  }

  return (
    <div className={styles.page}>
      <Head>
        <title>Blogaru - Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title}>Profile</h1>
        <Link href="/">
          <div className={styles.button} >Back</div>
        </Link>
        <div className={styles.friendlist}>
          <div className={styles.content}>
            {/* ADD LINK TO ADD FRIEND */}
            {parseInt(vid) !== parseInt(uid) ? (
              <img
                className={styles.add}
                src={"/add2.png"}
                onClick={addUser}
              />
            ) : (
              <></>
            )}
            <div className={styles.user}>

              <img className={styles.pic} src={pic != "" ? pic : "/user.png"} />
              <p id="un" className={styles.username}>
                <b>@{username}</b>
              </p>
              <p id="bi" className={styles.bio}>
                Bio: {bio}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
