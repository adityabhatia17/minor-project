import { doc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import { auth, db } from "../../firebase";

import { resumeDataObj } from "../../data/resumeDataObj";
import AddDetails from "./AddDetails";
import Resume from "./Resume";
import styles from "./styles/playground.module.css";

const Playground = () => {
  const [user] = useAuthState(auth);
  const { tID } = useParams();
  const [templates, setTemplates] = useState();
  const [activeStep, setActiveStep] = useState(0);
  const [resumeData, setResumeData] = useState(resumeDataObj);

  async function fetchPlaygroundInfo() {
    if (user) {
      const docRef = doc(db, `users/${user.uid}/template`, tID);
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            const objectData = doc.data();
            setTemplates(objectData);
            console.log("Object data:", objectData.templateId);
          } else {
            console.log("Document not found!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    }
  }

  useEffect(() => {
    fetchPlaygroundInfo();
  }, []);

  const resumeRef = useRef(null);

  return (
    <div className={styles.container}>
      <AddDetails
        resumeData={resumeData}
        setResumeData={setResumeData}
        resumeRef={resumeRef}
      />
      <Resume resumeData={resumeData} resumeRef={resumeRef} />
    </div>
  );
};

export default Playground;
