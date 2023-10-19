import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  IconButton,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidChevronDownCircle } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { resumeFields } from "../../data/resumeFields";
import { auth, db } from "../../firebase";
import styles from "./styles/addDetails.module.css";
import Color from "../../theme/theme";

export default function AddDetails({ resumeData, setResumeData, resumeRef }) {
  const { tID } = useParams();
  const [user, loading] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  async function fetchUserInfo() {
    if (user) {
      try {
        const docRef = doc(db, `users/${user.uid}/template/${tID}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("DOC DATA>>>", docSnap.data());
          setResumeData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (e) {
        console.error("Error fetching the document:", e);
      }
    }
  }

  const downloadAsPDF = async () => {
    const canvas = await html2canvas(resumeRef.current, {
      scale: 3,
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvasHeight * pdfWidth) / canvasWidth;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

    // Save locally
    // pdf.save('resume.pdf');

    // Save to Firebase
    // const blob = pdf.output('blob');
    // const storageRef = ref(storage, 'resumes/' + 'YOUR_DESIRED_FILENAME.pdf');
    // await uploadBytes(storageRef, blob);
    // const downloadURL = await getDownloadURL(storageRef);
    // console.log('File available at', downloadURL);
  };

  const saveData = async () => {
    try {
      console.log("My Dataa", resumeData);
      const docRef = doc(db, `users/${user.uid}/template`, tID);
      await setDoc(
        docRef,
        { ...resumeData, updatedAt: Timestamp.now() },
        { merge: true }
      );
      setOpen(true);
      setNotification({ message: "Saved Successfully", type: "success" });
      console.log(`Document ${tID} updated successfully!`);
    } catch (e) {
      setNotification({
        message: "Error Saving The Document",
        type: "error",
      });
      console.error("Error updating the document:", e);
    }
  };

  useEffect(() => {
    if (!loading && tID) fetchUserInfo();
  }, [loading, tID]);

  if (loading) {
    return (
      <div style={{ width: "100%", padding: "20px", flex: 5 }}>
        <p>Loading...</p>
      </div>
    );
  } else
    return (
      <div className={styles.container}>
        <Typography variant="h2" fontWeight={600} color="#2D4048">
          Add your details
        </Typography>

        <div className={styles.saveBtnContainer}>
          <Button
            onClick={saveData}
            variant="contained"
            style={{ color: "white", fontWeight: 600 }}
          >
            Save Resume
          </Button>
        </div>

        <div className={styles.fieldsContainer}>
          {resumeFields.map((section, idx) => (
            <Accordion key={idx} style={{ borderRadius: "30px", border: 0 }}>
              <AccordionSummary
                expandIcon={
                  <BiSolidChevronDownCircle color="#CCF4E5" size={20} />
                }
                aria-controls={`panel${idx + 1}a-content`}
                id={`panel${idx + 1}a-header`}
                style={{
                  backgroundColor: Color.textColorDark,
                  color: Color.primaryColorLight,
                  borderRadius: "30px",
                  border: 0,
                }}
              >
                <Typography variant="h5" fontWeight={600}>
                  {section.sectionName}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {Array.isArray(resumeData[section.id]) ? (
                  resumeData[section.id].map((dataBlock, blockIdx) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        borderBottom: "1px solid lightgrey",
                        marginBottom: "20px",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        key={blockIdx}
                        style={{
                          display: "flex",
                          gap: "20px",
                          flexWrap: "wrap",
                          alignItems: "center",
                          padding: "20px",
                        }}
                      >
                        {section.fields.map((field) => (
                          <TextField
                            key={field.fieldName}
                            label={field.label}
                            type={field.type}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                            value={dataBlock[field.fieldName] || ""}
                            onChange={(e) => {
                              let newArray = [...resumeData[section.id]];
                              newArray[blockIdx][field.fieldName] =
                                e.target.value;
                              setResumeData((prevData) => ({
                                ...prevData,
                                [section.id]: newArray,
                              }));
                              localStorage.setItem(
                                "userData",
                                resumeData[section.id]
                              );
                            }}
                            style={{ width: "18rem" }}
                          />
                        ))}
                      </div>
                      <Tooltip
                        title={`Delete ${blockIdx} ${section.sectionName} `}
                      >
                        <IconButton
                          onClick={() => {
                            let newArray = [...resumeData[section.id]];
                            newArray.splice(blockIdx, 1);
                            setResumeData((prevData) => ({
                              ...prevData,
                              [section.id]: newArray,
                            }));
                          }}
                          variant="text"
                        >
                          <AiFillDelete color="red" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  ))
                ) : (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
                  >
                    {section.fields.map((field) => (
                      <TextField
                        key={field.fieldName}
                        label={field.label}
                        type={field.type}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        value={resumeData[section.id]?.[field.fieldName] || ""}
                        onChange={(e) => {
                          setResumeData((prevData) => ({
                            ...prevData,
                            [section.id]: {
                              ...prevData[section.id],
                              [field.fieldName]: e.target.value,
                            },
                          }));
                        }}
                        style={{ width: "18rem" }}
                      />
                    ))}
                  </div>
                )}
                {Array.isArray(resumeData[section.id]) && (
                  <Button
                    onClick={() => {
                      setResumeData((prevData) => ({
                        ...prevData,
                        [section.id]: [...resumeData[section.id], {}],
                      }));
                    }}
                  >
                    Add {section.sectionName}
                  </Button>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
          >
            <Alert
              onClose={() => setOpen(false)}
              severity={notification.type}
              sx={{ width: "100%" }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </div>
      </div>
    );
}
