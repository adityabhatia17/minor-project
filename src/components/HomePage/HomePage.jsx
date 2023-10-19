import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { resumeDataObj } from "../../data/resumeDataObj";
import { auth, db } from "../../firebase";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Modal,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import "./styles.css";

const HomePage = () => {
  const [user, loading] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState([]);

  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const navigate = useNavigate();

  const selectUserTemplate = async (template) => {
    try {
      console.log("template", template);
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/template`),
        {
          ...template,
          ...resumeDataObj,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
      );
      navigate(`/playground/${docRef.id}`);
      console.log("success", docRef.id);
    } catch (e) {
      console.error("error ", e);
    }
  };

  const onFinish = (values, type) => {
    console.log(values);
    const template = {
      templateId: values,
    };
    selectUserTemplate(template);
    handleClose();
  };

  const getTimeDifference = (timestamp) => {
    const now = Date.now() / 1000; // current time in seconds
    const timeDifference = now - timestamp?.seconds;

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;

    if (timeDifference < secondsInMinute) {
      return `${Math.round(timeDifference)} seconds ago`;
    } else if (timeDifference < secondsInHour) {
      return `${Math.round(timeDifference / secondsInMinute)} minutes ago`;
    } else if (timeDifference < secondsInDay) {
      return `${Math.round(timeDifference / secondsInHour)} hours ago`;
    } else {
      return `${Math.round(timeDifference / secondsInDay)} days ago`;
    }
  };

  async function fetchUserTemplates() {
    if (user) {
      const q = query(collection(db, `users/${user.uid}/template`));
      console.log(q);
      const querySnapshot = await getDocs(q);

      let templatesArray = [];
      querySnapshot.forEach((doc) => {
        templatesArray.push({ ...doc.data(), id: doc.id });
      });

      templatesArray = templatesArray.sort(
        (a, b) => b.updatedAt?.seconds - a.updatedAt?.seconds
      );

      setTemplates(templatesArray);
      console.log("Array>>>", templatesArray);
    }
  }

  useEffect(() => {
    fetchUserTemplates();
  }, []);
  if (loading) {
    return <div>Loading....</div>;
  } else
    return (
      <div>
        <AppBar position="static" style={{ backgroundColor: "#2D4048" }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontWeight: 700,
                  color: "#CCF4E5",
                  textDecoration: "none",
                }}
              >
                ResumeBuilder.
              </Typography>

              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,

                  fontWeight: 700,

                  color: "white",
                  textDecoration: "none",
                }}
              >
                ResumeBuilder.
              </Typography>
              <Box
                sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
              ></Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton
                    // onClick={handleOpenUserMenu}
                    sx={{ p: 0 }}
                  >
                    <Avatar alt="Remy Sharp" src={user?.photoURL} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Select Templates
            </Typography>
            <div>
              <div onClick={() => onFinish(1)}>Template 1</div>
            </div>
          </Box>
        </Modal>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {templates.map((template) => (
            <div
              onClick={() => navigate(`/playground/${template.id}`)}
              key={template.id}
              className="prev-template-wrapper"
            >
              <div className="prev-template-container">
                <div
                  style={{
                    width: "200px",
                    height: "100px",
                    border: "2px solid black",
                  }}
                >
                  TEMPLATE - {template.templateId}
                </div>
                <div>
                  <p>Created At - {getTimeDifference(template?.createdAt)}</p>
                  <p>Updated At - {getTimeDifference(template?.updatedAt)}</p>
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={() => setOpen(true)}
            className="add-button"
            variant="text"
            style={{ borderRadius: "100px" }}
          >
            <AddIcon style={{ color: "#2D4048" }} />
            <div style={{ color: "#2D4048" }}>New</div>
          </Button>
        </div>
      </div>
    );
};

export default HomePage;
