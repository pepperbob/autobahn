import React, { useEffect, useState } from "react";
import "./styles.css";

function Intro() {
  return <div>
    <p>This App uses the <a href="https://autobahn.api.bund.dev/" target="_blank">Autobahn GmbH API</a> to show you
    completely random pictures of famous German highways. And just in case you want to take a selfie... well
    it is pinpointed on the map so go ahead and find your direction.
    </p>
  </div>
}

function Footer() {
  return <p>In case you need to know:
    find the source code on <a href="https://github.com/pepperbob/autobahn">github.com</a>.</p>
}

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
  const [roads, setRoads] = useState([])
  const [currentRoad, setCurrentRoad] = useState("")

  const pickRoad = () => {
    setCurrentRoad(roads[Math.floor(Math.random() * roads.length)])
  }

  const pickRoadClickHandler = e => {
    e.stopPropagation();
    pickRoad();
  }

  useEffect(() => {
    setLoading(true)
    fetch("https://verkehr.autobahn.de/o/autobahn/")
      .then(r => r.json())
      .then(a => {
        setRoads(a.roads)
        setLoading(false);
      })
      .catch(err => setErr(err))
  }, [])

  useEffect(() => pickRoad(), [roads])

  const bahnComponent = <>
    <div>
      <p>
        This random Autobahn is called "{currentRoad}".
        I you don't like it, <a href="#" onClick={pickRoadClickHandler}>maybe you are lucky next time</a>.
      </p>
    </div>

    <CamView autobahnId={currentRoad}></CamView>
  </>

  if (loading)
    return <div>Loading Autobahn...</div>
  else if (!!err) {
    return <div>Sorry... but {err}</div>
  }
  else {
    return bahnComponent
  }
}

function CamView(props) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(false)
  const [cam, setCam] = useState()


  const findCam = () => {
    setLoading(true)
    fetchWebcam(props.autobahnId)
      .then(bahn => {
        setLoading(false);
        setCam(bahn);
      })
      .catch(e => {
        setLoading(false)
        setErr(true)
      })
  }

  const findCamClickHandler = e => {
    e.stopPropagation();
    findCam();
  }

  useEffect(() => findCam(), [props.autobahnId]);


  if (loading) {
    return (
      <div>We're loading... {props.autobahnId}</div>
    )
  } else if (!!err) {
    return (
      <div>Bad Stuff happened :/ ({err})</div>
    )
  } else if (!!cam?.cam) {
    return (
      <>
        <div>
          <p>
            The cam you see is at "{cam.cam.title}: {cam.cam.subtitle}".
        There are {cam.total} cams deployed - if this one looks boring to you <a href="#" onClick={findCamClickHandler}>just switch to a different one.</a>

          {
            !!cam.cam.linkurl ?
             <p>There is also a <a href={cam.cam.linkurl} target="_blank">video feed</a> available!!</p>
              : <></>
          }
        </p>
        </div>

        <div className="row-container">
          <ShowImage img={cam.cam.imageurl} />
          <ShowPoint coord={cam.cam.coordinate} />
        </div>

      </>
    )
  } else {
    return <div>Sorry, no Cams deployed on {props.autobahnId}</div>
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
        <Intro />
        <Autobahn />
        <Footer />
      </div>
    </>
  );
}
