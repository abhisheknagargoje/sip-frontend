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
import toast from "react-hot-toast";
import { getCookie } from "cookies-next";

const Intermarks = ({ params }: { params: { studentId: string } }) => {
  const [student, setStudent] = useState<any>({});

  // storing all the total marks
  const [totalMarks, setTotalMarks] = useState<number>(0);

  // storing all the initial marks
  const [interMarks, setInterMarks] = useState<any[]>([]);

  // storing all the updated marks
  const [updatedMarks, setUpdatedMarks] = useState<
    { evaluationCriteria: string; marks: string }[]
  >([]);

  const [totalcriteria, setTotalCriteria] = useState(0);
  //dailog box open or close
  const [open, setOpen] = useState(false);
  const [internshipdata, setInternshipData] = useState([]);

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

        const interMarksUrl = `https://sip-backend-api.onrender.com/api/v1/student/${studentId}/internship/marks`;
        const interMarksRes = await axios.get(interMarksUrl, { headers });
        setInterMarks(interMarksRes.data.data);
        // console.log(interMarksRes.data.data);

        // Storing all the initial marks in the state
        const initialUpdatedMarks = interMarksRes.data.data.map(
          (mark: any) => ({
            evaluationCriteria: mark.criteriaId,
            marks: mark.studCriteriaMarks,
          })
        );
        setUpdatedMarks(initialUpdatedMarks);

        // Calculate total
        const total = interMarksRes.data.data.reduce(
          (total: any, mark: any) => total + mark.studCriteriaMarks,
          0
        );
        const totalcriteriamarks = interMarksRes.data.data.reduce(
          (totalcriteriamarks: any, mark: any) =>
            totalcriteriamarks + mark.criteriaTotalMarks,
          0
        );
        setTotalCriteria(totalcriteriamarks);

        setTotalMarks(total);
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
    event.preventDefault(); // Prevent default form submission behavior
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
      const evaluateUrl = `${baseUrl}/mentor/internship/evaluate/${studentId}`;

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
  const fetchInternshipData = () => {
    const mentorCookie = getCookie("Mentor");
    const studentId = params.studentId;

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
    const url = `https://sip-backend-api.onrender.com/api/v1/student/${studentId}/internship `;
    axios
      .get(url, { headers })
      .then((response) => {
        setInternshipData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching Internship Data:", error);
      });
  };

  useEffect(() => {
    fetchInternshipData();
  }, []);
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
              <div className="bg-white shadow-md rounded-md p-4">
                <h1 className="text-lg font-semibold mb-2">
                  Internship Details
                </h1>
                <Card>
                  <CardHeader>
                    <CardTitle>Internship Marks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {interMarks.map((mark: any, index: any) => (
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
                            {interMarks.map((mark: any, index: any) => (
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
                    <CardTitle>Internship pdfs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {internshipdata && internshipdata.length > 0 && (
                      <div className=" mt-8">
                        {internshipdata.map((internship: any, index: any) => (
                          <Card key={index} className="w-full max-w-full">
                            <CardHeader>
                              <CardTitle className="text-3xl text-center">
                                INTERNSHIP DETAILS
                              </CardTitle>
                              <CardDescription className="text-lg text-center">
                                Internship details
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <form>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                                  <div className="flex flex-col justify-center space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="companyName"
                                        className="text-base font-semibold w-40"
                                      >
                                        Company Name :
                                      </Label>
                                      <div className="flex items-center border rounded-md px-3 py-1">
                                        <span className="text-sm">
                                          {internship?.companyName}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="internshipType"
                                        className="text-base font-semibold w-40"
                                      >
                                        Status :
                                      </Label>
                                      <div className="flex items-center border rounded-md px-3 py-1">
                                        <span className="text-sm">
                                          {internship?.status}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="startDate"
                                        className="text-base font-semibold w-40"
                                      >
                                        Duration :
                                      </Label>
                                      <div className="flex items-center border rounded-md px-3 py-1">
                                        <span className="text-sm">
                                          {internship?.duration}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="className=flex flex-col justify-center items-center mt-8">
                                    <div className="w-full h-64 bg-slate-200 rounded-md flex flex-col justify-center items-center p-5">
                                      <div className="w-full flex items-center justify-evenly  rounded-sm bg-white mt-2">
                                        <>
                                          {internship.offerLetter ? (
                                            <div className="w-full flex items-center justify-between rounded-sm bg-white mt-2">
                                              <p className="p-2 m-2">
                                                Offer Letter :
                                              </p>
                                              <div className="flex">
                                                <button
                                                  onClick={() =>
                                                    window.open(
                                                      internship.offerLetter.url,
                                                      "_blank"
                                                    )
                                                  }
                                                  className="px-3 py-2 m-3 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer"
                                                >
                                                  Open PDF in New Tab
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="w-full flex items-center justify-between rounded-sm bg-white mt-2">
                                              <p className="p-2 m-2">
                                                Offer Letter
                                              </p>
                                              <p className="p-2 m-2">
                                                PDF not Uploaded
                                              </p>
                                            </div>
                                          )}
                                        </>
                                      </div>

                                      <div className="w-full flex items-center justify-between rounded-sm bg-white mt-2">
                                        <div className="w-full flex items-center justify-evenly ">
                                          {internship.permissionLetter ? (
                                            <div className="w-full flex items-center justify-between  rounded-sm bg-white mt-2">
                                              <p className="p-2 m-2">
                                                Permission Letter :
                                              </p>
                                              <div>
                                                <button
                                                  onClick={() =>
                                                    window.open(
                                                      internship.permissionLetter.url,
                                                      "_blank"
                                                    )
                                                  }
                                                  className="px-3 py-2 m-3 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer"
                                                >
                                                  Open PDF in New Tab
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="w-full flex items-center justify-between rounded-sm bg-white mt-2">
                                              <p className="p-2 m-2">
                                                Permission Letter
                                              </p>
                                              <p className="p-2 m-2">
                                                PDF not uploaded
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="w-full flex items-center justify-evenly rounded-sm bg-white mt-2">
                                        <>
                                          {internship.completionLetter ? (
                                            <div className="w-full flex items-center justify-between rounded-sm bg-white mt-2">
                                              <p className="p-2 m-2">
                                                Completion Letter :
                                              </p>
                                              <div className="flex">
                                                <button
                                                  onClick={() =>
                                                    window.open(
                                                      internship.completionLetter.url,
                                                      "_blank"
                                                    )
                                                  }
                                                  className="px-3 py-2 m-3 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer"
                                                >
                                                  Open PDF in New Tab
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="w-full flex items-center justify-between rounded-sm bg-white mt-2">
                                              <p className="p-2 m-2 ">
                                                Completion Letter
                                              </p>
                                              <p className="p-2 m-2">
                                                PDF not Uploaded
                                              </p>
                                            </div>
                                          )}
                                        </>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </CardContent>
                            <CardFooter className="flex justify-end"></CardFooter>
                          </Card>
                        ))}
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

export default Intermarks;
