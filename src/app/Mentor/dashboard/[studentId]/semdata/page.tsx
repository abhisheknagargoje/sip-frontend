"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCookie } from "cookies-next";

const StudentPage = ({ params }: { params: { studentId: string } }) => {
  const [student, setStudent] = useState<any>({});
  const [smarks, setSmarks] = useState<any[]>([]);
  const [updatedMarks, setUpdatedMarks] = useState<
    { evaluationCriteria: string; marks: string }[]
  >([]);

  const [totalMarks, setTotalMarks] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [totalcriteria, setTotalCriteria] = useState(0);
  const [seminarData, setSeminarData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mentorCookie = getCookie("Mentor");
        if (!mentorCookie) {
          console.error("Mentor cookie not found");
          return;
        }
        console.log(mentorCookie);

        const { accessToken, id } = JSON.parse(mentorCookie);

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          credentials: "include",
        };

        const studentId = params.studentId;
        const baseUrl = process.env.API_BASE_URL;
        const url = `${baseUrl}/student/${studentId}`;
        const response = await axios.get(url, { headers });
        setStudent(response.data.data);
        console.log(response.data.data);

        const smarksUrl = `https://sip-backend-api.onrender.com/api/v1/student/${studentId}/seminar/marks`;
        const smarksRes = await axios.get(smarksUrl, { headers });
        setSmarks(smarksRes.data.data);

        const seminarTotalMarks = smarksRes.data.data.reduce(
          (total: any, mark: any) => total + mark.studCriteriaMarks,
          0
        );
        const totalcriteriamarks = smarksRes.data.data.reduce(
          (totalcriteriamarks: any, mark: any) =>
            totalcriteriamarks + mark.criteriaTotalMarks,
          0
        );
        setTotalCriteria(totalcriteriamarks);
        // Set total seminar marks in state
        setTotalMarks(seminarTotalMarks);
        const initialUpdatedMarks = smarksRes.data.data.map((mark: any) => ({
          evaluationCriteria: mark.criteriaId,
          marks: mark.studCriteriaMarks,
        }));
        setUpdatedMarks(initialUpdatedMarks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.studentId]);
  const handleMarkChange = (index: number, newMarks: string) => {
    const updated = [...updatedMarks];
    updated[index] = {
      ...updated[index],
      marks: newMarks,
    };
    setUpdatedMarks(updated);
  };

  const handleSaveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const mentorCookie = getCookie("Mentor");
      if (!mentorCookie) {
        console.error("Mentor cookie not found");
        return;
      }
      console.log(mentorCookie);

      const { accessToken, id } = JSON.parse(mentorCookie);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        credentials: "include",
      };
      const studentId = params.studentId;
      const baseUrl = process.env.API_BASE_URL;
      const evaluateUrl = `${baseUrl}/mentor/seminar/evaluate/${studentId}`;

      // Send POST request with updated marks
      const response = await axios.post(evaluateUrl, updatedMarks, { headers });
      console.log(updatedMarks);
      // location.reload();
      const total = updatedMarks.reduce(
        (total: any, mark: any) => total + parseInt(mark.marks),
        0
      );

      setTotalMarks(total);
      toast.success(response.data.message);
      console.log("Changes saved successfully!");
      setOpen(false);
    } catch (error: any) {
      toast.error("Error saving changes:", error.response.data);
    }
  };
  const fetchSeminarData = () => {
    const mentorCookie = getCookie("Mentor");
    if (!mentorCookie) {
      console.error("Mentor cookie not found");
      return;
    }
    console.log(mentorCookie);
    const studentId = params.studentId;

    const { accessToken, id } = JSON.parse(mentorCookie);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      credentials: "include",
    };
    const url = `https://sip-backend-api.onrender.com/api/v1/student/${studentId}/seminar`;
    axios
      .get(url, { headers })
      .then((response) => {
        setSeminarData(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching Seminar Data:", error);
      });
  };
  useEffect(() => {
    fetchSeminarData();
  }, [params.studentId]);
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-gray-900 text-white py-6 text-center rounded-lg">
        <h1 className="text-3xl font-semibold">Student Details</h1>
        <h2 className="text-lg">Name: {student.fullName}</h2>
      </div>
      <div className="flex flex-grow">
        <div className="w-1/3 bg-white p-4">
          <div className="bg-white shadow-md rounded-md p-4">
            <h1 className="text-lg font-semibold mb-2">Personal Information</h1>
            <p>Email: {student.email}</p>
            <p>Roll Number: {student.rollNo}</p>
            <p>Mobile Number: {student.mobileNo}</p>
            <p>PRN Number: {student.prnNo}</p>
            <p>Registration Number: {student.registrationId}</p>
          </div>
        </div>
        <div className="w-2/3 bg-white p-4">
          <div className="flex flex-col h-full justify-between">
            <div className="mb-4">
              <div className="bg-white shadow-md rounded-md p-4 mb-4">
                <h1 className="text-lg font-semibold mb-2">Seminar Details</h1>
                <Card>
                  <CardHeader>
                    <CardTitle>Seminar Marks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {smarks.map((mark: any, index: any) => (
                        <div
                          key={index}
                          className="flex justify-between p-3 border border-gray-200 rounded-md"
                        >
                          <p className="font-semibold">{mark.criteriaName}</p>
                          <p>
                            {updatedMarks[index]?.marks} /{" "}
                            {mark.criteriaTotalMarks}
                          </p>
                        </div>
                      ))}
                      <div className="flex justify-between p-3 border border-gray-200 rounded-md">
                        <p className="font-semibold">Total Marks</p>
                        <p>
                          {totalMarks} / {totalcriteria}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button>Edit</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Marks</DialogTitle>
                          <DialogDescription>
                            Make changes to marks here. Click save when you're
                            done.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSaveChanges}>
                          <div className="grid gap-3 py-3">
                            {smarks.map((mark: any, index: any) => (
                              <div
                                key={index}
                                className="grid grid-cols-4 items-center gap-4"
                              >
                                <Label
                                  htmlFor={`criteria-${index}`}
                                  className="text-right"
                                >
                                  {mark.criteriaName}
                                </Label>
                                <Input
                                  id={`criteria-${index}`}
                                  defaultValue={updatedMarks[index]?.marks}
                                  className="col-span-3"
                                  onChange={(event) =>
                                    handleMarkChange(index, event.target.value)
                                  }
                                />
                              </div>
                            ))}
                          </div>
                          <DialogFooter>
                            <Button type="submit">Save changes</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Seminar PDFs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4"></div>
                    {seminarData.length === 0 && (
                      <div>
                        <p>No data available.</p>
                      </div>
                    )}
                    {seminarData.length > 0 && (
                      <div className="flex justify-center items-center mt-8">
                        <Card className="w-[50vw] max-w-[150vh]">
                          <CardHeader>
                            <CardTitle className="text-3xl text-center">
                              SEMINAR DETAILS
                            </CardTitle>
                            <CardDescription className="text-lg text-center">
                              Seminar details
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                              <div className="flex justify-center space-y-2">
                                <div className="flex items-center w-full max-w-xl">
                                  <Label
                                    htmlFor="companyName"
                                    className="text-md font-semibold w-24 md:w-32 mr-2 md:mr-4 text-right"
                                  >
                                    TITLE:
                                  </Label>
                                  <div className="flex items-center  border rounded-md px-4 py-2 w-1/2">
                                    <span className="text-base md:text-lg">
                                      {seminarData[0].title}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col justify-center items-center ">
                                <div className="w-3/4 h-64  rounded-md ">
                                  <div>
                                    {seminarData.length > 0 &&
                                    seminarData[0].report ? (
                                      <div className="flex items-center justify-between rounded-sm bg-slate-100 mt-2">
                                        <p className="p-2 m-2">Report</p>
                                        <div className="flex items-center">
                                          <button
                                            onClick={() =>
                                              window.open(
                                                seminarData[0].report.url,
                                                "_blank"
                                              )
                                            }
                                            className="px-3 py-2 m-3 text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none cursor-pointer"
                                          >
                                            Open PDF in New Tab
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between rounded-sm bg-slate-100 mt-2">
                                        <p className="p-2 m-2">
                                          Report NOt Uploaded
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  <div>
                                    {seminarData.length > 0 &&
                                    seminarData[0].abstract ? (
                                      <div className="flex items-center justify-between rounded-sm bg-slate-100 mt-2">
                                        <p className="p-2 m-2">Abstract</p>
                                        {seminarData[0].abstract && (
                                          <button
                                            onClick={() =>
                                              window.open(
                                                seminarData[0].abstract.url,
                                                "_blank"
                                              )
                                            }
                                            className="px-3 py-2 m-3 text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none cursor-pointer"
                                          >
                                            Open PDF in New Tab
                                          </button>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between rounded-sm bg-slate-100 mt-2">
                                        <p className="p-2 m-2">
                                          Upload the Abstract
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  <div>
                                    {seminarData[0].ppt ? (
                                      <div className="flex items-center justify-between rounded-sm bg-slate-100 mt-2">
                                        <p className="m-2 p-2">PPT :</p>
                                        <button
                                          onClick={() =>
                                            window.open(
                                              seminarData[0].ppt.url,
                                              "_blank"
                                            )
                                          }
                                          className="px-3 py-2 m-3 text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none cursor-pointer"
                                        >
                                          Open PPT in New Tab
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between rounded-sm bg-slate-100 mt-2">
                                        <p className="p-2 m-2">
                                          Upload the PPT
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-end"></CardFooter>
                        </Card>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end"></CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentPage;
