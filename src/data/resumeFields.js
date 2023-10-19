export const resumeFields = [
  {
    sectionName: "Personal Info",
    id: "personalInfo",
    fields: [
      {
        fieldName: "name",
        label: "Full Name",
        type: "text",
        placeHolder: "Eg: John Doe",
      },
      {
        fieldName: "email",
        label: "Email",
        type: "email",
        placeHolder: "xyz@gamil.com",
      },
      { fieldName: "phone", label: "Phone Number", type: "text" },
      { fieldName: "linkedin", label: "LinkedIn Profile", type: "url" },
    ],
  },
  {
    sectionName: "Education",
    id: "education",
    fields: [
      { fieldName: "institution", label: "Institution", type: "text" },
      { fieldName: "degree", label: "Degree", type: "text" },
      { fieldName: "location", label: "Location", type: "text" },
      { fieldName: "startDate", label: "Start Date", type: "date" },
      { fieldName: "endDate", label: "End Date", type: "date" },
    ],
  },
  {
    sectionName: "Experience",
    id: "experience",
    fields: [
      { fieldName: "position", label: "Position", type: "text" },
      { fieldName: "company", label: "Company", type: "text" },
      { fieldName: "location", label: "Location", type: "text" },
      { fieldName: "startDate", label: "Start Date", type: "date" },
      { fieldName: "endDate", label: "End Date", type: "date" },
      { fieldName: "point1", label: "Description 1", type: "textarea" },
      { fieldName: "point2", label: "Description 2", type: "textarea" },
      { fieldName: "point3", label: "Description 3", type: "textarea" },
    ],
  },
  {
    sectionName: "Projects",
    id: "projects",
    fields: [
      { fieldName: "title", label: "Title", type: "text" },
      { fieldName: "link", label: "Github Link/Deployed Link", type: "url" },
      { fieldName: "skills", label: "Tech Stack Used", type: "textarea" },
      { fieldName: "startDate", label: "Start Date", type: "date" },
      { fieldName: "endDate", label: "End Date", type: "date" },
      { fieldName: "point1", label: "Description 1", type: "textarea" },
      { fieldName: "point2", label: "Description 2", type: "textarea" },
      { fieldName: "point3", label: "Description 3", type: "textarea" },
    ],
  },
  {
    sectionName: "Skills",
    id: "skills",
    fields: [{ fieldName: "skillName", label: "Skill", type: "text" }],
  },
];
