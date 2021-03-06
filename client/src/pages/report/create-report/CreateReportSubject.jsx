import React from "react";
import "./CreateReportSubject.scss";

// import { reportSubjectArr } from "../../../config/getAPI";
import { useState, useEffect } from "react";

import { Button } from "../../../components/Button";
import { useParams } from "react-router-dom";
import { api } from "../../../api/api";
// import { scoreSubject } from "../../../config/getAPI";

export const CreateReportSubject = () => {
  const { subject, term, schoolYear } = useParams();
  const [reportSubjectState, setReportSubjectState] = useState([]);
  const [subjectState, setSubjectState] = useState([]);
  const [termState, setTermState] = useState([]);
  const [schoolYearState, setSchoolYearState] = useState([]);
  const [scoreSubjectState, setScoreSubjectState] = useState([]);
  const [classArr, setClassArrState] = useState([]);
  const [termIDState, setTermIDState] = useState([]);
  const [subjectIDState, setSubjectIDState] = useState([]);
  const [schoolYearIDState, setSchoolYearIDState] = useState([]);
  // let subjectID, termID, schoolYearID;

  useEffect(() => {
    const getData = async () => {
      const subjectArr = await api.getSubjectList();
      const termArr = await api.getTermList();
      const schoolYearArr = await api.getSchoolYearList();
      const scoreArr = await api.getScoreSubject();
      // const scoreArr = scoreSubject;

      const classArray = await api.getCCLASS();
      const reportSubject = await api.getReportSubjects();

      let subjectID = subjectArr.find(
        (item) => item.nameSubject === subject
      )._id;
      let termID = termArr.find((item) => item.nameTerm === term)._id;
      let schoolYearID = schoolYearArr.find(
        (item) => item.nameSchYear === schoolYear
      )._id;

      console.log(termArr, subjectArr, classArray, scoreArr, reportSubject);
      console.log(termID, subjectID, schoolYearID);

      console.log(reportSubject);
      reportSubject.forEach((item) => {
        console.log("delete");
        api.deleteReportSubject(item._id);
      });

      // scoreArr.forEach((item) => {
      //   // console.log("delete");
      //   api.deleteScoreSubject(item._id);
      // });

      // Ma tr???n c???p ba gi???a h???c k??, m??n, ds l???p -> m???i ?? s??? t???o th??nh 1 report
      // termArr.forEach((thisTerm) => {
      subjectArr.forEach((thisSubject) => {
        classArray.forEach((thisClass) => {
          let thisSchoolYear = schoolYearArr.find(
            (item) => item._id === thisClass.schoolYear
          );

          let isThereScore = scoreArr.find(
            (score) =>
              score.cClass === thisClass._id &&
              // score.term === thisTerm._id &&
              score.subject === thisSubject._id
            // score.cClass &&
            // score.subject &&
            // score.term
          );

          // console.log(
          //   "thisCLass...",
          //   thisClass._id,
          //   thisTerm._id,
          //   thisSubject._id,
          //   // thisSchoolYear
          //   scoreArr
          // );

          let isThereReport = reportSubject.find(
            (report) =>
              report.cClass === thisClass._id &&
              // report.term === thisTerm._id &&
              report.subject === thisSubject._id
          );

          console.log(
            "istherereport, isthereScore",
            isThereReport,
            isThereScore
          );
          // N???u c?? ??i???m nh??ng ch??a c?? trong b??o c??o th?? th??m v??o b??o c??o
          if (isThereScore && !isThereReport) {
            let total = thisClass.students.length;
            let passed = 0,
              rate;
            scoreArr.forEach((score) => {
              if (
                score.cClass === thisClass._id &&
                // score.term === thisTerm._id &&
                score.subject === thisSubject._id &&
                score.avgScore >= 5
              ) {
                passed++;
              }
            });
            let rateNumber = ((passed * 100) / total).toFixed(2);
            rate = rateNumber + "%";

            api.postReportSubject({
              subject: thisSubject._id,
              cClass: thisClass._id,
              term: "6299d1a3197adb1f05703d97",
              schoolYear: thisSchoolYear._id,
              totalStudents: total,
              passed: passed,
              rate: rate,
            });
          }
        });
      });
      // });

      const newReportSubject = await api.getReportSubjects();
      const UIarr = newReportSubject.filter(
        (item) =>
          // item.term === termID &&
          item.schoolYear === schoolYearID && item.subject === subjectID
      );

      console.log(newReportSubject, UIarr);

      setScoreSubjectState(scoreArr);
      setClassArrState(classArray);
      setSchoolYearState(schoolYearArr);
      setSubjectState(subjectArr);
      setTermState(termArr);
      setReportSubjectState(UIarr);
      setSubjectIDState(subjectID);
      setTermIDState(termID);
      setSchoolYearIDState(schoolYearID);
    };
    getData();
  }, []);

  return (
    <div className="create-report-subject">
      <h3>B??o c??o t???ng k???t m??n h???c</h3>
      <div className="score-info">
        <h4>{term}</h4>
        <h4>N??m h???c: {schoolYear}</h4>
        <h4>M??n h???c: {subject}</h4>
      </div>
      <div className="container">
        <div className="row heading">
          <div className="item col-25-percent center al-center">L???p</div>
          <div className="item col-25-percent center al-center">S?? s???</div>
          <div className="item col-25-percent center al-center">
            S??? l?????ng ?????t
          </div>
          <div className="item col-25-percent center al-center">T??? l???</div>
        </div>
        {reportSubjectState.map((item) => (
          <div className="row content">
            <div className="item col-25-percent center al-center">
              {classArr.find((classItem) => classItem._id === item.cClass)
                ? classArr.find((classItem) => classItem._id === item.cClass)
                    .nameClass
                : "10A5"}
            </div>
            <div className="item col-25-percent center al-center">
              {item.totalStudents}
            </div>
            <div className="item col-25-percent center al-center">
              {item.passed}
            </div>
            <div className="item col-25-percent center al-center">
              {item.rate}
            </div>
          </div>
        ))}
      </div>
      <div className="btns">
        <Button innerText="Xu???t k???t qu???" btnType="export" />
        <Button innerText="In k???t qu???" btnType="export" />
      </div>
    </div>
  );
};
