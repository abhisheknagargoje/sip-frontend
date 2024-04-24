"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MdDelete } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/custom/image-upload";
import { getCookie } from "cookies-next";
import { selectStudent } from "@/app/features/studentname/slice";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Link, MoveRight } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Blocks } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
const internship = () => {
  const [companyName, setCompanyName] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const [internshipdata, setInternshipData] = useState<any>([]);
  const student = useSelector(selectStudent);
  const [loading, setLoading] = useState(false);
  // completetion Letter
  const [selectedFileCL, setSelectedFileCL] = useState<Array<File | null>>([]);
  const [loadingCL, setloadingCL] = useState(false);

  const [selectedFilePL, setSelectedFilePL] = useState<Array<File | null>>([]);
  const [selectedfilePLT, setSelectedFilePLT] = useState<any>(null);

  //Offer Letter
  const [selectedFileOL, setSelectedFileOL] = useState<Array<File | null>>([]);
  const [loadingOL, setloadingOL] = useState(false);
  const [offerscore, setofferscore] = useState(0);
  const [open, setisOpen] = useState(false);
  const [opend, setisOpend] = useState(false);

  const handleNameChange = (event: any) => {
    setCompanyName(event.target.value);
  };

  const handleDurationChange = (event: any) => {
    setDuration(event.target.value);
  };

  const handleStatusChange = (event: any) => {
    setStatus(event.target.value);
  };

  const submitInternshipHandler = (event: any) => {
    event.preventDefault();

    const data = {
      companyName: companyName,
      duration: duration,
      status: status,
      id: student._id,
    };
    try {
      const studentCookie = getCookie("Student");
      if (!studentCookie) {
        console.error("Student cookie not found");
        return;
      }
      const { student, accessToken } = JSON.parse(studentCookie);
      if (!student || !student._id) {
        console.error("Student ID not found in cookie");
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const url = `https://sip-backend-api.onrender.com/api/v1/student/addinternshipDetails`;
      axios
        .post(url, data, config)
        .then((response) => {
          setInternshipData(response.data.data);
          setisOpen(false);
          fetchInternshipData();
          toast.success("InterShip Added Succesfully");
        })
        .catch((error) => {
          console.error("Error fetching Internship Data:", error);
          toast.error("Error");
        });
    } catch (error) {
      toast.error("Error");
    }
  };

  const fetchInternshipData = () => {
    const studentCookie = getCookie("Student");
    if (!studentCookie) {
      console.error("Student cookie not found");
      return;
    }
    const { student, accessToken } = JSON.parse(studentCookie);
    if (!student || !student._id) {
      console.error("Student ID not found in cookie");
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const url = `https://sip-backend-api.onrender.com/api/v1/student/${student._id}/internship `;
    axios
      .get(url, config)
      .then((response) => {
        setInternshipData(response.data.data);
        setisOpen(false);
      })
      .catch((error) => {
        console.error("Error fetching Internship Data:", error);
      });
  };

  useEffect(() => {
    fetchInternshipData();
  }, []);

  //Permission Letter
  const handleCompeletionOL = (
    event: React.FormEvent<HTMLFormElement>,
    index: number,
    id: number
  ) => {
    event.preventDefault();
    setloadingOL(true);
    const file = selectedFileOL[index];
    console.log(selectedFilePL);

    if (file) {
      const studentCookie = getCookie("Student");
      if (!studentCookie) {
        console.error("Student cookie not found");
        setloadingOL(false);
        return;
      }

      const { accessToken, student } = JSON.parse(studentCookie);

      const formData = new FormData();
      formData.append("offerLetter", file);
      formData.append("id", id.toString());
      console.log(formData);
      const url = `https://sip-backend-api.onrender.com/api/v1/student/uploadOfferLetter`;
      axios
        .post(url, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response: any) => {
          console.log("File uploaded successfully:", response.data);
          fetchInternshipData();
          toast.success("File uploaded successfully");
          setloadingOL(false);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          toast.error("Error uploading file");
          setloadingOL(false);
        });
    } else {
      console.error("No file selected");
      toast.error("No file selected");
      setLoading(false);
    }

    // Proceed with uploading the file
  };

  const handleCompeletionPL = (
    event: React.FormEvent<HTMLFormElement>,
    index: number,
    id: number
  ) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true when upload starts
    const file = selectedFilePL[index];
    // console.log(selectedFilePL);

    if (file) {
      const studentCookie = getCookie("Student");
      if (!studentCookie) {
        console.error("Student cookie not found");
        setLoading(false); // Reset loading state
        return;
      }
      const { accessToken, student } = JSON.parse(studentCookie);
      const formData = new FormData();
      formData.append("permissionLetter", file);
      formData.append("id", id.toString());
      console.log(formData);
      const url = `https://sip-backend-api.onrender.com/api/v1/student/uploadPermissionLetter`;
      axios
        .post(url, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response: any) => {
          console.log("File uploaded successfully:", response.data);
          fetchInternshipData();
          setLoading(false); // Reset loading state when upload finishes
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          setLoading(false); // Reset loading state on error
        });
    } else {
      console.error("No file selected");
      setLoading(false); // Reset loading state
    }
  };

  const handleCompeletionCL = (
    event: React.FormEvent<HTMLFormElement>,
    index: number,
    id: number
  ) => {
    event.preventDefault();
    setloadingCL(true);
    const file = selectedFileCL[index];
    if (file) {
      const studentCookie = getCookie("Student");
      if (!studentCookie) {
        setloadingCL(false);
        console.error("Student cookie not found");
        return;
      }

      const { accessToken, student } = JSON.parse(studentCookie);

      const formData = new FormData();
      formData.append("completionLetter", file);
      formData.append("id", id.toString());
      console.log(formData);
      const url = `https://sip-backend-api.onrender.com/api/v1/student/uploadCompletionLetter`;
      axios
        .post(url, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response: any) => {
          console.log("File uploaded successfully:", response.data);
          fetchInternshipData();
          toast.success("File uploaded successfully");
          setloadingCL(false);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          toast.error("Error uploading file");
          setloadingCL(false);
        });
    } else {
      console.error("No file selected");
      toast.error("No file selected");
      setloadingCL(false);
    }

    // Proceed with uploading the file
  };

  const openPdfInNewTab = (file: File) => {
    const pdfUrl = URL.createObjectURL(file);
    window.open(pdfUrl, "_blank");
  };

  const handleFileChangeOL = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const updatedFiles = [...selectedFileOL];
      updatedFiles[index] = files[0];
      setSelectedFileOL(updatedFiles);
    }
  };

  const handleFileChangePL = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const updatedFiles = [...selectedFilePL];
      updatedFiles[index] = files[0];
      setSelectedFilePL(updatedFiles);
    }
  };

  const handleFileChangeCL = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const updatedFiles = [...selectedFileCL];
      updatedFiles[index] = files[0];
      setSelectedFileCL(updatedFiles);
    }
  };

  const handleDeleteinterhship = async (event: any, id: number) => {
    console.log(id);
    try {
      const studentCookie = getCookie("Student");
      if (!studentCookie) {
        setloadingCL(false);
        console.error("Student cookie not found");
        return;
      }

      const { accessToken, student } = JSON.parse(studentCookie);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const deleteres = await axios.delete(
        `https://sip-backend-api.onrender.com/api/v1/student/deleteInternship/${id}`,
        config
      );

      if (deleteres.status === 200) {
        console.log("Internship deleted successfully");
        toast.success("Internship deleted successfully");
        setisOpend(false);
        fetchInternshipData();
        // Update the data after successful deletion if required
      } else {
        console.error("Error deleting internship:", deleteres.statusText);
        toast.error("Error deleting internship");
        setisOpend(false);
      }
    } catch (error) {
      console.error("Error occurred while deleting internship:", error);
      toast.error("Error occurred while deleting internship");
      setisOpend(false);
      // Handle any network or other errors that may occur during deletion
    }
  };

  return (
    <div>
      <div className="p-5 flex gap-5">
        <Dialog open={open} onOpenChange={setisOpen}>
          <DialogTrigger className="flex items-center px-3 py-2 text-white bg-black rounded-sm focus:outline-none cursor-pointer">
            ADD INTERNSHIP
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Internship Details</DialogTitle>
            </DialogHeader>
            <form onSubmit={submitInternshipHandler}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="companyName" className="text-right">
                    Internship Name
                  </Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={handleNameChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Duration (in weeks)
                  </Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={handleDurationChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Input
                    id="status"
                    value={status}
                    onChange={handleStatusChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger className="flex items-center px-3 py-2 text-white bg-red-600 rounded-sm focus:outline-none cursor-pointer">
            DEADLINE INFO
          </DialogTrigger>
          <DialogContent className=" max-w-2xl ">
            <DialogHeader>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center  rounded-md ml-14 mr-14 p-5 border-gray-300 border-4">
              <div className="mb-4">
                <div className="border border-gray-300 bg-red-500 rounded-md p-1 w-52 text-center text-white font-bold">
                  IMPORTANT
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Please read the following carefully:
                </p>
              </div>
              <div className="flex justify-start m-5 p-5">
                <ul className="list-disc font-semibold text-lg text-gray-700">
                  <li>
                    These are the deadlines for students to submit their
                    internship and seminar PDFs.
                  </li>
                  <li>Students must submit the PDFs before the deadline.</li>
                  <li>
                    If failed to do so, students must meet with their respective
                    mentor.
                  </li>
                </ul>
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {internshipdata && internshipdata.length > 0 && (
        <div className=" mt-8">
          {internshipdata.map((internship: any, index: any) => (
            <Card key={index} className="w-[80vw] max-w-[150vh] mt-5">
              <CardHeader>
                <CardTitle className="text-3xl text-center">
                  <div className="relative">
                    <div
                      className="absolute top-0 right-0 p-2"
                      aria-label="Delete"
                    >
                      <Dialog open={opend} onOpenChange={setisOpend}>
                        <DialogTrigger>
                          <div>
                            <Button variant={"destructive"} size={"lg"}>
                              DELETE
                            </Button>
                          </div>
                          {/* <div className="bg-red-500 rounded-full p-3">
                            <MdDelete
                              className="w-6 h-6 cursor-pointer text-white"
                              onClick={() =>
                                handleDeleteinterhship(internship.id)
                              }
                            />
                          </div> */}
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              <div>
                                This action cannot be undone. This will
                                permanently delete your internship details and
                                remove your data from our servers.
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col justify-center space-y-2">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="companyName"
                                className="text-base font-semibold w-40"
                              >
                                Company Name:
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
                                Status:
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
                                Duration (in weeks):
                              </Label>
                              <div className="flex items-center border rounded-md px-3 py-1">
                                <span className="text-sm">
                                  {internship?.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              onClick={(event) => {
                                handleDeleteinterhship(event, internship._id);
                              }}
                              size={"lg"}
                              variant={"destructive"}
                            >
                              CONFIRM
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  INTERNSHIP DETAILS
                </CardTitle>
                <CardDescription className="text-lg text-center"></CardDescription>
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
                          Company Name:
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
                          Status:
                        </Label>
                        <div className="flex items-center border rounded-md px-3 py-1">
                          <span className="text-sm">{internship?.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="startDate"
                          className="text-base font-semibold w-40"
                        >
                          Duration (in weeks):
                        </Label>
                        <div className="flex items-center border rounded-md px-3 py-1">
                          <span className="text-sm">
                            {internship?.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex p-2 text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none cursor-pointer">
                        <p>DeadLine:</p>
                        <p>
                          {internship && internship.deadline
                            ? format(internship.deadline, "dd-MM-yyyy")
                            : "No deadline available"}
                        </p>
                      </div>
                    </div>

                    <div className="className=flex flex-col justify-center items-center mt-8">
                      <div className="w-full h-64 bg-slate-200 rounded-md flex flex-col justify-center items-center p-5">
                        <div className="w-full flex items-center justify-evenly  rounded-sm bg-white mt-2">
                          {loadingOL ? (
                            <div className="flex items-center">
                              <p className="p-2 m-2">Uploading file...</p>
                              <Blocks
                                height="40"
                                width="40"
                                color="#4fa94d"
                                ariaLabel="blocks-loading"
                                wrapperStyle={{}}
                                wrapperClass="blocks-wrapper"
                                visible={true}
                              />
                            </div>
                          ) : (
                            <>
                              {internship.offerLetter ? (
                                <div className="w-full flex items-center justify-between rounded-sm bg-white mt-2">
                                  <p className="p-2 m-2">Offer Letter :</p>
                                  <div className="flex">
                                    {parseFloat(
                                      (
                                        internship?.fileMatchResults
                                          ?.offerLetter?.matchScore * 100
                                      ).toString()
                                    ) > 60 ? (
                                      <div className="flex px-3 py-2 m-3 text-white bg-green-500 rounded-md hover:bg-green-700 focus:outline-none cursor-pointer">
                                        <p>Closest Match: </p>
                                        <p>
                                          "
                                          {
                                            internship?.fileMatchResults
                                              ?.offerLetter?.matchPhrase
                                          }
                                          " with
                                        </p>
                                        <p>
                                          {(
                                            internship?.fileMatchResults
                                              ?.offerLetter?.matchScore * 100
                                          )
                                            .toString()
                                            .slice(0, 5)}
                                          % similarity
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="flex px-3 py-2 m-3 text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none cursor-pointer">
                                        <p>Closest Match: </p>
                                        <p>
                                          "
                                          {
                                            internship?.fileMatchResults
                                              ?.offerLetter?.matchPhrase
                                          }
                                          " with{" "}
                                          {(
                                            internship?.fileMatchResults
                                              ?.offerLetter?.matchScore * 100
                                          )
                                            .toString()
                                            .slice(0, 5)}
                                          % similarity
                                        </p>
                                      </div>
                                    )}

                                    <button
                                      onClick={() =>
                                        window.open(
                                          internship.offerLetter.url,
                                          "_blank"
                                        )
                                      }
                                      className="px-3 py-2 m-3 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer"
                                    >
                                      Open PDF
                                    </button>
                                    <button
                                      // Add functionality for deleting the offer letter if needed
                                      className="px-3 py-2 m-3 text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full flex items-center justify-between rounded-sm bg-white mt-2">
                                  <p className="p-2 m-2">
                                    Upload the offer letter to see it here.
                                  </p>

                                  {new Date() <=
                                  new Date(internship.deadline) ? (
                                    <Dialog>
                                      <DialogTrigger className="flex items-center px-3 py-2 m-3 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer">
                                        Add Offer Letter
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Add Offer Letter
                                          </DialogTitle>
                                        </DialogHeader>
                                        <form
                                          onSubmit={(event) =>
                                            handleCompeletionOL(
                                              event,
                                              index,
                                              internship._id
                                            )
                                          }
                                        >
                                          <input
                                            type="file"
                                            onChange={(event) =>
                                              handleFileChangeOL(event, index)
                                            }
                                            accept=".pdf"
                                          />
                                          <DialogFooter className="p-5">
                                            <Button type="submit">
                                              Upload
                                            </Button>
                                          </DialogFooter>
                                        </form>
                                      </DialogContent>
                                    </Dialog>
                                  ) : (
                                    <div className="px-3 py-2 m-3 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer">
                                      Contact the mentor
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div className="w-full flex items-center justify-between rounded-sm bg-white mt-2">
                          {loading ? ( // Check if loading state is true
                            <div className="flex items-center">
                              <p className="p-2 m-2">Uploading file...</p>
                              <Blocks
                                height="40"
                                width="40"
                                color="#4fa94d"
                                ariaLabel="blocks-loading"
                                wrapperStyle={{}}
                                wrapperClass="blocks-wrapper"
                                visible={true}
                              />
                            </div>
                          ) : (
                            <div className="w-full flex items-center justify-evenly ">
                              {internship.permissionLetter ? (
                                <div className="w-full flex items-center justify-between  rounded-sm bg-white mt-2">
                                  <p className="p-2 m-2">Permission Letter :</p>
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
                                    <button
                                      // Add functionality for deleting the permission letter if needed
                                      className="px-3 py-2 m-3 text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full flex items-center justify-between rounded-sm bg-white mt-2">
                                  <p className="p-2 m-2">
                                    Upload the PDF file for the Permission
                                    Letter :
                                  </p>

                                  {new Date() <=
                                  new Date(internship.deadline) ? (
                                    <Dialog>
                                      <DialogTrigger className="flex items-center px-3 py-2 m-3 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer">
                                        Add Permission Letter
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Add Permission Letter
                                          </DialogTitle>
                                        </DialogHeader>
                                        <form
                                          onSubmit={(event) =>
                                            handleCompeletionPL(
                                              event,
                                              index,
                                              internship._id
                                            )
                                          }
                                        >
                                          <input
                                            type="file"
                                            onChange={(event) =>
                                              handleFileChangePL(event, index)
                                            }
                                            accept=".pdf"
                                          />
                                          <DialogFooter className="p-5">
                                            <Button type="submit">
                                              Upload
                                            </Button>
                                          </DialogFooter>
                                        </form>
                                      </DialogContent>
                                    </Dialog>
                                  ) : (
                                    <div className="px-3 py-2 m-3 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer">
                                      Contact the mentor
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="w-full flex items-center justify-evenly rounded-sm bg-white mt-2">
                          {loadingCL ? (
                            <div className="flex items-center">
                              <p className="p-2 m-2">Uploading file...</p>
                              <Blocks
                                height="40"
                                width="40"
                                color="#4fa94d"
                                ariaLabel="blocks-loading"
                                wrapperStyle={{}}
                                wrapperClass="blocks-wrapper"
                                visible={true}
                              />
                            </div>
                          ) : (
                            <>
                              {internship.completionLetter ? (
                                <div className="w-full flex items-center justify-between rounded-sm bg-white mt-2">
                                  <p className="p-2 m-2">Completion Letter :</p>
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
                                    <button
                                      // Add functionality for deleting the completion letter if needed
                                      className="px-3 py-2 m-3 text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full flex items-center justify-between rounded-sm bg-white mt-2">
                                  <p className="p-2 m-2">
                                    Upload the PDF file for the Completion
                                    Letter :
                                  </p>

                                  {new Date() <=
                                  new Date(internship.deadline) ? (
                                    <Dialog>
                                      <DialogTrigger className="flex items-center px-3 py-2 m-3 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer">
                                        Add Completion Letter
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Add Completion Letter
                                          </DialogTitle>
                                        </DialogHeader>
                                        <form
                                          onSubmit={(event) =>
                                            handleCompeletionCL(
                                              event,
                                              index,
                                              internship._id
                                            )
                                          }
                                        >
                                          <input
                                            type="file"
                                            onChange={(event) =>
                                              handleFileChangeCL(event, index)
                                            }
                                            accept=".pdf"
                                          />
                                          <DialogFooter className="p-5">
                                            <Button type="submit">
                                              Upload
                                            </Button>
                                          </DialogFooter>
                                        </form>
                                      </DialogContent>
                                    </Dialog>
                                  ) : (
                                    <div className="px-3 py-2 m-3 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer">
                                      Contact the mentor
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
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
    </div>
  );
};

export default internship;
