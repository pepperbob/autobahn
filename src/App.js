import React, { useEffect, useState } from "react";

import "./styles.css";

function ShowPoint({ coord }) {
  const key = "AIzaSyD0Su-2OBYHAkD621rPOnxQDogiUNV9x8I"
  const src = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${coord.lat},${coord.long}`
  return (
    <>
      <iframe frameBorder="0" src={src}>
      </iframe>
    </>
  )
}

function ShowImage({ img }) {
  return <img src={img} />
}

function Autobahn() {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(false)
  const [autobahn, setAutobahn] = useState({})

  const findCam = () => {
    setLoading(true)
    fetchWebcam("A3")
      .then(bahn => {
        console.log(bahn)
        setLoading(false);
        setAutobahn(bahn);
      })
      .catch(e => {
        setLoading(false)
        setErr(true)
      })
  }

  useEffect(() => findCam(), []);

  if (loading) {
    return (
      <div>We're loading...</div>
    )
  } else if (!!err) {
    return (
      <div>Bad Stuff happened :/ ({err})</div>
    )
  } else if (!!autobahn?.cam) {
    return (
      <>
        <div>Von {autobahn.total} Cams, siehst du: {autobahn.cam.title}</div>

        <div class="row-container">
          <ShowImage img={autobahn.cam.imageurl} />
          <ShowPoint coord={autobahn.cam.coordinate} />
        </div>
        <div>{autobahn.cam.subtitle}</div>
        <button onClick={findCam}>Next please!</button>
        <div>{autobahn.cam.linkurl}</div>
      </>
    )
  } else {
    return <div>WHAT?!?!</div>
  }
}

function fetchWebcam(autobahnId) {
  return fetch(`https://verkehr.autobahn.de/o/autobahn/${autobahnId}/services/webcam`)
    .then(r => r.json())
    .then(r => r.webcam)
    .then(r => ({
      total: r.length,
      cam: r[Math.floor(Math.random() * r.length)]
    }))
}

export default function App() {
  return (
    <>
      <div className="App">
        <h1>Autobahn!</h1>
        <Autobahn />
      </div>
    </>
  );
}
