import { PreviewA4 } from "@diagoriente/react-preview-a4";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { resumeFields } from "../../data/resumeFields";
import styles from "./styles/resume.module.css";
import "../../styles/global.css";

const Resume = ({ resumeData, resumeRef }) => {
  const downloadAsPNG = async () => {
    const canvas = await html2canvas(resumeRef.current);
    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "resume.png";
    link.click();
  };

  const downloadAsPDF = async () => {
    const canvas = await html2canvas(resumeRef.current, {
      scale: 3, // Increase the scale for a higher resolution
    });
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    // Calculate the width and height to maintain the aspect ratio
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvasHeight * pdfWidth) / canvasWidth;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");
  };

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = { year: "numeric", month: "long" };
    return date.toLocaleDateString(undefined, options);
  }
  console.log(resumeFields);
  console.log(resumeData);

  return (
    <div className={styles.resumePreviewContainer}>
      <button style={{ margin: "0.5rem" }} onClick={downloadAsPNG}>
        Download as PNG
      </button>
      <button style={{ margin: "0.5rem" }} onClick={downloadAsPDF}>
        Download as PDF
      </button>
      <div ref={resumeRef}>
        <PreviewA4 print>
          <div className={styles.container}>
            <div className={styles.personalInfoHeader}>
              <h1 className={styles.userName}>
                {resumeData.personalInfo.name}
              </h1>
              <div className={styles.contactDetailsContainer}>
                <p className={styles.contactDetails}>
                  {resumeData.personalInfo.phone} |{" "}
                </p>
                <p className={styles.contactDetails}>
                  {" "}
                  {resumeData.personalInfo.linkedin} |{" "}
                </p>
                <p className={styles.contactDetails}>
                  {resumeData.personalInfo.email}
                </p>
              </div>
            </div>

            <div className={styles.educationSection}>
              <h2 className={styles.sectionHeading}>EDUCATION</h2>
              <hr />
              {resumeData.education.map((detail) => (
                <div className={styles.universityDetails}>
                  <div className={styles.universityNameAndLocation}>
                    <h3 className="margin-0">{detail.institution}</h3>
                    <p className="margin-0">{detail.location}</p>
                  </div>

                  <div className={styles.degreeNameAndDuration}>
                    <i>{detail.degree}</i>
                    <i>
                      {formatDate(detail.startDate)} -{" "}
                      {formatDate(detail.endDate)}
                    </i>
                  </div>
                </div>
              ))}
            </div>

            {resumeData.experience.length !== 0 && (
              <div className={styles.experienceSection}>
                <h2 className={styles.sectionHeading}>EXPERIENCE</h2>
                <hr />
                {resumeData.experience.map((experienceDetail) => (
                  <div className={styles.experienceDetails}>
                    <div className={styles.positionAndDate}>
                      <h3 className="margin-0">{experienceDetail.position}</h3>
                      <p className="margin-0">
                        {" "}
                        {formatDate(experienceDetail.startDate)} -{" "}
                        {formatDate(experienceDetail.endDate)}
                      </p>
                    </div>
                    <div className={styles.companyNameAndLocation}>
                      <i>{experienceDetail.company}</i>
                      <i>{experienceDetail.location}</i>
                    </div>
                    <ul className="margin-0">
                      <li>{experienceDetail.point1}</li>
                      <li>{experienceDetail.point2}</li>
                      <li>{experienceDetail.point3}</li>
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {resumeData.projects.length !== 0 && (
              <div className={styles.projectSection}>
                <h2 className={styles.sectionHeading}>PROJECT</h2>
                <hr />
                {resumeData.projects.map((projectDetail) => (
                  <div className={styles.projectDetails}>
                    <div className={styles.projectHeading}>
                      <div className={styles.projectNameAndTechStack}>
                        <h3 className="margin-0">{projectDetail.title} |</h3>
                        <i>{projectDetail.skills}</i>
                      </div>
                      <p className="margin-0">
                        {" "}
                        {formatDate(projectDetail.startDate)} -{" "}
                        {formatDate(projectDetail.endDate)}
                      </p>
                    </div>
                    <div>
                      <a href={projectDetail.link} target="_blank">
                        Link
                      </a>
                    </div>
                    <ul className="margin-0">
                      <li>{projectDetail.point1}</li>
                      <li>{projectDetail.point2}</li>
                      <li>{projectDetail.point3}</li>
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.skillsSection}>
              <h2 className={styles.sectionHeading}>SKILLS</h2>
              <hr />
            </div>
          </div>
        </PreviewA4>
      </div>
    </div>
  );
};

export default Resume;
{
  /* {resumeFields.map((section) => (
              <div key={section.sectionName} style={{ marginBottom: "20px" }}>
                <h2 className={styles.sectionName}>{section.sectionName}</h2>

                {Array.isArray(resumeData[section.id])
                  ? resumeData[section.id].map((dataBlock, blockIdx) => (
                      <div key={blockIdx} style={{ marginBottom: "15px" }}>
                        {section.fields.map((field) => (
                          <div
                            key={field.fieldName}
                            style={{ marginBottom: "10px" }}
                          >
                            <h3>
                              {field.label} {blockIdx + 1}
                            </h3>
                            <p>
                              {dataBlock[field.fieldName] ??
                                `No ${field.label}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    ))
                  : section.fields.map((field) => (
                      <div
                        key={field.fieldName}
                        style={{ marginBottom: "10px" }}
                      >
                        <h3>{field.label}</h3>
                        <p>
                          {resumeData[section.id]?.[field.fieldName] ??
                            `No ${field.label}`}
                        </p>
                      </div>
                    ))}
              </div>
            ))} */
}
